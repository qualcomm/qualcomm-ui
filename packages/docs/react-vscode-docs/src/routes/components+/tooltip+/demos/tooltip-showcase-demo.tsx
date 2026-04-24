import type {ReactElement} from "react"

import {Button} from "@qualcomm-ui/react-vscode/button"
import {Tooltip, TooltipContent, TooltipTrigger} from "@qualcomm-ui/react-vscode/tooltip"

export function TooltipShowcaseDemo(): ReactElement {
  return (
    <Tooltip>
      <TooltipTrigger>
        <Button>Hover or Focus</Button>
      </TooltipTrigger>
      <TooltipContent>Tooltip Content</TooltipContent>
    </Tooltip>
  )
}
