// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type ReactNode, useMemo} from "react"

import {getVariants} from "./get-variants.js"
import {mergeAllOf} from "./merge-all-of.js"
import {
  OptionPicker,
  type PickedOption,
  usePickedOption,
} from "./option-picker.js"
import {
  SchemaProperties,
  SchemaProperty,
  SchemaVariants,
} from "./schema-property.js"
import type {JsonSchema} from "./schema-type.js"

export type OpenApiContent = Record<string, {schema?: JsonSchema}>

export interface MediaTypeGroup {
  mediaTypes: string[]
  schema?: JsonSchema
}

const payloadKeys = new Set(["const", "default", "enum", "example", "examples"])

/**
 * `xml` only describes how a schema is serialized as XML, which these tables
 * don't show, so it's left out when comparing schemas. Property names and
 * example data are kept as they are.
 */
function withoutXml(node: unknown, inProperties = false): unknown {
  if (Array.isArray(node)) {
    return node.map((item) => withoutXml(item))
  }
  if (!node || typeof node !== "object") {
    return node
  }
  return Object.fromEntries(
    Object.entries(node)
      .filter(([key]) => inProperties || key !== "xml")
      .map(([key, value]) => [
        key,
        inProperties
          ? withoutXml(value)
          : payloadKeys.has(key)
            ? value
            : withoutXml(
                value,
                key === "properties" || key === "patternProperties",
              ),
      ]),
  )
}

/**
 * Groups media types that share an identical schema, in spec order.
 */
export function groupMediaTypes(
  content: OpenApiContent = {},
): MediaTypeGroup[] {
  const groups = new Map<string, MediaTypeGroup>()
  for (const [mediaType, {schema}] of Object.entries(content)) {
    const key = JSON.stringify(withoutXml(schema ?? null))
    const group = groups.get(key)
    if (group) {
      group.mediaTypes.push(mediaType)
    } else {
      groups.set(key, {mediaTypes: [mediaType], schema})
    }
  }
  return [...groups.values()]
}

export interface MediaTypesState {
  group: MediaTypeGroup | undefined
  groups: MediaTypeGroup[]
  labels: string[]
  picked: PickedOption
}

/**
 * The media types of a body, grouped by schema, with the group being shown.
 */
export function useMediaTypes(content?: OpenApiContent): MediaTypesState {
  const groups = useMemo(() => groupMediaTypes(content), [content])
  const labels = useMemo(
    () => groups.map(({mediaTypes}) => mediaTypes.join(", ")),
    [groups],
  )
  const picked = usePickedOption(labels, {remember: true})
  return {group: groups[picked.index], groups, labels, picked}
}

function isDefaultMediaType(groups: MediaTypeGroup[]): boolean {
  return (
    groups.length === 1 &&
    groups[0].mediaTypes.length === 1 &&
    groups[0].mediaTypes[0] === "application/json"
  )
}

/**
 * The media types of a body: nothing for plain JSON, a label when they share
 * one schema, and a picker when their schemas differ.
 */
export function MediaTypePicker({
  state: {groups, labels, picked},
}: {
  state: MediaTypesState
}): ReactNode {
  if (!groups.length || isDefaultMediaType(groups)) {
    return null
  }
  if (groups.length === 1) {
    return <code className="qui-docs-openapi__media-types">{labels[0]}</code>
  }
  return (
    <OptionPicker aria-label="Media type" labels={labels} picked={picked} />
  )
}

/**
 * The schema of the media type group being shown.
 */
export function MediaSchema({
  group,
}: {
  group: MediaTypeGroup | undefined
}): ReactNode {
  if (!group) {
    return null
  }
  const schema = group.schema && mergeAllOf(group.schema)
  const variants = schema && getVariants(schema)

  return variants ? (
    <SchemaVariants schema={schema} variants={variants} />
  ) : schema?.properties ? (
    <SchemaProperties schema={schema} />
  ) : (
    <div className="qui-docs-openapi__fields">
      <SchemaProperty name="body" schema={schema} />
    </div>
  )
}
