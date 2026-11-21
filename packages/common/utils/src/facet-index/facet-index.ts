// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {
  FacetBucket,
  FacetFieldConfig,
  FacetIndexConfig,
  FacetIndexInput,
  FacetIndexItem,
  FacetIndexResult,
} from "./types.js"

/** The indexed values of one configured field. */
interface FieldIndex {
  matchAll: boolean
  name: string
  /**
   * Start of each item's value ids in {@link valueIds}, plus a final end
   * offset, so item `i` owns `valueIds[offsets[i]]` up to
   * `valueIds[offsets[i + 1]]`.
   */
  offsets: Uint32Array
  /**
   * Each item's value ids, deduplicated per item. An id is the value's position
   * in {@link values}.
   */
  valueIds: Uint32Array
  valueIndex: Map<string, number>
  values: readonly string[]
}

/** A field with selections in the current filter pass. */
interface ActiveField {
  counts: Uint32Array
  field: FieldIndex
  /** 1 at the id of each selected value, 0 elsewhere. */
  marked: Uint8Array
  /** Number of selected values an item must have to match the field. */
  required: number
}

/**
 * Calls `visit` with each string value at `keys`, flattening arrays along the
 * path.
 */
function visitValues(
  value: unknown,
  keys: readonly string[],
  depth: number,
  visit: (value: string) => void,
): void {
  if (depth === keys.length) {
    if (typeof value === "string") {
      visit(value)
    }
    return
  }
  if (typeof value !== "object" || value === null) {
    return
  }
  const nested = (value as Record<string, unknown>)[keys[depth]]
  if (Array.isArray(nested)) {
    for (const entry of nested) {
      visitValues(entry, keys, depth + 1, visit)
    }
  } else {
    visitValues(nested, keys, depth + 1, visit)
  }
}

function indexField(
  items: readonly FacetIndexItem[],
  name: string,
  field: FacetFieldConfig,
  compare: (a: string, b: string) => number,
): FieldIndex {
  const keys = (field.path ?? name).split(".")
  const firstSeen = new Map<string, number>()
  const lastItemBySeenId: number[] = []
  const offsets = new Uint32Array(items.length + 1)
  const seenIds: number[] = []

  let index = 0
  const visit = (value: string) => {
    let id = firstSeen.get(value)
    if (id === undefined) {
      id = firstSeen.size
      firstSeen.set(value, id)
    }
    if (lastItemBySeenId[id] !== index) {
      lastItemBySeenId[id] = index
      seenIds.push(id)
    }
  }

  for (; index < items.length; index++) {
    offsets[index] = seenIds.length
    visitValues(items[index], keys, 0, visit)
  }
  offsets[items.length] = seenIds.length

  const values = [...firstSeen.keys()].sort(compare)
  const valueIndex = new Map(values.map((value, id) => [value, id]))
  const sortedIdBySeenId = [...firstSeen.keys()].map((value) =>
    valueIndex.get(value)!,
  )

  const valueIds = new Uint32Array(seenIds.length)
  for (let i = 0; i < seenIds.length; i++) {
    valueIds[i] = sortedIdBySeenId[seenIds[i]]
  }

  return {
    matchAll: field.match === "all",
    name,
    offsets,
    valueIds,
    valueIndex,
    values,
  }
}

function activateField(
  field: FieldIndex,
  counts: Uint32Array,
  selected: readonly string[],
): ActiveField {
  const marked = new Uint8Array(field.values.length)
  const unique = new Set(selected)
  for (const value of unique) {
    const id = field.valueIndex.get(value)
    if (id !== undefined) {
      marked[id] = 1
    }
  }
  /**
   * Unknown selected values still count toward `required`, so a match-all
   * field that selects a value missing from the data matches nothing.
   */
  return {counts, field, marked, required: field.matchAll ? unique.size : 1}
}

function matchesField(
  {field, marked, required}: ActiveField,
  index: number,
): boolean {
  const end = field.offsets[index + 1]
  let matched = 0
  for (let i = field.offsets[index]; i < end; i++) {
    matched += marked[field.valueIds[i]]
    if (matched >= required) {
      return true
    }
  }
  return false
}

function tally(field: FieldIndex, counts: Uint32Array, index: number): void {
  const end = field.offsets[index + 1]
  for (let i = field.offsets[index]; i < end; i++) {
    counts[field.valueIds[i]]++
  }
}

