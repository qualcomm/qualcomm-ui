/**
 * Benchmarks FacetIndex indexing speed, memory usage, and filter passes across
 * dataset sizes.
 *
 * Every run of every size uses a fresh Node process, so heap state, JIT
 * feedback, and peak RSS never carry over. Items come from a seeded PRNG, so
 * runs with the same seed index identical data and are comparable across
 * commits.
 *
 * Timings vary more between processes than between samples within one process,
 * because JIT tiering and heap layout differ from run to run. Each size
 * therefore runs several times and reports the median of the per-run medians.
 *
 * Timing columns:
 * - rme: median of the per-run margins of error at 95% confidence.
 * - spread: range of the per-run medians as a percentage of the median. Compare
 *   results only when the difference exceeds the spread.
 *
 * Memory columns:
 * - index: bytes retained by the index after GC, excluding the items.
 * - heap allocated: JS heap bytes allocated while building one index,
 *   including garbage. Typed array buffers are counted in `index` instead.
 * - dataset: bytes retained by the generated items.
 * - peak RSS: the worker process high-water mark, dataset included.
 *
 * Usage:
 *   pnpm utils bench:facet-index
 *   pnpm utils bench:facet-index --sizes 1k,100k --time 5000 --json out.json
 */

import {fork} from "node:child_process"
import {writeFile} from "node:fs/promises"
import {cpus, totalmem} from "node:os"
import {dirname} from "node:path"
import {fileURLToPath} from "node:url"
import {parseArgs} from "node:util"
import {getHeapStatistics} from "node:v8"

import {
  FacetIndex,
  type FacetIndexConfig,
  type FacetIndexInput,
  type FacetIndexItem,
} from "../src/facet-index/index.js"

const defaultSizes = ["1k", "10k", "100k", "300k", "500k", "1m"]
const workerEnv = "FACET_INDEX_BENCH_JOB"
const scriptPath = fileURLToPath(import.meta.url)
const packageDir = dirname(dirname(scriptPath))

/** Minimum duration of one timed sample. Faster operations run in batches. */
const minSampleMs = 5
const maxSamples = 1000

interface BenchItem extends FacetIndexItem {
  category: string
  platforms: string[]
  releases: {channel: string}[]
  tags: string[]
  vendor: {name: string}
}

interface Job {
  minSamples: number
  seed: number
  size: number
  timeMs: number
}

interface Stats {
  /** Arithmetic mean in milliseconds per operation. */
  mean: number
  median: number
  min: number
  p95: number
  /** Relative margin of error of the mean at 95% confidence, in percent. */
  rme: number
  samples: number
}

interface ScenarioResult {
  /** Number of matching ids, as a sanity check on the scenario. */
  matches: number
  name: string
  stats: Stats
}

interface MemoryResult {
  dataset: number
  heapAllocated: number | null
  index: number
  peakRss: number
}

interface RunResult {
  build: Stats
  durationMs: number
  memory: MemoryResult
  scenarios: ScenarioResult[]
  size: number
}

/** Per-run statistics combined across runs. */
interface Summary {
  median: number
  p95: number
  rme: number
  samples: number
  /** Range of the per-run medians as a percentage of {@link median}. */
  spread: number
}

interface SizeResult {
  build: Summary
  durationMs: number
  memory: MemoryResult
  runs: RunResult[]
  scenarios: {matches: number; name: string; summary: Summary}[]
  size: number
}

interface Scenario {
  input: FacetIndexInput
  name: string
}

/**
 * Covers a low-cardinality single value, multi-valued arrays, a match-all
 * field, a nested path, and a long-tail field whose path flattens an array of
 * objects.
 */
const config: FacetIndexConfig = {
  fields: {
    category: {},
    channel: {path: "releases.channel"},
    platforms: {},
    tags: {match: "all"},
    vendor: {path: "vendor.name"},
  },
}

