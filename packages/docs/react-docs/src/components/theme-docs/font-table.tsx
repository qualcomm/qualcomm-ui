import {useEffect, useState} from "react"

import type {FontData} from "@qualcomm-ui/docs-base"
import {useTheme} from "@qualcomm-ui/react-router-utils/client"

interface FontTableProps {
  data: FontData[]
}

export function FontTable({data = []}: FontTableProps) {
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
      <div className="doc-props-list__root bottom-border block md:hidden">
        {data.map(({tailwind, variable}) => {
          return (
            <div key={variable} className="doc-props-list-item__root">
              <div className="doc-props-list-item__name-wrapper"></div>
              <div className="doc-props-columns">
                <div className="doc-props__content">
                  <div className="doc-props__title">Tailwind Class</div>
                  <code className="fit !bg-transparent font-mono text-sm">
                    {tailwind}
                  </code>
                </div>
                <div className="doc-props__content">
                  <div className="doc-props__title">CSS Variable</div>
                  <code className="fit !bg-transparent font-mono text-sm">
                    {variable}
                  </code>
                </div>
                <div className="doc-props__content">
                  <div className="doc-props__title">Computed Value</div>
                  <code
                    className="flex flex-col gap-1 !bg-transparent font-mono text-sm"
                    suppressHydrationWarning
                  >
                    <span suppressHydrationWarning>
                      {getPropertyValue(variable)}
                    </span>
                  </code>
                </div>
                <div className="doc-props__content">
                  <div className="doc-props__title">Example</div>
                  <div className={tailwind}>Aa</div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
      <div className="typedoc-props__table-wrapper hidden w-full md:block">
        <table>
          <thead>
            <tr>
              <th>Tailwind Class</th>
              <th>CSS Variable</th>
              <th>Computed Value</th>
              <th>Example</th>
            </tr>
          </thead>
          <tbody>
            {data.map(({tailwind, variable}) => {
              return (
                <tr key={variable}>
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
                      <span suppressHydrationWarning>
                        {getPropertyValue(variable)}
                      </span>
                    </code>
                  </td>
                  <td className={tailwind}>Aa</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
