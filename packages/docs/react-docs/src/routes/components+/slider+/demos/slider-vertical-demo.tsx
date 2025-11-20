import type {ReactElement} from "react"

import {Slider} from "@qualcomm-ui/react/slider"

export function SliderVerticalDemo(): ReactElement {
  return (
    // preview
    <Slider
      defaultValue={[50]}
      label="Vertical Slider"
      orientation="vertical"
      style={{height: "300px; width: 80px"}}
    />
    // preview
  )
}
