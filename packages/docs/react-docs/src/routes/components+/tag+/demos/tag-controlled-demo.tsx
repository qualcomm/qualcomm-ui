import {type ReactElement, useState} from "react"

import {Check, Plus, Star} from "lucide-react"

import {Tag} from "@qualcomm-ui/react/tag"

export function TagControlledDemo(): ReactElement {
  const [selected, setSelected] = useState<boolean>(false)

  return (
    <div className="flex flex-col items-start gap-2">
      {/* preview */}
      <Tag
        endIcon={<Star />}
        onSelectedChange={setSelected}
        selected={selected}
        size="lg"
        startIcon={selected ? Check : Plus}
        variant="selectable"
      >
        {selected ? "Subscribed" : "Subscribe"}
      </Tag>
      {/* preview */}
    </div>
  )
}
