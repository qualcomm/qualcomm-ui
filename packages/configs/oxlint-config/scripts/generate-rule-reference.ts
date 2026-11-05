import {readdir, rm, writeFile} from "node:fs/promises"
import path from "node:path"
import {fileURLToPath} from "node:url"
import {chromium, type Locator} from "playwright"

import {camelCase} from "@qualcomm-ui/utils/change-case"

type RuleSeverity = "error" | "off" | "warn"

interface ConfiguredRule {
  exportName: string
  severity: RuleSeverity
}

interface RulesTable {
  headers: string[]
  rows: string[][]
}

interface RuleRecord {
  category: string
  default: string
  fixable: string
  ruleName: string
  source: string
  version: string
}

const rulesUrl =
  "https://oxc.rs/docs/guide/usage/linter/rules.html?sort=name&dir=asc"

const requiredColumns = [
  "Rule name",
  "Source",
  "Category",
  "Default",
  "Fixable?",
  "Version",
]

const categoryOrder = [
  "correctness",
  "nursery",
  "pedantic",
  "perf",
  "restriction",
  "style",
  "suspicious",
]

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url))
const packageRoot = path.resolve(scriptDirectory, "..")
const ruleReferenceDirectory = path.join(packageRoot, "rule-reference")
const sourceDirectory = path.join(packageRoot, "src")

const normalizeText = (value: string) => value.replace(/\s+/gu, " ").trim()

const normalizeTableText = (value: string) =>
  normalizeText(value.replace(/[▲▼]/gu, ""))

const normalizeRuleName = (value: string) =>
  normalizeTableText(value).replace(/[^a-z0-9-]/giu, "")

const getGeneratedSeverity = (
  ruleId: string,
  configuredRules: Map<string, ConfiguredRule>,
) => configuredRules.get(ruleId)?.severity ?? "off"

const getRuleAliases = (ruleId: string) => {
  if (ruleId.includes("/")) {
    return [ruleId]
  }

  return [ruleId, `eslint/${ruleId}`]
}

const getSeverity = (value: unknown): RuleSeverity | undefined => {
  const severity = Array.isArray(value) ? value[0] : value

  if (severity === "error" || severity === 2) {
    return "error"
  }

  if (severity === "warn" || severity === 1) {
    return "warn"
  }

  if (severity === "off" || severity === 0) {
    return "off"
  }

  return undefined
}

const isRuleMap = (name: string, value: unknown) =>
  name.endsWith("Rules") &&
  typeof value === "object" &&
  value !== null &&
  !Array.isArray(value)

const asRuleMap = (value: unknown) => value as Record<string, unknown>

const loadConfiguredRules = async () => {
  const configuredRules = new Map<string, ConfiguredRule>()
  const entries = await readdir(sourceDirectory, {withFileTypes: true})

  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.endsWith(".ts")) {
      continue
    }

    const modulePath = path.join(sourceDirectory, entry.name)
    const moduleExports = (await import(modulePath)) as Record<string, unknown>

    for (const [exportName, value] of Object.entries(moduleExports)) {
      if (!isRuleMap(exportName, value)) {
        continue
      }

      for (const [ruleId, ruleValue] of Object.entries(asRuleMap(value))) {
        const severity = getSeverity(ruleValue)

        if (!severity) {
          throw new Error(`${exportName}.${ruleId} has unsupported severity`)
        }

        for (const ruleAlias of getRuleAliases(ruleId)) {
          configuredRules.set(ruleAlias, {exportName, severity})
        }
      }
    }
  }

  return configuredRules
}

