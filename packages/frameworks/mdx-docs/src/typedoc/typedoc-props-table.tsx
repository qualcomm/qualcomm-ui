// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Fragment, type ReactNode} from "react"

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

export interface TypedocPropsTableProps {
  changelogPathname?: string | null
  props: Array<QuiPropDeclaration & {id: string}>
  suppressIds?: boolean | undefined
}

export function TypedocPropsTable({
  changelogPathname,
  props: tdProps,
  suppressIds,
}: TypedocPropsTableProps): ReactNode {
  const {columnNames, hideDefaultColumn} = useTypeDocContext()
  const detailsColSpan = hideDefaultColumn ? 2 : 3

  if (!tdProps.length) {
    return null
  }

  return (
    <div className="typedoc-props__table-wrapper" suppressHydrationWarning>
      <table>
        <thead>
          <tr>
            <th>{columnNames.name}</th>
            <th>{columnNames.type}</th>
            {hideDefaultColumn ? null : (
              <th>{columnNames.defaultValue || "Default"}</th>
            )}
          </tr>
        </thead>
        <tbody>
          {tdProps.map((prop) => {
            const id = prop.id
            const hasDetails = getHasExtraDetails(prop)
            return (
              <Fragment key={`${id}-${suppressIds}`}>
                <tr suppressHydrationWarning>
                  <td
                    className="doc-props-table__name-cell"
                    suppressHydrationWarning
                  >
                    <span
                      className="doc-props-table__row-anchor"
                      id={suppressIds ? undefined : id}
                      suppressHydrationWarning
                    ></span>
                    <div className="doc-props-item__description">
                      <div className="doc-props-item__border">
                        <PropName
                          changelogPathname={changelogPathname}
                          id={id}
                          prop={prop}
                        />
                      </div>

                      <PropDescription
                        className="doc-props-table__description"
                        prop={prop}
                      />
                    </div>
                  </td>
                  <td>
                    <PropType prop={prop} />
                  </td>
                  {hideDefaultColumn ? null : (
                    <td>
                      <PropDefault prop={prop} />
                    </td>
                  )}
                </tr>
                {hasDetails ? (
                  <tr className="doc-props-table__details-row">
                    <td colSpan={detailsColSpan}>
                      <PropDescriptionExtraDetails prop={prop} />
                    </td>
                  </tr>
                ) : null}
              </Fragment>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
