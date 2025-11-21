// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {useEffect, useState} from "react"

import {useTheme} from "@qualcomm-ui/react-router-utils/client"

import type {ColorData} from "./theme-colors"

interface ColorTableProps {
  data: ColorData[]
}

export function ColorTable({data = []}: ColorTableProps) {
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
        {data.map(({tailwind, variable}) => {
          return (
            <div key={variable} className="doc-props-list-item__root">
              <div className="doc-props-list-item__name-wrapper"></div>
              <div className="doc-props-columns">
                <div className="doc-props__content">
                  <div className="doc-props__title">CSS Variable</div>
                  <code className="fit !bg-transparent font-mono">
                    {variable}
                  </code>
                </div>
                <div className="doc-props__content">
                  <div className="doc-props__title">Tailwind Class</div>
                  <code className="fit !bg-transparent font-mono">
                    {tailwind}
                  </code>
                </div>
                <div className="doc-props__content">
                  <div className="doc-props__title">Value</div>
                  <code
                    className="fit !bg-transparent font-mono"
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
      <div className="typedoc-props__table-wrapper hidden w-full sm:block">
        <table className="table-fixed">
          <thead>
            <tr>
              <th>CSS Variable</th>
              <th>Tailwind Class</th>
              <th className="box-border w-32">Color</th>
            </tr>
          </thead>
          <tbody>
            {data.map(({tailwind, variable}) => {
              return (
                <tr key={variable}>
                  <td>
                    <code className="fit !bg-transparent font-mono">
                      {variable}
                    </code>
                  </td>
                  <td>
                    <code className="fit !bg-transparent font-mono">
                      {tailwind}
                    </code>
                  </td>
                  <td
                    className="h-8"
                    style={{
                      backgroundColor: `var(${variable})`,
                    }}
                  />
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