/**
 * In-memory faceted filtering. Fields combine with AND. Values within a field
 * combine according to the field's `match` setting.
 *
 * Bucket counts are disjunctive: for `"any"` fields, each bucket ignores the
 * field's own selections so that sibling values report how many results they
 * would add. For `"all"` fields, each bucket counts the current selections plus
 * that value.
 *
 * Field values are indexed once on construction. Each filter pass then visits
 * every candidate once, so its cost grows with the number of candidates and
 * their values rather than with the number of distinct values per field.
 */
export class FacetIndex<Item extends FacetIndexItem> {
  /**
   * The configured field names.
   */
  fields: readonly string[]
  private fieldIndexes: Map<string, FieldIndex>
  private indexById: Map<string, number>
  private items: Item[]

  /**
   * Indexes the values of each configured field. The items and config are
   * copied, so later mutations to either have no effect.
   */
  constructor(items: readonly Item[], config: FacetIndexConfig) {
    this.fields = []
    this.fieldIndexes = new Map()
    this.indexById = new Map()
    this.items = []
    this.reindex(items, config)
  }

  reindex(items: readonly Item[], config: FacetIndexConfig): void {
    this.fieldIndexes.clear()
    this.indexById.clear()
    const {compare} = new Intl.Collator()
    this.items = [...items]
    for (let i = 0; i < items.length; i++) {
      this.indexById.set(items[i].id, i)
    }
    for (const [name, field] of Object.entries(config.fields)) {
      this.fieldIndexes.set(name, indexField(this.items, name, field, compare))
    }
    this.fields = [...this.fieldIndexes.keys()]
  }

  /**
   * Returns every value of a field across all items, sorted. Returns an empty
   * array for unconfigured fields.
   */
  getValues(name: string): readonly string[] {
    return this.fieldIndexes.get(name)?.values ?? []
  }

  /**
   * Returns the matching item IDs and the bucket counts for every field.
   */
  filter(input: FacetIndexInput = {}): FacetIndexResult {
    const tallies = [...this.fieldIndexes.values()].map(
      (field) => [field, new Uint32Array(field.values.length)] as const,
    )
    const countsByField = new Map(tallies)
    const selectedByField = new Map<string, ReadonlySet<string>>()
    const active: ActiveField[] = []
    let excludesAll = false

    for (const [name, selected] of Object.entries(input.selections ?? {})) {
      if (selected.length === 0) {
        continue
      }
      const field = this.fieldIndexes.get(name)
      if (!field) {
        excludesAll = true
        continue
      }
      selectedByField.set(name, new Set(selected))
      active.push(activateField(field, countsByField.get(field)!, selected))
    }

    const ids: string[] = []
    if (!excludesAll) {
      const candidates = input.ids ? this.resolveIds(input.ids) : undefined
      const total = candidates?.length ?? this.items.length

      for (let position = 0; position < total; position++) {
        const index = candidates ? candidates[position] : position
        let failed: ActiveField | undefined
        let misses = 0
        for (const entry of active) {
          if (!matchesField(entry, index)) {
            failed = entry
            if (++misses > 1) {
              break
            }
          }
        }

        if (misses === 0) {
          ids.push(this.items[index].id)
          for (const [field, counts] of tallies) {
            tally(field, counts, index)
          }
        } else if (misses === 1 && failed && !failed.field.matchAll) {
          /**
           * A match-any bucket replaces the field's selections with its own
           * value, so an item that fails only this field still counts toward
           * the values it has.
           */
          tally(failed.field, failed.counts, index)
        }
      }
    }

    return {
      facets: Object.fromEntries(
        tallies.map(([field, counts]) => {
          const selected = selectedByField.get(field.name)
          return [
            field.name,
            field.values.map((key, id): FacetBucket => ({
              docCount: counts[id],
              key,
              selected: selected?.has(key) ?? false,
            })),
          ]
        }),
      ),
      ids,
    }
  }

  /**
   * Maps candidate ids to item indexes in the supplied order, skipping unknown
   * and repeated ids.
   */
  private resolveIds(ids: readonly string[]): number[] {
    const seen = new Uint8Array(this.items.length)
    const indexes: number[] = []
    for (const id of ids) {
      const index = this.indexById.get(id)
      if (index !== undefined && !seen[index]) {
        seen[index] = 1
        indexes.push(index)
      }
    }
    return indexes
  }
}
