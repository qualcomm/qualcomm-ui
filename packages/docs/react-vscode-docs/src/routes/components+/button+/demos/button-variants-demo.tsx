import type {ReactNode} from "react"

import {Button} from "@qualcomm-ui/react-vscode/button"

export function ButtonVariantsDemo(): ReactNode {
  return (
    <div className="flex flex-col items-center gap-4">
      {/* preview */}
      <Button>Button</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      {/* preview */}
    </div>
  )
}
