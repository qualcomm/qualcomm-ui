import type {ReactNode} from "react"

import {Status} from "@qualcomm-ui/react-vscode/status"

export function StatusShowcaseDemo(): ReactNode {
  return (
    <div className="flex justify-center gap-4">
      <Status variant="info" />
      <Status variant="warning" />
      <Status variant="error" />
    </div>
  )
}
