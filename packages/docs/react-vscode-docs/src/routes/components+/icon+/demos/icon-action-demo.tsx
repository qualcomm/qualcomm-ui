import type {ReactNode} from "react"

import {Icon} from "@qualcomm-ui/react-vscode/icon"

export function IconActionDemo(): ReactNode {
  return (
    <div className="text-foreground">
      <Icon as="button" icon="account" size={24} />
    </div>
  )
}