const pools = {
  category: createPool("Category", 12),
  channel: ["Beta", "LTS", "Nightly", "Stable"],
  platform: createPool("Platform", 8),
  tag: createPool("Tag", 200),
  vendor: createPool("Vendor", 1000),
}

/** Prevents the optimizer from discarding benchmarked work. */
let _sink = 0

function createPool(prefix: string, count: number): string[] {
  const width = String(count).length
  return Array.from(
    {length: count},
    (_, i) => `${prefix} ${String(i + 1).padStart(width, "0")}`,
  )
}

/** mulberry32 */
function createRandom(seed: number): () => number {
  let state = seed >>> 0
  return () => {
    state = (state + 0x6d2b79f5) >>> 0
    let t = state
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/**
 * Picks a pool entry, favoring earlier entries as `skew` grows above 1 so that
 * bucket counts follow a long-tail distribution like real catalogs.
 */
function pick(pool: string[], random: () => number, skew = 1): string {
  return pool[Math.floor(random() ** skew * pool.length)]
}

function pickDistinct(
  pool: string[],
  count: number,
  random: () => number,
  skew = 1,
): string[] {
  const picked: string[] = []
  while (picked.length < count) {
    const value = pick(pool, random, skew)
    if (!picked.includes(value)) {
      picked.push(value)
    }
  }
  return picked
}

function generateItems(size: number, random: () => number): BenchItem[] {
  const items: BenchItem[] = []
  for (let i = 0; i < size; i++) {
    items.push({
      category: pick(pools.category, random, 1.5),
      id: `item-${i}`,
      platforms: pickDistinct(
        pools.platform,
        1 + Math.floor(random() * 3),
        random,
        1.5,
      ),
      releases: pickDistinct(
        pools.channel,
        1 + Math.floor(random() * 3),
        random,
      ).map((channel) => ({channel})),
      tags: pickDistinct(pools.tag, Math.floor(random() * 7), random, 2),
      vendor: {name: pick(pools.vendor, random, 3)},
    })
  }
  return items
}

/**
 * Picks a random fraction of item ids in shuffled order, the way hits from a
 * preceding text search arrive in relevance order.
 */
function sampleIds(
  items: readonly BenchItem[],
  fraction: number,
  random: () => number,
): string[] {
  const ids = items.filter(() => random() < fraction).map((item) => item.id)
  for (let i = ids.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1))
    ;[ids[i], ids[j]] = [ids[j], ids[i]]
  }
  return ids
}

function createScenarios(
  items: readonly BenchItem[],
  random: () => number,
): Scenario[] {
  return [
    {input: {}, name: "no selections"},
    {
      input: {selections: {category: [pools.category[0]]}},
      name: "1 field, 1 value",
    },
    {
      input: {selections: {platforms: pools.platform.slice(0, 3)}},
      name: "1 field, 3 values",
    },
    {
      input: {selections: {tags: pools.tag.slice(0, 2)}},
      name: "match all, 2 values",
    },
    {
      input: {
        selections: {
          category: pools.category.slice(0, 4),
          channel: [pools.channel[3]],
          vendor: pools.vendor.slice(0, 50),
        },
      },
      name: "3 fields",
    },
    {
      input: {
        ids: sampleIds(items, 0.1, random),
        selections: {platforms: [pools.platform[0]]},
      },
      name: "10% candidate ids",
    },
  ]
}

function collectGarbage(type: "major" | "minor"): void {
  const {gc} = globalThis
  if (!gc) {
    throw new Error("The benchmark worker requires --expose-gc")
  }
  gc({type})
}

/** Heap and off-heap bytes in use after a full collection. */
function retainedBytes(): number {
  collectGarbage("major")
  const {external, heapUsed} = process.memoryUsage()
  return heapUsed + external
}

/**
 * Cumulative JS heap allocations. `total_allocated_bytes` is missing from
 * older V8 releases and from the Node type definitions.
 */
function allocatedBytes(): number | null {
  const stats = getHeapStatistics()
  return "total_allocated_bytes" in stats &&
    typeof stats.total_allocated_bytes === "number"
    ? stats.total_allocated_bytes
    : null
}