const parseExcludedSources = () => {
  const excludedSources = new Set<string>()
  const args = process.argv.slice(2)

  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index] ?? ""

    if (argument === "--help" || argument === "-h") {
      console.log(`Usage: node --import=tsx scripts/generate-rule-reference.ts [--exclude-source <source>] [--exclude-source=<source>]

Options:
  --exclude-source <source>  Skip every rule from the given OXC source. Can be repeated.
  --help, -h                 Show this help message.`)
      process.exit(0)
    }

    if (argument.startsWith("--exclude-source=")) {
      const source = normalizeText(argument.slice("--exclude-source=".length))

      if (!source) {
        throw new Error("--exclude-source requires a source name")
      }

      excludedSources.add(source)
      continue
    }

    if (argument === "--exclude-source") {
      const source = normalizeText(args[index + 1] ?? "")

      if (!source) {
        throw new Error("--exclude-source requires a source name")
      }

      excludedSources.add(source)
      index += 1
      continue
    }

    throw new Error(`Unknown argument: ${argument}`)
  }

  return excludedSources
}

const getColumnIndex = (headers: string[], columnName: string) => {
  const index = headers.indexOf(columnName)

  if (index === -1) {
    throw new Error(`Missing required column: ${columnName}`)
  }

  return index
}

const getRulesTable = async (): Promise<RulesTable | undefined> => {
  const browser = await chromium.launch()

  try {
    const page = await browser.newPage()

    await page.goto(rulesUrl, {waitUntil: "networkidle"})
    await page.waitForSelector("table")

    for (const table of await page.locator("table").all()) {
      const headers = (await table.locator("thead th").allTextContents()).map(
        normalizeTableText,
      )

      if (!requiredColumns.every((column) => headers.includes(column))) {
        continue
      }

      return {
        headers,
        rows: await getTableRows(table),
      }
    }

    return undefined
  } finally {
    await browser.close()
  }
}

const getTableRows = async (table: Locator) => {
  const rows: string[][] = []

  for (const row of await table.locator("tbody tr").all()) {
    rows.push(
      (await row.locator("td").allTextContents()).map(normalizeTableText),
    )
  }

  return rows
}

const parseRuleRows = ({headers, rows}: RulesTable): RuleRecord[] => {
  const ruleNameIndex = getColumnIndex(headers, "Rule name")
  const sourceIndex = getColumnIndex(headers, "Source")
  const categoryIndex = getColumnIndex(headers, "Category")
  const defaultIndex = getColumnIndex(headers, "Default")
  const fixableIndex = getColumnIndex(headers, "Fixable?")
  const versionIndex = getColumnIndex(headers, "Version")

  return rows.map((row, index) => {
    if (row.length !== headers.length) {
      throw new Error(
        `Row ${index + 1} has ${row.length} cells, expected ${headers.length}`,
      )
    }

    const record = {
      category: normalizeText(row[categoryIndex]),
      default: normalizeText(row[defaultIndex]),
      fixable: normalizeText(row[fixableIndex]),
      ruleName: normalizeRuleName(row[ruleNameIndex]),
      source: normalizeText(row[sourceIndex]),
      version: normalizeText(row[versionIndex]),
    }

    if (!record.ruleName || !record.source || !record.category) {
      throw new Error(
        `Row ${index + 1} is missing Rule name, Source, or Category`,
      )
    }

    return record
  })
}

const groupRules = (records: RuleRecord[], excludedSources: Set<string>) => {
  const sources = new Map<string, Map<string, RuleRecord[]>>()

  for (const record of records) {
    if (excludedSources.has(record.source)) {
      continue
    }

    if (!sources.has(record.source)) {
      sources.set(record.source, new Map())
    }

    const categories = sources.get(record.source)

    if (!categories) {
      throw new Error(`Could not create source group: ${record.source}`)
    }

    if (!categories.has(record.category)) {
      categories.set(record.category, [])
    }

    const rules = categories.get(record.category)

    if (!rules) {
      throw new Error(`Could not create category group: ${record.category}`)
    }

    rules.push(record)
  }

  return sources
}

const getOrderedCategories = (categories: Map<string, RuleRecord[]>) => {
  const orderedCategories = categoryOrder.filter((category) =>
    categories.has(category),
  )

  for (const category of categories.keys()) {
    if (!orderedCategories.includes(category)) {
      orderedCategories.push(category)
    }
  }

  return orderedCategories
}

