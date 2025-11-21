import type {ReactElement} from "react"

import {Slider} from "@qualcomm-ui/react/slider"

export function SliderMinMaxStepDemo(): ReactElement {
  return (
    // preview
    <Slider
      className="sm:w-80"
      defaultValue={[50]}
      max={70}
      min={20}
      step={5}
    />
    // preview
  )
}
