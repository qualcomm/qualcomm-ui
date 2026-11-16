// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactNode} from "react"

import type {Root} from "hast"

import {SchemaProperty} from "./schema-property.js"
import type {JsonSchema} from "./schema-type.js"

export interface OpenApiParameter {
  deprecated?: boolean
  description?: Root
  in: string
  name: string
  required?: boolean
  schema?: JsonSchema
}

const locations = [
  {in: "path", title: "Path parameters"},
  {in: "query", title: "Query parameters"},
  {in: "header", title: "Header parameters"},
  {in: "cookie", title: "Cookie parameters"},
]

export function Parameters({
  parameters,
}: {
  parameters: OpenApiParameter[]
}): ReactNode {
  return locations.map(({in: location, title}) => {
    const group = parameters.filter((parameter) => parameter.in === location)
    if (!group.length) {
      return null
    }
    return (
      <section key={location}>
        <div className="qui-docs-openapi__section-header">
          <h2 className="mdx">{title}</h2>
        </div>
        <div className="qui-docs-openapi__section-body">
          <div className="qui-docs-openapi__fields">
            {group.map(({in: _in, ...parameter}) => (
              <SchemaProperty key={parameter.name} {...parameter} />
            ))}
          </div>
        </div>
      </section>
    )
  })
}
