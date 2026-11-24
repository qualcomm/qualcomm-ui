/**
 * Generates the device fleet fixtures used by the filter demos. The output is
 * deterministic: the same seed always produces the same files.
 *
 * Usage: pnpm react-table-docs generate:device-data
 */
import {mkdir, writeFile} from "node:fs/promises"
import {fileURLToPath} from "node:url"

interface Device {
  batteryLevel: number
  category: string
  country: string
  enrolledAt: string
  firmware: string
  id: string
  lastSeenAt: string
  model: string
  name: string
  site: string
  status: string
}

interface Site {
  code: string
  name: string
  weight: number
}

interface Country {
  name: string
  sites: Site[]
  weight: number
}

interface Model {
  category: Category
  /**
   * Restricts the model to these countries. Regional models create model and
   * country combinations with zero devices.
   */
  countries?: string[]
  /**
   * Oldest to newest.
   */
  firmware: string[]
  name: string
  releasedAt: string
  weight: number
}

type Category = "Camera" | "Handheld" | "Sensor" | "Tracker"

type Status = "Offline" | "Online" | "Retired" | "Updating"

const SEED = 20261101
const DEVICE_COUNT = 100_000
const SMALL_DEVICE_COUNT = 10_000

/**
 * The fixtures are static, so every date is relative to this fixed point
 * instead of the current date.
 */
const NOW = Date.parse("2026-11-01T00:00:00Z")

const MINUTE = 60_000
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR

/**
 * Models released after this date are too new to have been retired.
 */
const RETIREMENT_CUTOFF = Date.parse("2025-01-01T00:00:00Z")

const categoryCodes: Record<Category, string> = {
  Camera: "cam",
  Handheld: "hnd",
  Sensor: "sen",
  Tracker: "trk",
}

const countries: Country[] = [
  {
    name: "United States",
    sites: [
      {code: "sdg", name: "San Diego", weight: 50},
      {code: "aus", name: "Austin", weight: 30},
      {code: "bou", name: "Boulder", weight: 20},
    ],
    weight: 35,
  },
  {
    name: "India",
    sites: [
      {code: "blr", name: "Bengaluru", weight: 45},
      {code: "hyd", name: "Hyderabad", weight: 40},
      {code: "maa", name: "Chennai", weight: 15},
    ],
    weight: 15,
  },
  {
    name: "Germany",
    sites: [
      {code: "muc", name: "Munich", weight: 70},
      {code: "nue", name: "Nuremberg", weight: 30},
    ],
    weight: 10,
  },
  {
    name: "United Kingdom",
    sites: [
      {code: "cbg", name: "Cambridge", weight: 65},
      {code: "fab", name: "Farnborough", weight: 35},
    ],
    weight: 8,
  },
  {
    name: "China",
    sites: [
      {code: "sha", name: "Shanghai", weight: 55},
      {code: "szx", name: "Shenzhen", weight: 45},
    ],
    weight: 8,
  },
  {
    name: "Japan",
    sites: [{code: "tyo", name: "Tokyo", weight: 100}],
    weight: 6,
  },
  {
    name: "Brazil",
    sites: [{code: "cpq", name: "Campinas", weight: 100}],
    weight: 5,
  },
  {
    name: "Canada",
    sites: [{code: "yyz", name: "Toronto", weight: 100}],
    weight: 4,
  },
  {
    name: "France",
    sites: [{code: "gnb", name: "Grenoble", weight: 100}],
    weight: 3,
  },
  {
    name: "South Korea",
    sites: [{code: "sel", name: "Seoul", weight: 100}],
    weight: 3,
  },
  {
    name: "Mexico",
    sites: [{code: "gdl", name: "Guadalajara", weight: 100}],
    weight: 2,
  },
  {
    name: "Australia",
    sites: [{code: "syd", name: "Sydney", weight: 100}],
    weight: 1,
  },
]

const models: Model[] = [
  {
    category: "Sensor",
    firmware: ["1.4.0", "1.5.2", "1.6.0"],
    name: "Atmos S1",
    releasedAt: "2023-03-01",
    weight: 18,
  },
  {
    category: "Sensor",
    firmware: ["2.0.0", "2.1.1", "2.2.0"],
    name: "Atmos S3",
    releasedAt: "2025-01-15",
    weight: 16,
  },
  {
    category: "Sensor",
    countries: ["Germany", "Japan", "United Kingdom", "United States"],
    firmware: ["3.0.0", "3.0.2"],
    name: "Atmos S3 Pro",
    releasedAt: "2026-03-10",
    weight: 6,
  },
  {
    category: "Tracker",
    firmware: ["4.1.0", "4.2.3", "4.3.0"],
    name: "Trace T1",
    releasedAt: "2023-06-01",
    weight: 10,
  },
  {
    category: "Tracker",
    firmware: ["5.0.1", "5.1.0", "5.2.4"],
    name: "Trace T2",
    releasedAt: "2024-09-01",
    weight: 15,
  },
  {
    category: "Tracker",
    countries: ["Australia", "China", "India", "Japan", "South Korea"],
    firmware: ["6.0.0", "6.0.1"],
    name: "Trace T2 Mini",
    releasedAt: "2026-02-01",
    weight: 5,
  },
  {
    category: "Camera",
    firmware: ["2.8.0", "2.9.1", "3.0.0"],
    name: "Lumen C2",
    releasedAt: "2023-09-01",
    weight: 6,
  },
  {
    category: "Camera",
    firmware: ["3.1.0", "3.2.1", "3.3.0"],
    name: "Lumen C4",
    releasedAt: "2025-05-01",
    weight: 10,
  },
  {
    category: "Camera",
    firmware: ["3.3.0", "3.4.0"],
    name: "Lumen C4 Pro",
    releasedAt: "2026-06-01",
    weight: 4,
  },
  {
    category: "Handheld",
    firmware: ["7.0.3", "7.1.0", "7.2.2"],
    name: "Relay H1",
    releasedAt: "2024-02-01",
    weight: 6,
  },
  {
    category: "Handheld",
    firmware: ["8.0.0", "8.1.0"],
    name: "Relay H2",
    releasedAt: "2025-10-01",
    weight: 4,
  },
]

