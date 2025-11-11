import {useEffect, useState} from "react"

import type {BasicThemeData} from "@qualcomm-ui/docs-base"
import {useTheme} from "@qualcomm-ui/react-router-utils/client"

interface ColorProps {
  cssProperty: string
  data: BasicThemeData[]
}

export function ThemePropertyTable({cssProperty, data = []}: ColorProps) {
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
    <div>
      <div className="doc-props-list__root bottom-border block sm:hidden">
        {data.map(({tailwind, variable}) => {
          return (
            <div key={variable} className="doc-props-list-item__root">
              <div className="doc-props-list-item__name-wrapper"></div>
              <div className="doc-props-columns">
                <div className="doc-props__content">
                  <div className="doc-props__title">Tailwind Class</div>
                  <code className="fit !bg-transparent font-mono">
                    {tailwind}
                  </code>
                </div>
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
              <th>Tailwind Class</th>
              <th>CSS Variable</th>
              <th>Equivalent CSS</th>
            </tr>
          </thead>
          <tbody>
            {data.map(({tailwind, variable}) => {
              return (
                <tr key={tailwind}>
                  <td>
                    <code className="fit !bg-transparent font-mono">
                      {tailwind}
                    </code>
                  </td>
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