const generateSourceFile = (
  source: string,
  categories: Map<string, RuleRecord[]>,
  configuredRules: Map<string, ConfiguredRule>,
) => {
  const lines = [
    `// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.`,
    `// SPDX-License-Identifier: BSD-3-Clause-Clear`,
    "",
    `import type {DummyRuleMap} from "oxlint"`,
    "",
  ]

  const availableCategories = new Set<string>()

  for (const [categoryIndex, category] of getOrderedCategories(
    categories,
  ).entries()) {
    availableCategories.add(category)
    if (categoryIndex > 0) {
      lines.push("")
    }

    lines.push(`const ${category}: DummyRuleMap = {`)

    for (const record of categories.get(category) ?? []) {
      const ruleId = `${source}/${record.ruleName}`
      const configuredRule = configuredRules.get(ruleId)

      lines.push(
        configuredRule
          ? `  ${getRuleMetadataComment(record)}`
          : `  ${getReviewTodo(record)}`,
      )

      lines.push(
        `  "${ruleId}": "${getGeneratedSeverity(ruleId, configuredRules)}",`,
      )
    }

    lines.push("}")
  }

  lines.push("")
  lines.push(`export const ${camelCase(source)}Rules: DummyRuleMap = {`)

  for (const cat of availableCategories) {
    lines.push(`  ...${cat},`)
  }
  lines.push("}")

  return `${lines.join("\n")}\n`
}

const getReviewTodo = (record: RuleRecord) =>
  `// TODO: decide whether to enable. default=${record.default ? "error" : "off"}; fixable=${record.fixable || "none"}; version=${record.version}`

const getRuleMetadataComment = (record: RuleRecord) =>
  `// default=${record.default ? "error" : "off"}; category=${record.category}; fixable=${record.fixable || "none"}; version=${record.version}`

const removeGeneratedSourceFiles = async () => {
  const entries = await readdir(ruleReferenceDirectory, {withFileTypes: true})

  await Promise.all(
    entries
      .filter((entry) => entry.isFile() && entry.name.endsWith(".js"))
      .map((entry) => rm(path.join(ruleReferenceDirectory, entry.name))),
  )
}

const writeRuleReferenceFiles = async (
  sources: Map<string, Map<string, RuleRecord[]>>,
  configuredRules: Map<string, ConfiguredRule>,
) => {
  await removeGeneratedSourceFiles()

  await Promise.all(
    [...sources.entries()].map(([source, categories]) =>
      writeFile(
        path.join(ruleReferenceDirectory, `${source}.ts`),
        generateSourceFile(source, categories, configuredRules),
      ),
    ),
  )
}

const main = async () => {
  const excludedSources = parseExcludedSources()
  const configuredRules = await loadConfiguredRules()
  const table = await getRulesTable()

  if (!table) {
    throw new Error("Could not find the OXC rules table")
  }

  const records = parseRuleRows(table)

  if (records.length === 0) {
    throw new Error("No OXC rule rows were parsed")
  }

  const sources = groupRules(records, excludedSources)
  const parsedSources = new Set(records.map((record) => record.source))
  const unknownExcludedSources = [...excludedSources].filter(
    (source) => !parsedSources.has(source),
  )

  if (unknownExcludedSources.length > 0) {
    throw new Error(
      `Unknown excluded source: ${unknownExcludedSources.join(", ")}`,
    )
  }

  if (sources.size === 0) {
    throw new Error("No OXC rule sources remain after exclusions")
  }

  await writeRuleReferenceFiles(sources, configuredRules)

  const includedRecords = records.filter(
    (record) => !excludedSources.has(record.source),
  )
  const fixableCount = includedRecords.filter((record) => record.fixable).length
  const excludedSourceList = [...excludedSources].join(", ") || "none"

  console.log(
    `Generated ${includedRecords.length} rules across ${sources.size} sources (${fixableCount} fixable, ${configuredRules.size} configured). Excluded sources: ${excludedSourceList}.`,
  )
}

await main()
