// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {useEffect, useState} from "react"

import type {BasicThemeData} from "./theme.types"

interface ThemePropertyTableProps {
  cssProperty: string
  data: BasicThemeData[]
}

export function ThemePropertyTable({
  cssProperty,
  data = [],
}: ThemePropertyTableProps) {
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

  const showTailwindColumn = data.some(({tailwind}) => tailwind)

  return (
    <div key={key} className="w-full">
      <div className="doc-props-list__root bottom-border block sm:hidden">
        {data.map(({tailwind, variable}) => {
          return (
            <div key={variable} className="doc-props-list-item__root">
              <div className="doc-props-list-item__name-wrapper"></div>
              <div className="doc-props-columns">
                {tailwind ? (
                  <div className="doc-props__content">
                    <div className="doc-props__title">Tailwind Class</div>
                    <code className="fit !bg-transparent font-mono">
                      {tailwind}
                    </code>
                  </div>
                ) : null}
                <div className="doc-props__content">
                  <div className="doc-props__title">CSS Variable</div>
                  <code className="fit !bg-transparent font-mono">
                    {variable}
                  </code>
                </div>
                <div className="doc-props__content">
                  <div className="doc-props__title">Equivalent CSS</div>
                  <code
                    className="flex flex-col gap-1 !bg-transparent font-mono"
                    suppressHydrationWarning
                  >
                    <div>
                      {cssProperty}:{" "}
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
      <div className="typedoc-props__table-wrapper hidden w-full sm:block">
        <table>
          <thead>
            <tr>
              {showTailwindColumn ? <th>Tailwind Class</th> : null}
              <th>CSS Variable</th>
              <th>Equivalent CSS</th>
            </tr>
          </thead>
          <tbody>
            {data.map(({tailwind, variable}) => {
              return (
                <tr key={variable}>
                  {showTailwindColumn ? (
                    <td>
                      <code className="fit !bg-transparent font-mono">
                        {tailwind}
                      </code>
                    </td>
                  ) : null}
                  <td>
                    <code className="fit !bg-transparent font-mono">
                      {variable}
                    </code>
                  </td>
                  <td>
                    <code
                      className="flex flex-col gap-1 !bg-transparent font-mono"
                      suppressHydrationWarning
                    >
                      <div>
                        {cssProperty}:{" "}
                        <span suppressHydrationWarning>
                          {getPropertyValue(variable)}
                        </span>
                      </div>
                    </code>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
