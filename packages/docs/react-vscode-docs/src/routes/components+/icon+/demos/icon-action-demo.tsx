import type {ReactNode} from "react"

import {Icon} from "@qualcomm-ui/react-vscode/icon"

export function IconActionDemo(): ReactNode {
  return (
    <div className="text-foreground">
      <Icon icon="account" render={<button />} size={24} />
    </div>
  )
}
