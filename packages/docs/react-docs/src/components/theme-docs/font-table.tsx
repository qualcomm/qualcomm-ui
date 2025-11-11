import {useEffect, useState} from "react"

import type {FontData} from "@qualcomm-ui/docs-base"
import {useTheme} from "@qualcomm-ui/react-router-utils/client"

interface ColorProps {
  data: FontData[]
}

export function FontTable({data = []}: ColorProps) {
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
      <div className="doc-props-list__root bottom-border block md:hidden">
        {data.map(({cssClass, variables}) => {
          return (
            <div key={cssClass} className="doc-props-list-item__root">
              <div className="doc-props-list-item__name-wrapper"></div>
              <div className="doc-props-columns">
                <div className="doc-props__content">
                  <div className="doc-props__title">CSS Class</div>
                  <code className="fit !bg-transparent font-mono text-sm">
                    {cssClass}
                  </code>
                </div>
                <div className="doc-props__content">
                  <div className="doc-props__title">CSS Variables</div>
                  <code className="fit flex flex-col gap-1 !bg-transparent font-mono text-sm">
                    <div>font: {variables.font}</div>
                    <div>font-stretch: {variables.fontStretch}</div>
                  </code>
                </div>
                <div className="doc-props__content">
                  <div className="doc-props__title">Equivalent CSS</div>
                  <code
                    className="flex flex-col gap-1 !bg-transparent font-mono text-sm"
                    suppressHydrationWarning
                  >
                    <div>
                      font-size:{" "}
                      <span suppressHydrationWarning>
                        {getPropertyValue(variables.fontSize)}
                      </span>
                    </div>
                    <div>
                      line-height:{" "}
                      <span suppressHydrationWarning>
                        {getPropertyValue(variables.lineHeight)}
                      </span>
                    </div>
                    <div>
                      font-weight:{" "}
                      <span suppressHydrationWarning>
                        {getPropertyValue(variables.fontWeight)}
                      </span>
                    </div>
                    <div>
                      font-stretch:{" "}
                      <span suppressHydrationWarning>
                        {getPropertyValue(variables.fontStretch)}
                      </span>
                    </div>
                    {variables.letterSpacing ? (
                      <div>
                        letter-spacing:{" "}
                        <span suppressHydrationWarning>
                          {getPropertyValue(variables.letterSpacing)}
                        </span>
                      </div>
                    ) : null}
                  </code>
                </div>
                <div className="doc-props__content">
                  <div className="doc-props__title">Example</div>
                  <div className={cssClass}>Aa</div>
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
              <th>CSS Class</th>
              <th>CSS Variables</th>
              <th>Equivalent CSS</th>
              <th>Example</th>
            </tr>
          </thead>
          <tbody>
            {data.map(({cssClass, variables}) => {
              return (
                <tr key={cssClass}>
                  <td>
                    <code className="fit !bg-transparent font-mono">
                      {cssClass}
                    </code>
                  </td>
                  <td>
                    <code className="fit flex flex-col gap-1 !bg-transparent font-mono">
                      <div>font: {variables.font}</div>
                      <div>font-stretch: {variables.fontStretch}</div>
                      {variables.letterSpacing ? (
                        <div>letter-spacing: {variables.letterSpacing}</div>
                      ) : null}
                    </code>
                  </td>
                  <td>
                    <code
                      className="flex flex-col gap-1 !bg-transparent font-mono"
                      suppressHydrationWarning
                    >
                      <div>
                        font-size:{" "}
                        <span suppressHydrationWarning>
                          {getPropertyValue(variables.fontSize)}
                        </span>
                      </div>
                      <div>
                        line-height:{" "}
                        <span suppressHydrationWarning>
                          {getPropertyValue(variables.lineHeight)}
                        </span>
                      </div>
                      <div>
                        font-weight:{" "}
                        <span suppressHydrationWarning>
                          {getPropertyValue(variables.fontWeight)}
                        </span>
                      </div>
                      <div>
                        font-stretch:{" "}
                        <span suppressHydrationWarning>
                          {getPropertyValue(variables.fontStretch)}
                        </span>
                      </div>
                      {variables.letterSpacing ? (
                        <div>
                          letter-spacing:{" "}
                          <span suppressHydrationWarning>
                            {getPropertyValue(variables.letterSpacing)}
                          </span>
                        </div>
                      ) : null}
                    </code>
                  </td>
                  <td className={cssClass}>Aa</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
