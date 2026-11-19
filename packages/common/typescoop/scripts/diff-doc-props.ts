// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

/**
 * Compares two doc-props.json files and prints the differences grouped by field.
 *
 * Usage: tsx scripts/diff-doc-props.ts <baseline.json> <candidate.json>
 *   [--field type] [--entity Name] [--limit 20] [--json out.json]
 */

import {readFile, writeFile} from "node:fs/promises"
import {parseArgs} from "node:util"

import type {
  QuiComment,
  QuiPropDeclaration,
  QuiPropTypes,
  SerializedType,
} from "@qualcomm-ui/typedoc-common"

interface Change {
  after: unknown
  before: unknown
  field: string
  path: string
}

const typeFields = [
  "type",
  "prettyType",
  "baseType",
  "importStatement",
  "docLink",
  "referenceLink",
  "reference",
  "inheritDoc",
  "required",
  "deprecated",
  "returnType",
] as const satisfies (keyof SerializedType)[]

const groups = ["props", "input", "output", "publicMethods"] as const

function commentText(comment: QuiComment | undefined): string | undefined {
  if (!comment) {
    return undefined
  }
  const summary = comment.summary.map((part) => part.text).join("")
  const tags = (comment.blockTags ?? [])
    .map((tag) => `${tag.tag} ${tag.content.map((part) => part.text).join("")}`)
    .join("\n")
  return [summary, tags].filter(Boolean).join("\n")
}

function compareResolved(
  path: string,
  before: SerializedType | undefined,
  after: SerializedType | undefined,
  changes: Change[],
) {
  for (const field of typeFields) {
    const a = before?.[field]
    const b = after?.[field]
    if (JSON.stringify(a) !== JSON.stringify(b)) {
      changes.push({after: b, before: a, field, path})
    }
  }
}

function compareProp(
  path: string,
  before: QuiPropDeclaration | undefined,
  after: QuiPropDeclaration | undefined,
  changes: Change[],
) {
  if (!before || !after) {
    changes.push({
      after: after ? "present" : undefined,
      before: before ? "present" : undefined,
      field: "prop",
      path,
    })
    return
  }
  if (before.type !== after.type) {
    changes.push({after: after.type, before: before.type, field: "kind", path})
  }
  if (before.defaultValue !== after.defaultValue) {
    changes.push({
      after: after.defaultValue,
      before: before.defaultValue,
      field: "defaultValue",
      path,
    })
  }
  const commentBefore = commentText(before.comment)
  const commentAfter = commentText(after.comment)
  if (commentBefore !== commentAfter) {
    changes.push({
      after: commentAfter,
      before: commentBefore,
      field: "comment",
      path,
    })
  }
  compareResolved(path, before.resolvedType, after.resolvedType, changes)
}

function compareEntity(
  name: string,
  before: QuiPropTypes,
  after: QuiPropTypes,
  changes: Change[],
) {
  const commentBefore = commentText(before.comment)
  const commentAfter = commentText(after.comment)
  if (commentBefore !== commentAfter) {
    changes.push({
      after: commentAfter,
      before: commentBefore,
      field: "comment",
      path: name,
    })
  }
  compareResolved(name, before.resolvedType, after.resolvedType, changes)
  for (const group of groups) {
    const beforeProps = new Map(
      (before[group] ?? []).map((prop) => [prop.name, prop]),
    )
    const afterProps = new Map(
      (after[group] ?? []).map((prop) => [prop.name, prop]),
    )
    for (const propName of new Set([
      ...beforeProps.keys(),
      ...afterProps.keys(),
    ])) {
      compareProp(
        `${name}.${group === "props" ? "" : `${group}:`}${propName}`,
        beforeProps.get(propName),
        afterProps.get(propName),
        changes,
      )
    }
  }
}

async function readProps(file: string): Promise<Record<string, QuiPropTypes>> {
  const json = JSON.parse(await readFile(file, "utf-8"))
  return json.props
}

async function main() {
  const {positionals, values} = parseArgs({
    allowPositionals: true,
    options: {
      entity: {type: "string"},
      field: {type: "string"},
      json: {type: "string"},
      limit: {default: "15", type: "string"},
    },
  })
  const [baselineFile, candidateFile] = positionals
  if (!baselineFile || !candidateFile) {
    throw new Error("Usage: diff-doc-props <baseline.json> <candidate.json>")
  }
  const [baseline, candidate] = await Promise.all([
    readProps(baselineFile),
    readProps(candidateFile),
  ])

  const changes: Change[] = []
  for (const name of new Set([
    ...Object.keys(baseline),
    ...Object.keys(candidate),
  ])) {
    if (values.entity && name !== values.entity) {
      continue
    }
    const before = baseline[name]
    const after = candidate[name]
    if (!before || !after) {
      changes.push({
        after: after ? "present" : undefined,
        before: before ? "present" : undefined,
        field: "entity",
        path: name,
      })
      continue
    }
    compareEntity(name, before, after, changes)
  }

  const filtered = values.field
    ? changes.filter((change) => change.field === values.field)
    : changes

  if (values.json) {
    await writeFile(values.json, JSON.stringify(filtered, null, 2))
  }

  const byField = Map.groupBy(filtered, (change) => change.field)
  const limit = Number(values.limit)
  for (const [field, fieldChanges] of byField) {
    console.log(`\n## ${field} (${fieldChanges.length})`)
    for (const change of fieldChanges.slice(0, limit)) {
      console.log(`- ${change.path}`)
      console.log(`    - ${JSON.stringify(change.before)}`)
      console.log(`    + ${JSON.stringify(change.after)}`)
    }
  }
  console.log(`\n${filtered.length} changes`)
}

await main()
