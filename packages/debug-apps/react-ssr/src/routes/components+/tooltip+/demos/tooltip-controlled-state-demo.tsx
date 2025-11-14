import {type ReactElement, useState} from "react"

import {Button} from "@qualcomm-ui/react/button"
import {Tooltip} from "@qualcomm-ui/react/tooltip"

export default function TooltipControlledStateDemo(): ReactElement {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex w-40 flex-col items-center gap-4">
      <Tooltip
        onOpenChange={setOpen}
        open={open}
        trigger={<Button emphasis="primary">Hover me</Button>}
      >
        Hello world!
      </Tooltip>

      <output className="font-body-sm text-neutral-primary flex">
        The tooltip is {open ? "visible" : "hidden"}
      </output>
    </div>
  )
}
