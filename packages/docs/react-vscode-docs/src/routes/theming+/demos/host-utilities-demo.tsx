import {type ReactElement, useEffect, useRef} from "react"

import {bindVscodeOpacity} from "@qualcomm-ui/vscode-core/opacity"

export function HostUtilitiesDemo(): ReactElement {
  const containerRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const container = containerRef.current
    if (container) {
      return bindVscodeOpacity(container)
    }
  }, [])

  return (
    <div ref={containerRef} className="qui-vscode flex w-full flex-col gap-4">
      <div className="border-vscode-widget-border bg-vscode-editor-background shadow-vscode-widget flex flex-col gap-3 rounded border p-4">
        <p className="qui-vscode-heading-2">Host utility palette</p>
        <p className="text-vscode-text-link-foreground">
          Link foreground color
        </p>
        <button
          className="bg-vscode-button-background text-vscode-button-foreground hover:bg-vscode-button-hover-background outline-vscode-list-focus-outline w-fit rounded px-3 py-2 focus-visible:outline-2"
          type="button"
        >
          Focus or hover to compare colors
        </button>
        <svg aria-label="Indent guide color" height="16" role="img" width="64">
          <line
            className="stroke-vscode-tree-indent-guides-stroke"
            strokeWidth="2"
            x1="0"
            x2="64"
            y1="8"
            y2="8"
          />
        </svg>
      </div>
      <p className="opacity-vscode-editor-unnecessary-code">
        Unused code follows the host opacity and stays opaque in high contrast.
      </p>
      <p className="opacity-vscode-minimap-foreground">
        Minimap content follows the host foreground opacity.
      </p>
    </div>
  )
}