/** Two-tailed 95% critical values of Student's t for 1 to 30 degrees of freedom. */
const tTable = [
  12.706, 4.303, 3.182, 2.776, 2.571, 2.447, 2.365, 2.306, 2.262, 2.228, 2.201,
  2.179, 2.16, 2.145, 2.131, 2.12, 2.11, 2.101, 2.093, 2.086, 2.08, 2.074,
  2.069, 2.064, 2.06, 2.056, 2.052, 2.048, 2.045, 2.042,
]

function quantile(sorted: readonly number[], q: number): number {
  const position = (sorted.length - 1) * q
  const lower = Math.floor(position)
  const upper = Math.ceil(position)
  return sorted[lower] + (sorted[upper] - sorted[lower]) * (position - lower)
}

function summarize(times: readonly number[]): Stats {
  const sorted = [...times].sort((a, b) => a - b)
  const n = sorted.length
  const mean = sorted.reduce((sum, time) => sum + time, 0) / n
  const variance =
    n > 1
      ? sorted.reduce((sum, time) => sum + (time - mean) ** 2, 0) / (n - 1)
      : 0
  const critical = tTable[n - 2] ?? 1.96
  return {
    mean,
    median: quantile(sorted, 0.5),
    min: sorted[0],
    p95: quantile(sorted, 0.95),
    rme:
      n > 1 && mean > 0
        ? ((critical * Math.sqrt(variance / n)) / mean) * 100
        : 0,
    samples: n,
  }
}

/** Untimed runs that already exercised the measured code. */
interface Warmup {
  ms: number
  runs: number
}

/**
 * Warms up for half the time budget, counting `warmup`, then samples until both
 * `minSamples` and the budget are reached. Operations faster than
 * {@link minSampleMs} run in batches so that timer overhead stays negligible.
 *
 * `gc` runs before every sample so that one sample's garbage is not collected
 * on the next sample's clock. Use `"major"` only when each run leaves
 * old-generation garbage, such as a discarded index. A forced major GC makes
 * the following sample pay for concurrent sweeping, which inflated filter
 * timings by 2-3x and pushed their margin of error past 10%.
 */
function measure(
  run: () => void,
  {minSamples, timeMs}: Job,
  gc: "major" | "minor",
  warmup: Warmup = {ms: 0, runs: 0},
): Stats {
  collectGarbage("major")
  let {ms: warmupMs, runs} = warmup
  while (runs === 0 || warmupMs < timeMs / 2) {
    const runStart = performance.now()
    run()
    warmupMs += performance.now() - runStart
    runs++
  }
  const batch = Math.max(1, Math.ceil(minSampleMs / (warmupMs / runs)))

  const times: number[] = []
  const start = performance.now()
  while (
    times.length < maxSamples &&
    (times.length < minSamples || performance.now() - start < timeMs)
  ) {
    collectGarbage(gc)
    const sampleStart = performance.now()
    for (let i = 0; i < batch; i++) {
      run()
    }
    times.push((performance.now() - sampleStart) / batch)
  }
  return summarize(times)
}

/**
 * Measures the memory of one index, then times filter passes against it. The
 * index is scoped to this function so it can be collected before builds are
 * timed. The untimed build is returned as warmup for the build timings, which
 * saves a full build at large sizes.
 */
function measureIndex(
  items: readonly BenchItem[],
  scenarios: readonly Scenario[],
  job: Job,
) {
  const before = retainedBytes()
  const allocatedBefore = allocatedBytes()
  const buildStart = performance.now()
  const index = new FacetIndex(items, config)
  const buildMs = performance.now() - buildStart
  const allocatedAfter = allocatedBytes()
  const indexBytes = retainedBytes() - before

  const results = scenarios.map(({input, name}): ScenarioResult => {
    const matches = index.filter(input).ids.length
    const stats = measure(
      () => {
        _sink ^= index.filter(input).ids.length
      },
      job,
      "minor",
    )
    return {matches, name, stats}
  })

  return {
    buildWarmup: {ms: buildMs, runs: 1},
    heapAllocated:
      allocatedBefore === null || allocatedAfter === null
        ? null
        : allocatedAfter - allocatedBefore,
    indexBytes,
    results,
  }
}

