import type {ReactElement} from "react"

import {Slider} from "@qualcomm-ui/react/slider"

export function SliderMarkersDemo(): ReactElement {
  return (
    // preview
    <Slider
      className="sm:w-[340px]"
      defaultValue={[30]}
      marks={[20, 30, 40, 50, 60, 70]}
      max={70}
      min={20}
    />
    // preview
  )
}
