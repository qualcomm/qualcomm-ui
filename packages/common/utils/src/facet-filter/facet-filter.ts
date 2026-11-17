// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

/** Selected values keyed by facet field name. */
export type FacetSelections = Record<string, readonly string[]>

/** Configures how a field is read and matched. */
export interface FacetFieldConfig {
  /**
   * How selected values within this field combine. `"any"` matches items that
   * have at least one selected value, `"all"` matches items that have every
   * selected value.
   *
   * @default "any"
   */
  match?: "any" | "all"

  /**
   * Dot-separated path to the item's values for this field. Arrays along the
   * path are flattened. Defaults to the field name.
   */
  path?: string
}

/** Defines the fields available for faceted filtering. */
export interface FacetFilterConfig {
  /**
   * Facet fields keyed by name. The name is used as the key in
   * {@link FacetSelections} and {@link FacetFilterResult.facets}, and as the
   * value path when {@link FacetFieldConfig.path} is omitted.
   */
  fields: Record<string, FacetFieldConfig>
}

/** A filterable item with a unique identifier. */
export interface FacetFilterItem extends Record<string, unknown> {
  /**
   * Unique identifier, used for {@link FacetFilterInput.ids} and returned in
   * {@link FacetFilterResult.ids}.
   */
  id: string
}

/** A facet value and its result count. */
export interface FacetBucket {
  /**
   * Number of candidate items that would match if this value were selected,
   * given the selections in every other field.
   */
  docCount: number
  /**
   * The facet value.
   */
  key: string
  /**
   * Whether this value is in the field's current selections.
   */
  selected: boolean
}

/** Selections and optional candidate IDs for a filter pass. */
export interface FacetFilterInput {
  /**
   * Restricts both the results and the bucket counts to these items, e.g. the
   * hits from a preceding text search.
   */
  ids?: readonly string[]
  /**
   * Selected values keyed by field name. Fields with no selected values do not
   * filter.
   */
  selections?: FacetSelections
}

/** Matching item IDs and facet buckets. */
export interface FacetFilterResult {
  /**
   * Buckets for every configured field, keyed by field name. Each field lists
   * every value found in the full item set, sorted by key, including values
   * with a `docCount` of 0.
   */
  facets: Record<string, FacetBucket[]>
  /**
   * IDs of the candidate items that match all selections, in candidate order.
   */
  ids: string[]
}

function readValues(item: FacetFilterItem, path: string): string[] {
  let values: unknown[] = [item]

  for (const key of path.split(".")) {
    values = values.flatMap((value) => {
      if (typeof value !== "object" || value === null) {
        return []
      }
      const nested = (value as Record<string, unknown>)[key]
      return Array.isArray(nested) ? nested : [nested]
    })
  }

  return values.filter((value): value is string => typeof value === "string")
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
 * Counting is O(values × candidates) per field, which suits client-side data
 * sets of a few thousand items.
 */
export class FacetFilter<Item extends FacetFilterItem> {
  private readonly fields: Record<string, Required<FacetFieldConfig>>
  private readonly items: Item[]
  private readonly itemsById: Map<string, Item>
  private readonly valuesByField: Map<string, string[]>

  /**
   * Indexes the values of each configured field. The items and config are
   * copied, so later mutations to either have no effect.
   */
  constructor(items: readonly Item[], config: FacetFilterConfig) {
    this.items = [...items]
    this.itemsById = new Map(this.items.map((item) => [item.id, item]))
    this.fields = Object.fromEntries(
      Object.entries(config.fields).map(([name, field]) => [
        name,
        {match: field.match ?? "any", path: field.path ?? name},
      ]),
    )
    this.valuesByField = new Map()

    for (const [name, field] of Object.entries(this.fields)) {
      const values = new Set<string>()
      for (const item of this.items) {
        for (const value of readValues(item, field.path)) {
          values.add(value)
        }
      }
      this.valuesByField.set(
        name,
        [...values].sort((a, b) => a.localeCompare(b)),
      )
    }
  }

  /**
   * Returns the matching item IDs and the bucket counts for every field.
   */
  filter(input: FacetFilterInput = {}): FacetFilterResult {
    const selections = input.selections ?? {}
    const candidates = input.ids
      ? input.ids
          .map((id) => this.itemsById.get(id))
          .filter((item): item is Item => item !== undefined)
      : this.items

    const ids = candidates
      .filter((item) => this.matches(item, selections))
      .map((item) => item.id)

    const facets = Object.fromEntries(
      Object.keys(this.fields).map((name) => {
        const selected = selections[name] ?? []
        const buckets = (this.valuesByField.get(name) ?? []).map(
          (value): FacetBucket => ({
            docCount: candidates.filter((item) =>
              this.matchesBucket(item, selections, name, value),
            ).length,
            key: value,
            selected: selected.includes(value),
          }),
        )
        return [name, buckets]
      }),
    )

    return {facets, ids}
  }

  private matchesBucket(
    item: Item,
    selections: FacetSelections,
    name: string,
    value: string,
  ): boolean {
    const values =
      this.fields[name]?.match === "all"
        ? [...new Set([...(selections[name] ?? []), value])]
        : [value]

    return this.matches(item, {...selections, [name]: values})
  }

  private matches(item: Item, selections: FacetSelections): boolean {
    return Object.entries(selections).every(([name, selected]) => {
      if (selected.length === 0) {
        return true
      }

      const field = this.fields[name]
      if (!field) {
        return false
      }

      const itemValues = readValues(item, field.path)

      return field.match === "all"
        ? selected.every((value) => itemValues.includes(value))
        : selected.some((value) => itemValues.includes(value))
    })
  }
}
