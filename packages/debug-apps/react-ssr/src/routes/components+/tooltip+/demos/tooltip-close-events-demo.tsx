import type {ReactElement} from "react"

import {Button} from "@qualcomm-ui/react/button"
import {Tooltip} from "@qualcomm-ui/react/tooltip"

export default function TooltipCloseEventsDemo(): ReactElement {
  return (
    // preview
    <Tooltip
      closeOnClick={false}
      closeOnEscape={false}
      trigger={<Button emphasis="primary">Hover me</Button>}
    >
      Hello world!
    </Tooltip>
    // preview
  )
}
