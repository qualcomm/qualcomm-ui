import type {ReactElement} from "react"

import {Slider} from "@qualcomm-ui/react/slider"

export default function SliderMarkersDemo(): ReactElement {
  return (
    // preview
    <Slider
      className="sm:w-80"
      defaultValue={[30]}
      marks={[20, 30, 40, 50, 60, 70]}
      max={70}
      min={20}
    />
    // preview
  )
}
