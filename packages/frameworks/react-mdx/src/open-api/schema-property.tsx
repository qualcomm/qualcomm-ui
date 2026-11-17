// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type ReactNode, useId, useMemo} from "react"

import type {Root} from "hast"

import {Description} from "./description.js"
import {FieldRow} from "./field-row.js"
import {type Expandable, getExpandable} from "./get-expandable.js"
import {getVariantLabels} from "./get-variants.js"
import {mergeAllOf} from "./merge-all-of.js"
import {OptionPicker, usePickedOption} from "./option-picker.js"
import {getSchemaTypeLabel, type JsonSchema} from "./schema-type.js"

export interface SchemaPropertyProps {
  deprecated?: boolean
  description?: Root
  name: string
  required?: boolean
  schema?: JsonSchema
}

/**
 * One property: its name and type on one line, then its description.
 * Rows with nested properties expand when their header is clicked.
 */
export function SchemaProperty({
  deprecated,
  description,
  name,
  required,
  schema: rawSchema,
}: SchemaPropertyProps): ReactNode {
  const schema = rawSchema && mergeAllOf(rawSchema)
  const defaultValue = schema?.default
  const text = description ?? schema?.description
  const expandable = getExpandable(schema)

  const header = (
    <>
      <span>
        <code className="qui-docs-openapi__field-name">{name}</code>
        {required ? (
          <span className="doc-props-item__required-indicator">*</span>
        ) : null}
        {deprecated || schema?.deprecated ? (
          <span className="doc-props-item__deprecated-indicator">*</span>
        ) : null}
      </span>
      <code className="qui-docs-code qui-docs-openapi__field-type">
        {getSchemaTypeLabel(schema)}
      </code>
      {expandable?.kind === "object" ? (
        <code className="qui-docs-openapi__field-preview">
          {getKeysPreview(expandable.schema)}
        </code>
      ) : null}
    </>
  )
  const details = (
    <>
      {text ? (
        <div className="qui-docs-openapi__description">
          <Description tree={text} />
        </div>
      ) : null}
      {defaultValue !== undefined ? (
        <div className="qui-docs-openapi__field-default">
          Default <code>{JSON.stringify(defaultValue)}</code>
        </div>
      ) : null}
    </>
  )

  return (
    <FieldRow details={details} header={header}>
      {expandable ? <ExpandedSchema expandable={expandable} /> : null}
    </FieldRow>
  )
}

function ExpandedSchema({expandable}: {expandable: Expandable}): ReactNode {
  return expandable.kind === "variants" ? (
    <SchemaVariants schema={expandable.schema} variants={expandable.variants} />
  ) : (
    <SchemaProperties schema={expandable.schema} />
  )
}

function getSortedEntries(schema: JsonSchema): [string, JsonSchema][] {
  const required = schema.required ?? []
  return Object.entries(schema.properties ?? {}).sort(
    ([a], [b]) => Number(required.includes(b)) - Number(required.includes(a)),
  )
}

function getKeysPreview(schema: JsonSchema): string {
  const keys = getSortedEntries(schema).map(([name]) => name)
  const shown = keys.slice(0, 3)
  if (keys.length > shown.length) {
    shown.push(`+${keys.length - shown.length}`)
  }
  return `{ ${shown.join(", ")} }`
}

/**
 * The properties of an object schema, required ones first.
 */
export function SchemaProperties({schema}: {schema: JsonSchema}): ReactNode {
  const required = schema.required ?? []
  const entries = getSortedEntries(schema)

  return (
    <div className="qui-docs-openapi__fields">
      {entries.map(([name, property]) => (
        <SchemaProperty
          key={name}
          name={name}
          required={required.includes(name)}
          schema={property}
        />
      ))}
    </div>
  )
}

/**
 * One table at a time for the alternatives of a `oneOf`/`anyOf`, picked with a
 * Select.
 */
export function SchemaVariants({
  schema,
  variants,
}: {
  schema: JsonSchema
  variants: JsonSchema[]
}): ReactNode {
  const labels = useMemo(() => getVariantLabels(variants), [variants])
  const picked = usePickedOption(labels)
  const variant = variants[picked.index]
  const expandable = getExpandable(variant)
  const propertyName = schema.discriminator?.propertyName
  const labelId = useId()

  return (
    <div className="qui-docs-openapi__variants">
      <div className="qui-docs-openapi__variants-header">
        <span className="qui-docs-openapi__variants-label" id={labelId}>
          {schema.oneOf ? "One of" : "Any of"}
        </span>
        <OptionPicker
          aria-labelledby={labelId}
          labels={labels}
          picked={picked}
        />
        {propertyName ? (
          <span className="qui-docs-openapi__variants-label">
            Picked by <code className="qui-docs-code">{propertyName}</code>
          </span>
        ) : null}
      </div>
      {variant && !variant.properties && variant.title ? (
        <code className="qui-docs-code qui-docs-openapi__field-type">
          {getSchemaTypeLabel({...variant, title: undefined})}
        </code>
      ) : null}
      {variant?.description ? (
        <div className="qui-docs-openapi__description">
          <Description tree={variant.description} />
        </div>
      ) : null}
      {expandable ? <ExpandedSchema expandable={expandable} /> : null}
    </div>
  )
}