function runJob(job: Job): RunResult {
  const start = performance.now()
  const random = createRandom(job.seed)

  const baseline = retainedBytes()
  const items = generateItems(job.size, random)
  const dataset = retainedBytes() - baseline

  const scenarios = createScenarios(items, random)
  const {buildWarmup, heapAllocated, indexBytes, results} = measureIndex(
    items,
    scenarios,
    job,
  )

  const build = measure(
    () => {
      _sink ^= new FacetIndex(items, config).fields.length
    },
    job,
    "major",
    buildWarmup,
  )

  return {
    build,
    durationMs: performance.now() - start,
    memory: {
      dataset,
      heapAllocated,
      index: indexBytes,
      peakRss: process.resourceUsage().maxRSS * 1024,
    },
    scenarios: results,
    size: job.size,
  }
}

function runInWorker(job: Job, heapLimitMb: number): Promise<RunResult> {
  return new Promise((resolve, reject) => {
    const child = fork(scriptPath, [], {
      cwd: packageDir,
      env: {...process.env, [workerEnv]: JSON.stringify(job)},
      execArgv: [
        ...process.execArgv,
        "--expose-gc",
        `--max-old-space-size=${heapLimitMb}`,
      ],
    })
    let result: RunResult | undefined
    child.once("message", (message) => {
      result = message as RunResult
    })
    child.once("error", reject)
    child.once("exit", (code, signal) => {
      if (result) {
        resolve(result)
      } else {
        reject(new Error(`Worker exited with ${signal ?? `code ${code}`}`))
      }
    })
  })
}

function medianOf(values: readonly number[]): number {
  return quantile(
    [...values].sort((a, b) => a - b),
    0.5,
  )
}

function summarizeRuns(stats: readonly Stats[]): Summary {
  const medians = stats.map(({median}) => median)
  const median = medianOf(medians)
  return {
    median,
    p95: medianOf(stats.map(({p95}) => p95)),
    rme: medianOf(stats.map(({rme}) => rme)),
    samples: stats.reduce((sum, {samples}) => sum + samples, 0),
    spread:
      median > 0
        ? ((Math.max(...medians) - Math.min(...medians)) / median) * 100
        : 0,
  }
}

function aggregate(runs: RunResult[]): SizeResult {
  const allocations = runs.map(({memory}) => memory.heapAllocated)
  return {
    build: summarizeRuns(runs.map(({build}) => build)),
    durationMs: runs.reduce((sum, {durationMs}) => sum + durationMs, 0),
    memory: {
      dataset: medianOf(runs.map(({memory}) => memory.dataset)),
      heapAllocated: allocations.every((bytes) => bytes !== null)
        ? medianOf(allocations)
        : null,
      index: medianOf(runs.map(({memory}) => memory.index)),
      peakRss: medianOf(runs.map(({memory}) => memory.peakRss)),
    },
    runs,
    scenarios: runs[0].scenarios.map(({matches, name}, scenario) => ({
      matches,
      name,
      summary: summarizeRuns(runs.map((run) => run.scenarios[scenario].stats)),
    })),
    size: runs[0].size,
  }
}

function parseSize(raw: string): number {
  const match = /^(\d+(?:\.\d+)?)(k|m|mil)?$/i.exec(raw.trim())
  if (!match) {
    throw new Error(
      `Invalid size "${raw}". Use a count such as 5000, 10k, or 1m.`,
    )
  }
  const unit = match[2]?.toLowerCase()
  const multiplier = unit === "k" ? 1e3 : unit ? 1e6 : 1
  const size = Math.round(Number(match[1]) * multiplier)
  if (size < 1) {
    throw new Error(`Size "${raw}" must be at least 1.`)
  }
  return size
}

