import type {ReactNode} from "react"

import {Icon} from "@qualcomm-ui/react-vscode/icon"

export function IconIconsDemo(): ReactNode {
  return (
    <div className="text-foreground flex items-end gap-2">
      <Icon icon="account" size={16} />
      <Icon icon="account" size={24} />
      <Icon icon="account" size={32} />
      <Icon icon="account" size={40} />
    </div>
  )
}
