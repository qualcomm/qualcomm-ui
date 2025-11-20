import type {ReactElement} from "react"

import {Button} from "@qualcomm-ui/react/button"
import {Popover} from "@qualcomm-ui/react/popover"

export function PopoverSimpleDemo(): ReactElement {
  return (
    // preview
    <Popover
      label="Label"
      trigger={<Button emphasis="primary">Show Popover</Button>}
    >
      Popover content
    </Popover>
    // preview
  )
}
