import {type ReactElement, useState} from "react"

import {selectCollection} from "@qualcomm-ui/core/select"
import type {Placement} from "@qualcomm-ui/dom/floating-ui"
import {Select} from "@qualcomm-ui/react/select"
import {Tooltip} from "@qualcomm-ui/react/tooltip"

const positions = selectCollection({
  items: [
    "top-start",
    "top",
    "top-end",
    "right-start",
    "right",
    "right-end",
    "bottom-start",
    "bottom",
    "bottom-end",
    "left-start",
    "left",
    "left-end",
  ],
})

export default function TooltipPlacementDemo(): ReactElement {
  const [placement, setPlacement] = useState<Placement>("top")

  return (
    <div className="w-48">
      <Tooltip
        positioning={{placement}}
        trigger={
          <Select
            collection={positions}
            onValueChange={(value) => setPlacement(value[0] as Placement)}
            positioning={{sameWidth: true}}
            value={[placement]}
          />
        }
      >
        {placement}
      </Tooltip>
    </div>
  )
}
