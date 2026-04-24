import type {ReactElement} from "react"

import {Button} from "@qualcomm-ui/react-vscode/button"

export function ButtonSizesDemo(): ReactElement {
  return (
    <div className="flex flex-col items-center gap-4">
      {/* preview */}
      <Button endIcon="plus">Button</Button>
      <Button endIcon="plus" size="sm">
        Button
      </Button>
      <Button endIcon="plus" size="xs">
        Button
      </Button>
      {/* preview */}
    </div>
  )
}
