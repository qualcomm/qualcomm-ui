import type {ReactElement} from "react"

import {Button} from "@qualcomm-ui/react-vscode/button"
import {Tooltip} from "@qualcomm-ui/react-vscode/tooltip"

export function TooltipShowcaseDemo(): ReactElement {
  return (
    <Tooltip
      trigger={(bindings) => <Button {...bindings}>Hover or Focus</Button>}
    >
      Tooltip Content
    </Tooltip>
  )
}
