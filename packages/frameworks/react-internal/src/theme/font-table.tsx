// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type ReactElement, useEffect, useState} from "react"

import {Table} from "@qualcomm-ui/react/table"
import type {FontData} from "@qualcomm-ui/tailwind-plugin/theme"

import {TableWrapper} from "./table-wrapper"

interface FontTableProps {
  data: FontData[]
}

export function FontTable({data = []}: FontTableProps): ReactElement {
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

  return (
    <div key={key} className="w-full">
      <div className="doc-props-list__root bottom-border block md:hidden">
        {data.map(({tailwindClasses, variable}) => {
          return (
            <div key={variable} className="doc-props-list-item__root">
              <div className="doc-props-list-item__name-wrapper"></div>
              <div className="doc-props-columns">
                <div className="doc-props__content">
                  <div className="doc-props__title">Tailwind Class</div>
                  <code className="fit bg-transparent! font-mono text-sm">
                    {tailwindClasses.join("\n")}
                  </code>
                </div>
                <div className="doc-props__content">
                  <div className="doc-props__title">CSS Variable</div>
                  <code className="fit bg-transparent! font-mono text-sm">
                    {variable}
                  </code>
                </div>
                <div className="doc-props__content">
                  <div className="doc-props__title">Computed Value</div>
                  <code
                    className="flex flex-col gap-1 bg-transparent! font-mono text-sm"
                    suppressHydrationWarning
                  >
                    <span suppressHydrationWarning>
                      {getPropertyValue(variable)}
                    </span>
                  </code>
                </div>
                <div className="doc-props__content">
                  <div className="doc-props__title">Example</div>
                  <div style={{font: `var(${variable})`}}>Aa</div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
      <TableWrapper>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Tailwind Class</Table.HeaderCell>
            <Table.HeaderCell>CSS Variable</Table.HeaderCell>
            <Table.HeaderCell>Computed Value</Table.HeaderCell>
            <Table.HeaderCell>Example</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {data.map(({tailwindClasses, variable}) => {
            return (
              <Table.Row key={variable}>
                <Table.Cell>{tailwindClasses.join("\n")}</Table.Cell>
                <Table.Cell>{variable}</Table.Cell>
                <Table.Cell>
                  <span
                    className="flex flex-col gap-1"
                    suppressHydrationWarning
                  >
                    {getPropertyValue(variable)}
                  </span>
                </Table.Cell>
                <Table.Cell style={{font: `var(${variable})`}}>Aa</Table.Cell>
              </Table.Row>
            )
          })}
        </Table.Body>
      </TableWrapper>
    </div>
  )
}
