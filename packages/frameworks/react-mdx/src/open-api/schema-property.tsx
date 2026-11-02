// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type ReactNode, useMemo, useState} from "react"

import {selectCollection} from "@qualcomm-ui/core/select"
import {
  SpoilerContent,
  SpoilerRoot,
  SpoilerSummary,
} from "@qualcomm-ui/react-mdx/spoiler"
import {Select} from "@qualcomm-ui/react/select"

import {getExpandable} from "./get-expandable.js"
import {mergeAllOf} from "./merge-all-of.js"
import {getSchemaTypeLabel, type JsonSchema} from "./schema-type.js"

export interface SchemaPropertyProps {
  deprecated?: boolean
  description?: string
  name: string
  required?: boolean
  schema?: JsonSchema
}

/**
 * One property, in the same markup and classes as the TypeDoc props list.
 * Object properties expand into a nested list.
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

  return (
    <div className="doc-props-list-item__root">
      <div className="doc-props-list-item__name-wrapper">
        <div className="doc-props-item__name">
          <div className="doc-props-item__label">
            <code className="qui-docs-code">{name}</code>
            {required ? (
              <div className="doc-props-item__required-indicator">
                <sup>*</sup>
              </div>
            ) : null}
            {deprecated || schema?.deprecated ? (
              <div className="doc-props-item__deprecated-indicator">
                <sup>*</sup>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <div className="doc-props-columns">
        <div className="doc-props__content">
          <div className="doc-props__title">Type</div>
          <code className="qui-docs-code">{getSchemaTypeLabel(schema)}</code>
        </div>
        {defaultValue !== undefined ? (
          <div className="doc-props__content">
            <div className="doc-props__title">Default</div>
            <code className="qui-docs-code">
              {JSON.stringify(defaultValue)}
            </code>
          </div>
        ) : null}
        {text ? (
          <div className="doc-props__content">
            <div className="doc-props__title">Description</div>
            <div className="qui-docs-openapi__description">{text}</div>
          </div>
        ) : null}
        {expandable ? (
          <SpoilerRoot>
            <SpoilerSummary>Properties</SpoilerSummary>
            <SpoilerContent>
              {expandable.kind === "variants" ? (
                <SchemaVariants
                  schema={expandable.schema}
                  variants={expandable.variants}
                />
              ) : (
                <SchemaProperties schema={expandable.schema} />
              )}
            </SpoilerContent>
          </SpoilerRoot>
        ) : null}
      </div>
    </div>
  )
}

/**
 * The properties of an object schema, required ones first.
 */
export function SchemaProperties({schema}: {schema: JsonSchema}): ReactNode {
  const required = schema.required ?? []
  const entries = Object.entries(schema.properties ?? {}).sort(
    ([a], [b]) => Number(required.includes(b)) - Number(required.includes(a)),
  )

  return (
    <div className="doc-props-list__root">
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
  const collection = useMemo(
    () =>
      selectCollection({
        items: variants.map((variant, index) => ({
          label: variant.title ?? `Option ${index + 1}`,
          value: String(index),
        })),
      }),
    [variants],
  )
  const [value, setValue] = useState(["0"])
  // The same instance can be handed fewer alternatives, e.g. another response.
  const index = Number(value[0]) < variants.length ? Number(value[0]) : 0
  const variant = variants[index]
  const propertyName = schema.discriminator?.propertyName

  return (
    <div className="qui-docs-openapi__variants">
      <div className="qui-docs-openapi__variants-header">
        <Select
          clearable={false}
          collection={collection}
          controlProps={{"aria-label": schema.oneOf ? "One of" : "Any of"}}
          onValueChange={(next) => next.length && setValue(next)}
          size="sm"
          value={[String(index)]}
        />
        {propertyName ? (
          <span>
            Picked by <code className="qui-docs-code">{propertyName}</code>
          </span>
        ) : null}
      </div>
      {variant?.properties ? <SchemaProperties schema={variant} /> : null}
    </div>
  )
}
