import type {ReactNode} from "react"

import {IconButton} from "@qualcomm-ui/react-vscode/icon-button"

export function IconButtonVariantsDemo(): ReactNode {
  return (
    <div className="flex flex-col gap-4">
      <IconButton icon="link-external" />
      <IconButton icon="link-external" variant="secondary" />
      <IconButton disabled icon="link-external" />
    </div>
  )
}
