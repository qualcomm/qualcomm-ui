import {type ReactElement, useState} from "react"

import {Minus, Plus} from "lucide-react"

import {IconButton} from "@qualcomm-ui/react/button"
import {ProgressRing} from "@qualcomm-ui/react/progress-ring"

export default function ProgressRingValueDemo(): ReactElement {
  const [value, setValue] = useState<number>(0)

  const increment = () => setValue((prevValue) => Math.min(100, prevValue + 10))
  const decrement = () => setValue((prevValue) => Math.max(0, prevValue - 10))

  return (
    <div className="flex flex-col gap-4">
      {/* preview */}
      <ProgressRing
        size="lg"
        value={value}
        valueText={(api) => `${api.valuePercent}%`}
      />
      {/* preview */}
      <div className="flex gap-2">
        <IconButton
          aria-label="Decrement by 10"
          icon={Minus}
          onClick={decrement}
          size="sm"
          variant="outline"
        />
        <IconButton
          aria-label="Increment by 10"
          icon={Plus}
          onClick={increment}
          size="sm"
          variant="outline"
        />
      </div>
    </div>
  )
}
