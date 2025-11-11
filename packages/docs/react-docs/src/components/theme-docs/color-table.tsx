import {useEffect, useState} from "react"

import type {ColorData} from "@qualcomm-ui/docs-base"
import {useTheme} from "@qualcomm-ui/react-router-utils/client"

interface ColorProps {
  data: ColorData[]
}

export function ColorTable({data = []}: ColorProps) {
  // we need to force a re-render when the theme changes to update the property
  // value.
  const [theme] = useTheme()

  const [, rerender] = useState([])

  useEffect(() => {
    setTimeout(() => {
      rerender([])
    })
  }, [rerender, theme])

  const getPropertyValue = (variable: string) => {
    if (typeof window === "undefined") {
      return
    }
    return getComputedStyle(document.documentElement).getPropertyValue(variable)
  }

  return (
    <div className="w-full">
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
              <th>Value</th>
              <th style={{width: 100}}>Color</th>
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
                  <td>
                    <code
                      className="fit !bg-transparent font-mono"
                      suppressHydrationWarning
                    >
                      {getPropertyValue(variable)}
                    </code>
                  </td>
                  <td
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