/**
 * Firmware weights by version age, newest first.
 */
const firmwareWeights: Record<
  Exclude<Status, "Retired" | "Updating">,
  number[]
> = {
  Offline: [30, 40, 30],
  Online: [70, 25, 5],
}

/**
 * mulberry32, a small seeded PRNG. `Math.random` can't be seeded.
 */
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

const random = createRandom(SEED)

function randomInt(min: number, max: number): number {
  return min + Math.floor(random() * (max - min + 1))
}

function pickWeighted<T>(
  items: readonly T[],
  getWeight: (item: T) => number,
): T {
  const total = items.reduce((sum, item) => sum + getWeight(item), 0)
  let remaining = random() * total
  for (const item of items) {
    remaining -= getWeight(item)
    if (remaining < 0) {
      return item
    }
  }
  return items[items.length - 1]
}

function formatDate(time: number): string {
  return new Date(time).toISOString().slice(0, 10)
}

function formatDateTime(time: number): string {
  return `${new Date(time).toISOString().slice(0, 19)}Z`
}

function pickStatus(model: Model): Status {
  const canRetire = Date.parse(model.releasedAt) < RETIREMENT_CUTOFF
  const weights: Record<Status, number> = {
    Offline: canRetire ? 16 : 10,
    Online: 80,
    Retired: canRetire ? 5 : 0,
    Updating: 4,
  }
  return pickWeighted(Object.keys(weights) as Status[], (key) => weights[key])
}

function pickFirmware(model: Model, status: Status): string {
  const versions = model.firmware
  if (status === "Retired") {
    return versions[0]
  }
  if (status === "Updating") {
    // the device reports the version it is updating from
    return versions[versions.length - 2]
  }
  const newestFirst = [...versions].reverse()
  const weights = firmwareWeights[status]
  return pickWeighted(newestFirst, (version) => {
    return weights[newestFirst.indexOf(version)] ?? 0
  })
}

function pickBatteryLevel(status: Status): number {
  switch (status) {
    case "Offline":
      // most offline devices ran out of battery
      return random() < 0.75 ? randomInt(0, 15) : randomInt(16, 100)
    case "Online":
      return 20 + Math.round(80 * Math.sqrt(random()))
    case "Retired":
      return 0
    case "Updating":
      // updates only start above 30%
      return randomInt(30, 100)
  }
}

/**
 * Skews toward recent dates, since the fleet grows over time.
 */
function pickEnrolledAt(model: Model, status: Status): number {
  const start = Date.parse(model.releasedAt)
  const end = status === "Retired" ? NOW - 180 * DAY : NOW - DAY
  return start + Math.floor((end - start) * Math.sqrt(random()))
}

function pickLastSeenAt(status: Status, enrolledAt: number): number {
  switch (status) {
    case "Offline": {
      const days = Math.min(60, 1 - Math.log(1 - random()) * 12)
      return Math.max(NOW - days * DAY, enrolledAt + HOUR)
    }
    case "Online":
      return NOW - Math.floor(random() * 15 * MINUTE)
    case "Retired": {
      const start = enrolledAt + 30 * DAY
      const end = NOW - 90 * DAY
      return start + Math.floor(random() * (end - start))
    }
    case "Updating":
      return NOW - Math.floor(random() * HOUR)
  }
}

function generateDevices(count: number): Device[] {
  const sequences = new Map<string, number>()
  const devices: Device[] = []

  for (let i = 0; i < count; i++) {
    const country = pickWeighted(countries, (item) => item.weight)
    const site = pickWeighted(country.sites, (item) => item.weight)
    const model = pickWeighted(
      models.filter(
        (item) => !item.countries || item.countries.includes(country.name),
      ),
      (item) => item.weight,
    )
    const status = pickStatus(model)
    const enrolledAt = pickEnrolledAt(model, status)

    const prefix = `${site.code}-${categoryCodes[model.category]}`
    const sequence = (sequences.get(prefix) ?? 0) + 1
    sequences.set(prefix, sequence)

    devices.push({
      batteryLevel: pickBatteryLevel(status),
      category: model.category,
      country: country.name,
      enrolledAt: formatDate(enrolledAt),
      firmware: pickFirmware(model, status),
      id: `DV-${String(i + 1).padStart(6, "0")}`,
      lastSeenAt: formatDateTime(pickLastSeenAt(status, enrolledAt)),
      model: model.name,
      name: `${prefix}-${String(sequence).padStart(4, "0")}`,
      site: site.name,
      status,
    })
  }

  return devices
}

const outputDir = fileURLToPath(new URL("../public/data/", import.meta.url))
const devices = generateDevices(DEVICE_COUNT)

await mkdir(outputDir, {recursive: true})
await Promise.all([
  writeFile(`${outputDir}devices-100k.json`, JSON.stringify(devices)),
  writeFile(
    `${outputDir}devices-10k.json`,
    JSON.stringify(devices.slice(0, SMALL_DEVICE_COUNT)),
  ),
])

console.log(`Wrote ${DEVICE_COUNT} devices to ${outputDir}`)
