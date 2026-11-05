// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Fragment, type ReactNode} from "react"

import type {QuiPropDeclaration} from "@qualcomm-ui/typedoc-common"

import {
  getHasExtraDetails,
  PropDescription,
  PropDescriptionExtraDetails,
} from "../prop-description/index.js"
import {PropName} from "../prop-name.js"
import {PropType} from "../prop-types/index.js"

import {getDisplayName} from "./function-params-utils.js"

function ParamListItem({
  nested,
  param,
}: {
  nested?: boolean
  param: QuiPropDeclaration
}): ReactNode {
  const displayParam = {...param, name: getDisplayName(param)}
  return (
    <div
      className={
        nested
          ? "doc-props-list-item__root doc-function__nested-list-item"
          : "doc-props-list-item__root"
      }
    >
      <div className="doc-props-list-item__name-wrapper">
        <PropName prop={displayParam} />
      </div>
      <div className="doc-props-columns">
        <div className="doc-props__content">
          <div className="doc-props__title">Type</div>
          <PropType disableReferenceExpansion={!nested} prop={displayParam} />
        </div>
        {displayParam.comment ? (
          <div className="doc-props__content">
            <div className="doc-props__title">Description</div>
            <PropDescription prop={displayParam}>
              {getHasExtraDetails(displayParam) ? (
                <PropDescriptionExtraDetails prop={displayParam} />
              ) : null}
            </PropDescription>
          </div>
        ) : null}
      </div>
    </div>
  )
}

export function FunctionParamsList({
  params,
}: {
  params: QuiPropDeclaration[]
}): ReactNode {
  return (
    <div className="doc-props-list__root">
      {params.map((param) => (
        <Fragment key={param.name}>
          <ParamListItem param={param} />
          {param.args?.map((arg) => (
            <ParamListItem key={arg.name} nested param={arg} />
          ))}
        </Fragment>
      ))}
    </div>
  )
}