function parsePositiveInt(raw: string, name: string): number {
  const value = Number(raw)
  if (!Number.isInteger(value) || value < 1) {
    throw new Error(`--${name} must be a positive integer, received "${raw}".`)
  }
  return value
}

function round(value: number): string {
  return value >= 100
    ? value.toFixed(0)
    : value >= 10
      ? value.toFixed(1)
      : value.toFixed(2)
}

function formatSize(size: number): string {
  if (size >= 1e6 && size % 1e5 === 0) {
    return `${size / 1e6}m`
  }
  if (size >= 1e3 && size % 100 === 0) {
    return `${size / 1e3}k`
  }
  return String(size)
}

function formatDuration(ms: number): string {
  if (ms < 1e-3) {
    return `${round(ms * 1e6)} ns`
  }
  if (ms < 1) {
    return `${round(ms * 1e3)} µs`
  }
  if (ms < 1e3) {
    return `${round(ms)} ms`
  }
  return `${round(ms / 1e3)} s`
}

function formatBytes(bytes: number | null): string {
  if (bytes === null) {
    return "n/a"
  }
  const units = ["B", "KiB", "MiB", "GiB"]
  let value = bytes
  let unit = 0
  while (Math.abs(value) >= 1024 && unit < units.length - 1) {
    value /= 1024
    unit++
  }
  return `${unit === 0 ? value.toFixed(0) : round(value)} ${units[unit]}`
}

function formatRate(perSecond: number): string {
  if (perSecond >= 1e6) {
    return `${round(perSecond / 1e6)}M/s`
  }
  if (perSecond >= 1e3) {
    return `${round(perSecond / 1e3)}k/s`
  }
  return `${round(perSecond)}/s`
}

/** Replaces the current terminal line. Does nothing when stderr is piped. */
function showStatus(message: string): void {
  if (process.stderr.isTTY) {
    process.stderr.write(`\r\x1b[K${message}`)
  }
}

function printTable(header: string[], rows: string[][]): void {
  const widths = header.map((title, column) =>
    Math.max(title.length, ...rows.map((row) => row[column].length)),
  )
  const line = (cells: string[]) =>
    cells
      .map((cell, column) =>
        column === 0
          ? cell.padEnd(widths[column])
          : cell.padStart(widths[column]),
      )
      .join("  ")
      .trimEnd()
  console.log(line(header))
  for (const row of rows) {
    console.log(line(row))
  }
}

function formatPercent(value: number, runs: number): string {
  return runs > 1 ? `${value.toFixed(1)}%` : "-"
}

function summaryRow(
  name: string,
  summary: Summary,
  runs: number,
  matches: string,
): string[] {
  return [
    name,
    formatDuration(summary.median),
    formatDuration(summary.p95),
    `±${summary.rme.toFixed(1)}%`,
    formatPercent(summary.spread, runs),
    String(summary.samples),
    matches,
  ]
}

function printSizeResult(result: SizeResult): void {
  const {build, memory, runs, scenarios, size} = result
  console.log(
    `\n${formatSize(size)} items, ${runs.length} ${runs.length === 1 ? "run" : "runs"} (${formatDuration(result.durationMs)})\n`,
  )
  printTable(
    ["", "median", "p95", "rme", "spread", "samples", "matches"],
    [
      summaryRow("build index", build, runs.length, ""),
      ...scenarios.map(({matches, name, summary}) =>
        summaryRow(`filter: ${name}`, summary, runs.length, String(matches)),
      ),
    ],
  )
  console.log(
    [
      `\nindex ${formatBytes(memory.index)} (${round(memory.index / size)} B/item)`,
      `heap allocated ${formatBytes(memory.heapAllocated)}`,
      `dataset ${formatBytes(memory.dataset)}`,
      `peak RSS ${formatBytes(memory.peakRss)}`,
    ].join(", "),
  )
}

