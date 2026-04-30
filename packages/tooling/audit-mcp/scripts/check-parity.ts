#!/usr/bin/env tsx
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

/**
 * Parity check across the three rule-id sources of truth:
 *
 * 1. `@qualcomm-ui/audit-mcp` — the ground-truth rule registry.
 * 2. `@qualcomm-ui/eslint-plugin-react` — must register every audit rule that
 *    declares `eslintAvailable: true`.
 * 3. MDX frontmatter `qui.rules:` blocks — must carry user-facing metadata
 *    for every audit rule.
 *
 * Fails the build on any mismatch. Keep it mechanical — no yaml dependency,
 * no fancy frontmatter parsing. The MDX `qui.rules:` block structure is
 * pinned enough by the parity check itself that schema drift shows up here.
 */

import {readdir, readFile} from "node:fs/promises"
import {dirname, join, resolve} from "node:path"
import {fileURLToPath} from "node:url"

import {allRules} from "../src/rules"

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url))
const MONOREPO_ROOT = resolve(SCRIPT_DIR, "../../../..")

const ESLINT_PLUGIN_SOURCE = join(
  MONOREPO_ROOT,
  "packages/configs/eslint-plugin-react/src/plugin.ts",
)

const REACT_DOCS_COMPONENTS = join(
  MONOREPO_ROOT,
  "packages/docs/react-docs/src/routes/components+",
)

async function main(): Promise<void> {
  const auditRules = allRules
  const auditRuleIds = new Set(auditRules.map((rule) => rule.id))
  const eslintRuleIds = await getEslintRuleIds()
  const mdxRuleIds = await getMdxRuleIds()

  const errors: string[] = []

  for (const rule of auditRules) {
    if (!mdxRuleIds.has(rule.id)) {
      errors.push(
        `audit rule "${rule.id}" has no matching MDX \`qui.rules:\` entry under ${REACT_DOCS_COMPONENTS}`,
      )
    }
    if (rule.eslintAvailable && !eslintRuleIds.has(rule.id)) {
      errors.push(
        `audit rule "${rule.id}" declares eslintAvailable: true but is not registered in @qualcomm-ui/eslint-plugin-react`,
      )
    }
  }

  const duplicateAuditIds = findDuplicates(auditRules.map((rule) => rule.id))
  for (const id of duplicateAuditIds) {
    errors.push(`duplicate audit rule id "${id}"`)
  }

  if (errors.length > 0) {
    console.error("Parity check failed:")
    for (const error of errors) {
      console.error(`  - ${error}`)
    }
    process.exit(1)
  }

  console.log(
    `Parity check passed (${auditRuleIds.size} audit rule${auditRuleIds.size === 1 ? "" : "s"}, ${eslintRuleIds.size} eslint rule${eslintRuleIds.size === 1 ? "" : "s"}, ${mdxRuleIds.size} MDX rule${mdxRuleIds.size === 1 ? "" : "s"}).`,
  )
}

async function getEslintRuleIds(): Promise<Set<string>> {
  const source = await readFile(ESLINT_PLUGIN_SOURCE, "utf-8")
  const match = source.match(/export const rules = \{([\s\S]*?)\n\}/)
  if (!match) {
    return new Set()
  }
  const ids = new Set<string>()
  for (const m of match[1].matchAll(/["']([a-z][a-z0-9-]+)["']:/g)) {
    ids.add(m[1])
  }
  return ids
}

async function getMdxRuleIds(): Promise<Set<string>> {
  const entries = await readdir(REACT_DOCS_COMPONENTS, {withFileTypes: true})
  const ids = new Set<string>()

  for (const entry of entries) {
    if (!entry.isDirectory()) {
      continue
    }
    const componentName = entry.name.replace(/\+$/, "")
    const mdxPath = join(
      REACT_DOCS_COMPONENTS,
      entry.name,
      `_${componentName}.mdx`,
    )
    try {
      const content = await readFile(mdxPath, "utf-8")
      collectMdxRuleIds(content, ids)
    } catch {
      // Component directory without a sibling _<name>.mdx; skip.
    }
  }

  return ids
}

function collectMdxRuleIds(mdxContent: string, ids: Set<string>): void {
  const fmMatch = mdxContent.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!fmMatch) {
    return
  }
  const frontmatter = fmMatch[1]

  const quiIndex = frontmatter.search(/^qui:\s*$/m)
  if (quiIndex < 0) {
    return
  }
  const quiBlock = frontmatter.slice(quiIndex)

  for (const m of quiBlock.matchAll(/^\s*-\s+id:\s*([a-z][a-z0-9-]+)/gm)) {
    ids.add(m[1])
  }
}

function findDuplicates<T>(items: readonly T[]): T[] {
  const seen = new Set<T>()
  const dupes = new Set<T>()
  for (const item of items) {
    if (seen.has(item)) {
      dupes.add(item)
    }
    seen.add(item)
  }
  return [...dupes]
}

main().catch((error: unknown) => {
  console.error(error)
  process.exit(1)
})
