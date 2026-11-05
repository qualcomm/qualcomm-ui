// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import type {SerializedParameters} from "@qualcomm-ui/typedoc-common"

import {PropDescriptionSummary} from "../prop-description/index.js"
import {SimpleType} from "../prop-types/index.js"

export interface TypeDocFunctionParamsTableProps {
  parameters: SerializedParameters[]
}

function getDisplayName(parameter: SerializedParameters): string {
  if (parameter.name === "__namedParameters") {
    return parameter.prettyType ?? "options"
  }
  return parameter.name
}

function getDisplayType(parameter: SerializedParameters): string | null {
  if (parameter.referenceType) {
    return parameter.prettyType ?? parameter.referenceType
  }
  return parameter.type
}

export function TypeDocFunctionParamsTable({
  parameters,
}: TypeDocFunctionParamsTableProps): ReactElement {
  return (
    <div className="typedoc-props__table-wrapper qui-docs__mdx-scrollbar">
      <table>
        <thead>
          <tr>
            <th>Parameter</th>
            <th>Type</th>
            <th>Default</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {parameters.map((parameter) => {
            const displayName = getDisplayName(parameter)
            const isOptional = !parameter.required
            return (
              <tr key={parameter.name}>
                <td className="doc-props-table__name-cell">
                  <div className="doc-props-item__description">
                    <div className="doc-props-item__border">
                      <div className="doc-props-item__name">
                        <div className="doc-props-item__label">
                          {displayName}
                          {isOptional ? (
                            <span className="doc-function__optional-indicator">
                              ?
                            </span>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
                <td>
                  <SimpleType content={getDisplayType(parameter)} />
                </td>
                <td>
                  {parameter.defaultValue ? (
                    <SimpleType content={parameter.defaultValue} />
                  ) : (
                    <span className="doc-function__no-default">-</span>
                  )}
                </td>
                <td>
                  {parameter.summary?.length ? (
                    <div className="doc-props-description__root">
                      <PropDescriptionSummary summary={parameter.summary} />
                    </div>
                  ) : null}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