function printSummary(results: SizeResult[]): void {
  console.log("\nIndexing\n")
  printTable(
    [
      "size",
      "build",
      "rme",
      "spread",
      "items/s",
      "index",
      "B/item",
      "heap allocated",
      "dataset",
      "peak RSS",
    ],
    results.map(({build, memory, runs, size}) => [
      formatSize(size),
      formatDuration(build.median),
      `±${build.rme.toFixed(1)}%`,
      formatPercent(build.spread, runs.length),
      formatRate(size / (build.median / 1e3)),
      formatBytes(memory.index),
      round(memory.index / size),
      formatBytes(memory.heapAllocated),
      formatBytes(memory.dataset),
      formatBytes(memory.peakRss),
    ]),
  )

  console.log("\nFilter (median)\n")
  printTable(
    ["scenario", ...results.map(({size}) => formatSize(size))],
    results[0].scenarios.map(({name}, scenario) => [
      name,
      ...results.map((result) =>
        formatDuration(result.scenarios[scenario].summary.median),
      ),
    ]),
  )
}

const usage = `Usage: pnpm utils bench:facet-index [options]

Options:
  --sizes <list>    Comma-separated item counts such as 5000, 10k, or 1m (default: ${defaultSizes.join(",")})
  --runs <n>        Fresh processes per size, aggregated by median (default: 3)
  --time <ms>       Sampling time budget per measurement (default: 200)
  --samples <n>     Minimum samples per measurement (default: 3)
  --seed <n>        PRNG seed for the generated items (default: 1)
  --json <path>     Write the full results to a JSON file
  -h, --help        Show this message`

async function main(): Promise<void> {
  const args = process.argv.slice(2)
  const {values} = parseArgs({
    args: args[0] === "--" ? args.slice(1) : args,
    options: {
      help: {short: "h", type: "boolean"},
      json: {type: "string"},
      runs: {default: "3", type: "string"},
      samples: {default: "3", type: "string"},
      seed: {default: "1", type: "string"},
      sizes: {default: defaultSizes.join(","), type: "string"},
      time: {default: "200", type: "string"},
    },
  })

  if (values.help) {
    console.log(usage)
    return
  }

  const sizes = values.sizes.split(",").map(parseSize)
  const runCount = parsePositiveInt(values.runs, "runs")
  const options = {
    minSamples: parsePositiveInt(values.samples, "samples"),
    seed: parsePositiveInt(values.seed, "seed"),
    timeMs: parsePositiveInt(values.time, "time"),
  }
  /** Large sizes exceed the default old-space limit. */
  const heapLimitMb = Math.floor((totalmem() / 2 ** 20) * 0.75)

  const results: SizeResult[] = []
  let failed = false
  for (const size of sizes) {
    const runs: RunResult[] = []
    try {
      for (let run = 1; run <= runCount; run++) {
        showStatus(`${formatSize(size)} items: run ${run}/${runCount}`)
        runs.push(await runInWorker({...options, size}, heapLimitMb))
      }
      showStatus("")
      const result = aggregate(runs)
      results.push(result)
      printSizeResult(result)
    } catch (error) {
      showStatus("")
      failed = true
      console.error(
        `\n${formatSize(size)} items failed on run ${runs.length + 1}:`,
        error,
      )
    }
  }

  if (results.length > 1) {
    printSummary(results)
  }

  if (values.json) {
    await writeFile(
      values.json,
      `${JSON.stringify(
        {
          cpu: cpus()[0]?.model,
          date: new Date().toISOString(),
          node: process.version,
          options: {...options, runs: runCount},
          results,
        },
        null,
        2,
      )}\n`,
    )
  }

  if (failed) {
    process.exitCode = 1
  }
}

const job = process.env[workerEnv]
if (job) {
  const result = runJob(JSON.parse(job) as Job)
  process.send?.(result, undefined, undefined, () => process.disconnect())
} else {
  await main()
}
