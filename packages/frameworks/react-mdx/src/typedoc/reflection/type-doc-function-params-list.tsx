// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactNode} from "react"

import type {SerializedParameters} from "@qualcomm-ui/typedoc-common"

import {PropDescriptionSummary} from "../prop-description"
import {SimpleType} from "../prop-types"

export interface TypeDocFunctionParamsListProps {
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

export function TypeDocFunctionParamsList({
  parameters,
}: TypeDocFunctionParamsListProps): ReactNode {
  return (
    <div className="doc-props-list__root">
      {parameters.map((parameter) => {
        const displayName = getDisplayName(parameter)
        const isOptional = !parameter.required
        return (
          <div key={parameter.name} className="doc-props-list-item__root">
            <div className="doc-props-list-item__name-wrapper">
              <div className="doc-props-item__name">
                <div className="doc-props-item__label">
                  {displayName}
                  {isOptional ? (
                    <span className="doc-function__optional-indicator">?</span>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="doc-props-columns">
              <div className="doc-props__content">
                <div className="doc-props__title">Type</div>
                <SimpleType content={getDisplayType(parameter)} />
              </div>

              {parameter.defaultValue ? (
                <div className="doc-props__content">
                  <div className="doc-props__title">Default</div>
                  <SimpleType content={parameter.defaultValue} />
                </div>
              ) : null}

              {parameter.summary?.length ? (
                <div className="doc-props__content">
                  <div className="doc-props__title">Description</div>
                  <div className="doc-props-description__root">
                    <PropDescriptionSummary summary={parameter.summary} />
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        )
      })}
    </div>
  )
}
