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
   *
   * @example
   * ```ts
   * // item: {target: {os: "linux"}}
   * path: "target.os" // values: ["linux"]
   *
   * // item: {devices: [{chip: "SM8650"}, {chip: "SM8550"}]}
   * path: "devices.chip" // values: ["SM8650", "SM8550"]
   *
   * // item: {targets: [{os: ["android", "linux"]}, {os: "windows"}]}
   * path: "targets.os" // values: ["android", "linux", "windows"]
   * ```
   */
  path?: string
}

/** Defines the fields available for faceted filtering. */
export interface FacetIndexConfig<Key extends string = "id"> {
  /**
   * Facet fields keyed by name. The name is used as the key in
   * {@link FacetSelections} and {@link FacetIndexResult.facets}, and as the
   * value path when {@link FacetFieldConfig.path} is omitted.
   */
  fields: Record<string, FacetFieldConfig>

  /**
   * Key of each item's unique string identifier, used for
   * {@link FacetIndexInput.ids} and returned in {@link FacetIndexResult.ids}.
   *
   * @default "id"
   */
  idField?: Key
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
export interface FacetIndexInput {
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
export interface FacetIndexResult {
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
