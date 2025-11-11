// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import type {SerializedParameters} from "@qualcomm-ui/mdx-docs-common"

import {PropDescriptionSummary} from "../prop-description"
import {SimpleType} from "../prop-types"

export interface TypeDocParametersTableProps {
  parameters: SerializedParameters[]
}

export function TypeDocParametersTable({
  parameters,
}: TypeDocParametersTableProps): ReactElement {
  return (
    <div className="typedoc-props__table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Parameter Name</th>
            <th>Parameter Type</th>
            <th>Default</th>
          </tr>
        </thead>
        <tbody>
          {parameters.map((parameter) => {
            const id = parameter.name

            return (
              <tr key={id}>
                <td className="doc-props-table__name-cell">
                  {/* We hack the scroll offset to account for the sticky header */}
                  <span
                    className="doc-props-table__row-anchor"
                    id={id}
                    suppressHydrationWarning
                  ></span>
                  <div className="doc-props-item__description">
                    <div className="doc-props-item__border">
                      <div className="doc-props-item__name">
                        <div className="doc-props-item__label">
                          {parameter.name}
                        </div>
                      </div>
                    </div>
                    <div className="doc-props-description__root doc-props-table">
                      <PropDescriptionSummary
                        summary={parameter.summary ?? []}
                      />
                    </div>
                  </div>
                </td>
                <td>
                  <SimpleType content={parameter.type} />
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
