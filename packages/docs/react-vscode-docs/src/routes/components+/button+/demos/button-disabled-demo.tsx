import type {ReactElement} from "react"

import {Button} from "@qualcomm-ui/react-vscode/button"

export function ButtonDisabledDemo(): ReactElement {
  return (
    <div className="flex flex-col items-center gap-4">
      <Button disabled>Button</Button>
      <Button disabled variant="secondary">
        Secondary
      </Button>
      <Button disabled variant="outline">
        Outline
      </Button>
    </div>
  )
}
