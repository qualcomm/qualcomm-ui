// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactNode} from "react"

import type {QuiPropDeclaration} from "@qualcomm-ui/mdx-docs-common"

import {PropDefault} from "./prop-default"
import {
  getHasExtraDetails,
  PropDescription,
  PropDescriptionExtraDetails,
} from "./prop-description"
import {PropName} from "./prop-name"
import {PropType} from "./prop-types"
import {useTypeDocContext} from "./use-typedoc-context"

export interface TypedocPropsListProps {
  changelogPathname?: string | null
  props: Array<QuiPropDeclaration & {id: string}>
  suppressIds?: boolean
}

export function TypedocPropsList({
  changelogPathname,
  props: tdProps,
  suppressIds,
}: TypedocPropsListProps): ReactNode {
  const {columnNames, hideDefaultColumn} = useTypeDocContext()

  if (!tdProps.length) {
    return null
  }

  return (
    <div className="doc-props-list__root" suppressHydrationWarning>
      {tdProps.map((prop) => {
        const id = prop.id
        const hasDefaultValue = typeof prop.defaultValue !== "undefined"

        return (
          <div
            key={`${id}-${suppressIds}`}
            className="doc-props-list-item__root"
            suppressHydrationWarning
          >
            <span
              className="doc-props-table__row-anchor"
              id={suppressIds ? undefined : id}
              suppressHydrationWarning
            ></span>
            <div
              className="doc-props-list-item__name-wrapper"
              suppressHydrationWarning
            >
              <PropName
                changelogPathname={changelogPathname}
                id={id}
                prop={prop}
              />
            </div>

            <div className="doc-props-columns">
              <div className="doc-props__content">
                <div className="doc-props__title">{columnNames.type}</div>
                <PropType prop={prop} />
              </div>

              {hasDefaultValue && hideDefaultColumn ? (
                <div className="doc-props__content">
                  <div className="doc-props__title">
                    {columnNames.defaultValue || "Default"}
                  </div>
                  <PropDefault prop={prop} />
                </div>
              ) : null}

              {prop.comment ? (
                <div className="doc-props__content">
                  <div className="doc-props__title">Description</div>
                  <PropDescription prop={prop}>
                    {getHasExtraDetails(prop) ? (
                      <PropDescriptionExtraDetails prop={prop} />
                    ) : null}
                  </PropDescription>
                </div>
              ) : null}
            </div>
          </div>
        )
      })}
    </div>
  )
}
