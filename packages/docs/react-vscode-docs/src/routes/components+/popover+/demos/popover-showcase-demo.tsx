import type {ReactNode} from "react"

import {Button} from "@qualcomm-ui/react-vscode/button"
import {Popover} from "@qualcomm-ui/react-vscode/popover"

export function PopoverShowcaseDemo(): ReactNode {
  return (
    // preview
    <Popover
      hideArrow
      trigger={(bindings) => <Button {...bindings}>Default</Button>}
    >
      <div className="flex place-items-center p-2">Panel content</div>
    </Popover>
    // preview
  )
}
