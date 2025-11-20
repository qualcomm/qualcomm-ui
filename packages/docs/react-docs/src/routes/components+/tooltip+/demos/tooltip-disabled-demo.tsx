import {type ReactElement, useState} from "react"

import {Button} from "@qualcomm-ui/react/button"
import {Tooltip} from "@qualcomm-ui/react/tooltip"

export function TooltipDisabledDemo(): ReactElement {
  const [disabled, setDisabled] = useState(true)
  return (
    <div className="flex flex-col items-center gap-4">
      <Tooltip
        disabled={disabled}
        trigger={<Button emphasis="primary">Hover me</Button>}
      >
        Hello world!
      </Tooltip>

      <Button onClick={() => setDisabled(!disabled)} variant="outline">
        {disabled ? "Enable" : "Disable"} tooltip
      </Button>
    </div>
  )
}
