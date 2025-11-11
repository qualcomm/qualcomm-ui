import type {
  FontData,
  FontVariables,
  TailwindFontClasses,
} from "@qualcomm-ui/docs-base"
import {useTheme} from "@qualcomm-ui/react-router-utils/client"

interface ColorProps {
  data: FontData[]
  tailwindProperty: keyof TailwindFontClasses
  variables: Record<keyof FontVariables, boolean>
}

export function TailwindFontTable({
  data = [],
  tailwindProperty,
  variables: variablesProp,
}: ColorProps) {
  // we need to force a re-render when the theme changes to update the property
  // value.
  useTheme()

  const getPropertyValue = (variable: string) => {
    if (typeof window === "undefined") {
      return
    }
    return getComputedStyle(document.documentElement).getPropertyValue(variable)
  }

  return (
    <div className="w-full">
      <div className="doc-props-list__root bottom-border block md:hidden">
        {data.map(({cssClass, tailwindClasses, variables}) => {
          const fontClass = tailwindClasses[tailwindProperty]
          return (
            <div key={cssClass} className="doc-props-list-item__root">
              <div className="doc-props-list-item__name-wrapper"></div>
              <div className="doc-props-columns">
                <div className="doc-props__content">
                  <div className="doc-props__title">Tailwind Class</div>
                  <code className="fit !bg-transparent font-mono">
                    {fontClass}
                  </code>
                </div>
                <div className="doc-props__content">
                  <div className="doc-props__title">CSS Variables</div>
                  <code className="fit flex flex-col gap-1 !bg-transparent font-mono">
                    {variablesProp.fontSize ? (
                      <div>font-size: {variables.fontSize}</div>
                    ) : null}
                    {variablesProp.lineHeight ? (
                      <div>line-height: {variables.lineHeight}</div>
                    ) : null}
                    {variablesProp.fontWeight ? (
                      <div>font-weight: {variables.fontWeight}</div>
                    ) : null}
                    {variablesProp.fontStretch ? (
                      <div>font-stretch: {variables.fontStretch}</div>
                    ) : null}
                  </code>
                </div>
                <div className="doc-props__content">
                  <div className="doc-props__title">Equivalent CSS</div>
                  <code
                    className="flex flex-col gap-1 !bg-transparent font-mono"
                    suppressHydrationWarning
                  >
                    {variablesProp.fontSize ? (
                      <div>
                        font-size:{" "}
                        <span suppressHydrationWarning>
                          {getPropertyValue(variables.fontSize)}
                        </span>
                      </div>
                    ) : null}
                    {variablesProp.lineHeight ? (
                      <div>
                        line-height:{" "}
                        <span suppressHydrationWarning>
                          {getPropertyValue(variables.lineHeight)}
                        </span>
                      </div>
                    ) : null}
                    {variablesProp.fontWeight ? (
                      <div>
                        font-weight:{" "}
                        <span suppressHydrationWarning>
                          {getPropertyValue(variables.fontWeight)}
                        </span>
                      </div>
                    ) : null}
                    {variablesProp.fontStretch ? (
                      <div>
                        font-stretch:{" "}
                        <span suppressHydrationWarning>
                          {getPropertyValue(variables.fontStretch)}
                        </span>
                      </div>
                    ) : null}
                  </code>
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
              <th>CSS Variables</th>
              <th>Equivalent CSS</th>
            </tr>
          </thead>
          <tbody>
            {data.map(({cssClass, tailwindClasses, variables}) => {
              const fontClass = tailwindClasses[tailwindProperty]
              return (
                <tr key={cssClass}>
                  <td>
                    <code className="fit !bg-transparent font-mono">
                      {fontClass}
                    </code>
                  </td>
                  <td>
                    <code className="fit flex flex-col gap-1 !bg-transparent font-mono">
                      {variablesProp.fontSize ? (
                        <div>font-size: {variables.fontSize}</div>
                      ) : null}
                      {variablesProp.lineHeight ? (
                        <div>line-height: {variables.lineHeight}</div>
                      ) : null}
                      {variablesProp.fontWeight ? (
                        <div>font-weight: {variables.fontWeight}</div>
                      ) : null}
                      {variablesProp.fontStretch ? (
                        <div>font-stretch: {variables.fontStretch}</div>
                      ) : null}
                    </code>
                  </td>
                  <td>
                    <code
                      className="flex flex-col gap-1 !bg-transparent font-mono"
                      suppressHydrationWarning
                    >
                      {variablesProp.fontSize ? (
                        <div>
                          font-size:{" "}
                          <span suppressHydrationWarning>
                            {getPropertyValue(variables.fontSize)}
                          </span>
                        </div>
                      ) : null}
                      {variablesProp.lineHeight ? (
                        <div>
                          line-height:{" "}
                          <span suppressHydrationWarning>
                            {getPropertyValue(variables.lineHeight)}
                          </span>
                        </div>
                      ) : null}
                      {variablesProp.fontWeight ? (
                        <div>
                          font-weight:{" "}
                          <span suppressHydrationWarning>
                            {getPropertyValue(variables.fontWeight)}
                          </span>
                        </div>
                      ) : null}
                      {variablesProp.fontStretch ? (
                        <div>
                          font-stretch:{" "}
                          <span suppressHydrationWarning>
                            {getPropertyValue(variables.fontStretch)}
                          </span>
                        </div>
                      ) : null}
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
