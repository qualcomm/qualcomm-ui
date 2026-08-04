// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type ReactElement, useEffect, useState} from "react"

import {useTheme} from "@qualcomm-ui/react-router-utils/client"
import {Table} from "@qualcomm-ui/react/table"
import type {ColorData} from "@qualcomm-ui/tailwind-plugin/theme"

import {TableWrapper} from "./table-wrapper"

interface ColorTableProps {
  data: ColorData[]
}

export function ColorTable({data = []}: ColorTableProps): ReactElement {
  // we need to force a re-render after mount and on theme change to reflect the
  // computed property values.
  const [theme] = useTheme()

  const [key, setKey] = useState<number>(0)

  useEffect(() => {
    requestAnimationFrame(() => {
      setKey((prevState) => prevState + 1)
    })
  }, [theme])

  const getPropertyValue = (variable: string) => {
    if (typeof window === "undefined") {
      return
    }
    return getComputedStyle(document.documentElement).getPropertyValue(variable)
  }

  return (
    <div key={key} className="w-full">
      <div className="doc-props-list__root bottom-border block sm:hidden">
        {data.map(({tailwindClasses, variable}) => {
          return (
            <div key={variable} className="doc-props-list-item__root">
              <div className="doc-props-list-item__name-wrapper"></div>
              <div className="doc-props-columns">
                <div className="doc-props__content">
                  <div className="doc-props__title">CSS Variable</div>
                  <code className="fit bg-transparent! font-mono">
                    {variable}
                  </code>
                </div>
                <div className="doc-props__content">
                  <div className="doc-props__title">Tailwind Class</div>
                  <code className="fit bg-transparent! font-mono whitespace-pre-line">
                    {tailwindClasses.join("\n")}
                  </code>
                </div>
                <div className="doc-props__content">
                  <div className="doc-props__title">Value</div>
                  <code
                    className="fit bg-transparent! font-mono"
                    suppressHydrationWarning
                  >
                    {getPropertyValue(variable)}
                  </code>
                </div>
                <div className="doc-props__content">
                  <div className="doc-props__title">Color</div>
                  <div
                    className="h-8 w-full"
                    style={{backgroundColor: `var(${variable})`}}
                  ></div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
      <TableWrapper>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>CSS Variable</Table.HeaderCell>
            <Table.HeaderCell>Tailwind Class</Table.HeaderCell>
            <Table.HeaderCell className="box-border w-32">
              Color
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {data.map(({tailwindClasses, variable}) => {
            return (
              <Table.Row key={variable}>
                <Table.Cell>{variable}</Table.Cell>
                <Table.Cell className="whitespace-pre-line">
                  {tailwindClasses.join("\n")}
                </Table.Cell>
                <Table.Cell
                  className="h-8"
                  style={{
                    backgroundColor: `var(${variable})`,
                  }}
                />
              </Table.Row>
            )
          })}
        </Table.Body>
      </TableWrapper>
    </div>
  )
}
