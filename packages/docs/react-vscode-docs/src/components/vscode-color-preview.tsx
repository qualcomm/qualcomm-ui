import {type ReactElement, useEffect, useId, useRef, useState} from "react"

import {atom, useAtom, useAtomValue} from "jotai"

import {vscodePreviewThemes} from "../themes/preview-themes"

import "./vscode-color-preview.css"

const previewThemeAtom = atom("dark-modern")

export function VscodeColorThemeSelector(): ReactElement {
  const [theme, setTheme] = useAtom(previewThemeAtom)
  const themeId = useId()

  return (
    <div className="vscode-demo-toolbar">
      <label htmlFor={themeId}>VS Code theme</label>
      <select
        id={themeId}
        onChange={(event) => setTheme(event.target.value)}
        value={theme}
      >
        {vscodePreviewThemes.map(({id, label}) => (
          <option key={id} value={id}>
            {label}
          </option>
        ))}
      </select>
    </div>
  )
}

export function VscodeColorPreview({
  variable,
}: {
  variable: string
}): ReactElement {
  const theme = useAtomValue(previewThemeAtom)
  const containerRef = useRef<HTMLDivElement>(null)
  const [value, setValue] = useState<string | null>(null)

  useEffect(() => {
    const container = containerRef.current
    if (container) {
      setValue(getComputedStyle(container).getPropertyValue(variable).trim())
    }
  }, [theme, variable])

  return (
    <div
      ref={containerRef}
      className="qui-vscode vscode-preview vscode-color-preview"
      data-vscode-preview-theme={theme}
    >
      {value ? (
        <span
          aria-hidden="true"
          className="vscode-color-swatch"
          style={{backgroundColor: `var(${variable})`}}
        />
      ) : null}
      <code>
        {value === null ? "Loading" : value || "Not supplied by theme"}
      </code>
    </div>
  )
}
