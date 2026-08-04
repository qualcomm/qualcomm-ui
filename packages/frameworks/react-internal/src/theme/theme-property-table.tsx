// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type ReactElement, useEffect, useState} from "react"

import {Table} from "@qualcomm-ui/react/table"
import type {BasicThemeData} from "@qualcomm-ui/tailwind-plugin/theme"

import {TableWrapper} from "./table-wrapper"

interface ThemePropertyTableProps {
  cssProperty?: string
  data: BasicThemeData[]
}

export function ThemePropertyTable({
  cssProperty,
  data = [],
}: ThemePropertyTableProps): ReactElement {
  // we need to force a re-render after mount to reflect the computed property
  // values.
  const [key, setKey] = useState<number>(0)

  useEffect(() => {
    requestAnimationFrame(() => {
      setKey((prevState) => prevState + 1)
    })
  }, [])

  const getPropertyValue = (variable: string) => {
    if (typeof window === "undefined") {
      return
    }
    return getComputedStyle(document.documentElement).getPropertyValue(variable)
  }

  const showTailwindColumn = data.some(
    ({tailwindClasses}) => tailwindClasses.length,
  )

  return (
    <div key={key} className="w-full">
      <div className="doc-props-list__root bottom-border block sm:hidden">
        {data.map(({tailwindClasses, variable}) => {
          return (
            <div key={variable} className="doc-props-list-item__root">
              <div className="doc-props-list-item__name-wrapper"></div>
              <div className="doc-props-columns">
                {tailwindClasses.length ? (
                  <div className="doc-props__content">
                    <div className="doc-props__title">Tailwind Class</div>
                    <code className="fit bg-transparent! font-mono">
                      {tailwindClasses.join("\n")}
                    </code>
                  </div>
                ) : null}
                <div className="doc-props__content">
                  <div className="doc-props__title">CSS Variable</div>
                  <code className="fit bg-transparent! font-mono">
                    {variable}
                  </code>
                </div>
                <div className="doc-props__content">
                  <div className="doc-props__title">Equivalent CSS</div>
                  <code
                    className="flex flex-col gap-1 bg-transparent! font-mono"
                    suppressHydrationWarning
                  >
                    <div>
                      {cssProperty ? `${cssProperty}: ` : ""}
                      <span suppressHydrationWarning>
                        {getPropertyValue(variable)}
                      </span>
                    </div>
                  </code>
                </div>
              </div>
            </div>
          )
        })}
      </div>
      <TableWrapper>
        <Table.Header>
          <Table.Row>
            {showTailwindColumn ? (
              <Table.HeaderCell>Tailwind Class</Table.HeaderCell>
            ) : null}
            <Table.HeaderCell>CSS Variable</Table.HeaderCell>
            <Table.HeaderCell>{cssProperty ? "CSS" : "Value"}</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {data.map(({tailwindClasses, variable}) => {
            return (
              <Table.Row key={variable}>
                {showTailwindColumn ? (
                  <Table.Cell>{tailwindClasses.join("\n")}</Table.Cell>
                ) : null}
                <Table.Cell>{variable}</Table.Cell>
                <Table.Cell>
                  <div>
                    {cssProperty ? `${cssProperty}: ` : ""}
                    <span suppressHydrationWarning>
                      {getPropertyValue(variable)}
                    </span>
                  </div>
                </Table.Cell>
              </Table.Row>
            )
          })}
        </Table.Body>
      </TableWrapper>
    </div>
  )
}
