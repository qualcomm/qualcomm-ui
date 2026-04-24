import type {ReactNode} from "react"

import {Button} from "@qualcomm-ui/react-vscode/button"

export function ButtonIconsDemo(): ReactNode {
  return (
    <div className="grid justify-center gap-4">
      {/* preview */}
      <Button endIcon="chevron-right">Button</Button>
      {/* preview */}
    </div>
  )
}
