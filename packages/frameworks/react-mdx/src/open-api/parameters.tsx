// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactNode} from "react"

import {SchemaProperty} from "./schema-property.js"
import type {JsonSchema} from "./schema-type.js"

export interface OpenApiParameter {
  deprecated?: boolean
  description?: string
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
        <h2 className="mdx">{title}</h2>
        <div className="doc-props-list__root">
          {group.map(({in: _in, ...parameter}) => (
            <SchemaProperty key={parameter.name} {...parameter} />
          ))}
        </div>
      </section>
    )
  })
}
