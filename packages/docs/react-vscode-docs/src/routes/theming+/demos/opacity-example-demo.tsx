import type {ReactElement} from "react"

import {bindVscodeOpacity} from "@qualcomm-ui/vscode-core/opacity"

const unusedCode = 'import unusedLogger from "./logger"'
const activeCode = 'console.log("Ready")'

function opacityRef(element: HTMLDivElement | null) {
  if (element) {
    return bindVscodeOpacity(element)
  }
}

export function OpacityExampleDemo(): ReactElement {
  return (
    <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2">
      <div className="qui-vscode flex flex-col gap-3">
        <h3 className="font-label-lg text-normal">Without binding</h3>
        <pre className="text-normal font-mono">
          <code className="opacity-editor-unnecessary-code">{unusedCode}</code>
          {"\n"}
          <code>{activeCode}</code>
        </pre>
      </div>
      <div ref={opacityRef} className="qui-vscode flex flex-col gap-3">
        <h3 className="font-label-lg text-normal">With binding</h3>
        <pre className="text-normal font-mono">
          <code className="opacity-editor-unnecessary-code">{unusedCode}</code>
          {"\n"}
          <code>{activeCode}</code>
        </pre>
      </div>
    </div>
  )
}
