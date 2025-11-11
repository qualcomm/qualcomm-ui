import {type ReactElement, useState} from "react"

import {Slider} from "@qualcomm-ui/react/slider"

export default function SliderFocusCallbackDemo(): ReactElement {
  const [currentOutput, setCurrentOutput] = useState<string>("none")
  return (
    <div className="sm:w-[340px]">
      {/* preview */}
      <Slider
        defaultValue={[25, 75]}
        onFocusChange={(e) => {
          setCurrentOutput(
            e.focusedIndex === -1 ? "none" : `thumb ${e.focusedIndex}`,
          )
        }}
      />
      {/* preview */}
      <output className="mt-4 block">
        currently focused: <strong>{currentOutput}</strong>
      </output>
    </div>
  )
}
