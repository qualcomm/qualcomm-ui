import type {ReactElement} from "react"

import {Slider} from "@qualcomm-ui/react/slider"

export function SliderSideMarkersDemo(): ReactElement {
  return (
    // preview
    <Slider
      className="sm:w-80"
      defaultValue={[30]}
      max={70}
      min={20}
      sideMarkers
    />
    // preview
  )
}
