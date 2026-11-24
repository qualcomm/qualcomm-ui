import {type ReactNode, useEffect, useId, useState} from "react"

import {getDemo} from "virtual:qui-demo-scope/auto"

import type {ReactDemoData} from "@qualcomm-ui/mdx-common"
import {ReactDemo, type ReactDemoProps} from "@qualcomm-ui/react-mdx/code-demo"
import {Theme, useTheme} from "@qualcomm-ui/react-router-utils/client"

import {vscodePreviewThemes} from "../../themes/preview-themes"

interface Props extends Omit<ReactDemoProps, "demo" | "colorScheme"> {
  onFontSizeChange?: (fontSize: number) => void
  showFontSizeControl?: boolean
}

/**
 * Render host theme fixtures inside the shared docs demo and source viewer.
 * Each demo's theme is independent of the documentation site's QDS theme.
 */
export function VscodeDemo({
  onFontSizeChange,
  showFontSizeControl,
  wrapperProps,
  ...props
}: Props): ReactNode {
  const [siteTheme] = useTheme()
  const [previewTheme, setPreviewTheme] = useState("dark-modern")
  const [baseFontSize, setBaseFontSize] = useState("13")
  const [demo, setDemo] = useState<ReactDemoData>(getDemo(props.name))
  const themeId = useId()
  const fontSizeId = useId()
  const parsedFontSize = Number(baseFontSize)
  const previewFontSize =
    Number.isFinite(parsedFontSize) && parsedFontSize > 0 ? parsedFontSize : 13

  useEffect(() => {
    if (!import.meta.hot) {
      return
    }
    const handler = (data: ReactDemoData) => {
      if (data.demoName === props.name) {
        setDemo(data)
      }
    }
    import.meta.hot.on("qui-demo:update", handler)
    return () => import.meta.hot?.off("qui-demo:update", handler)
  }, [props.name])

  return (
    <ReactDemo
      colorScheme={siteTheme === Theme.LIGHT ? "light" : "dark"}
      demo={demo}
      wrapperProps={
        {
          ...wrapperProps,
          className: ["qui-vscode vscode-preview", wrapperProps?.className]
            .filter(Boolean)
            .join(" "),
          "data-vscode-preview-theme": previewTheme,
          style: {
            ...wrapperProps?.style,
            ...(showFontSizeControl && {
              "--vscode-font-size": `${previewFontSize}px`,
            }),
          },
        } as ReactDemoProps["wrapperProps"]
      }
      {...props}
    >
      <div className="vscode-demo-toolbar">
        <label htmlFor={themeId}>VS Code theme</label>
        <select
          id={themeId}
          onChange={(event) => setPreviewTheme(event.target.value)}
          value={previewTheme}
        >
          {vscodePreviewThemes.map(({id, label}) => (
            <option key={id} value={id}>
              {label}
            </option>
          ))}
        </select>
        {showFontSizeControl ? (
          <>
            <label htmlFor={fontSizeId}>Base font size (px)</label>
            <input
              id={fontSizeId}
              min={1}
              onChange={(event) => {
                const value = event.target.valueAsNumber
                setBaseFontSize(event.target.value)
                onFontSizeChange?.(
                  Number.isFinite(value) && value > 0 ? value : 13,
                )
              }}
              step="any"
              type="number"
              value={baseFontSize}
            />
          </>
        ) : null}
      </div>
    </ReactDemo>
  )
}
