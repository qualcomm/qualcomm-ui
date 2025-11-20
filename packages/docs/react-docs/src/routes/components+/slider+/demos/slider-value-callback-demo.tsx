import {type ReactElement, useState} from "react"

import {Slider} from "@qualcomm-ui/react/slider"

export function SliderValueCallbackDemo(): ReactElement {
  const [value, setValue] = useState<number[]>([25, 75])
  const [finalValue, setFinalValue] = useState<number[]>(value)
  return (
    <div className="sm:w-80">
      {/* preview */}
      <Slider
        onValueChange={(e) => {
          setValue(e.value)
        }}
        onValueChangeEnd={(e) => {
          setFinalValue(e.value)
        }}
        value={value}
      />
      {/* preview */}
      <output className="mt-4 block">
        live value: <strong>{value.join(", ")}</strong>
      </output>
      <output className="mt-4 block">
        final value: <strong>{finalValue.join(", ")}</strong>
      </output>
    </div>
  )
}
