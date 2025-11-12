import type {ReactElement} from "react"

import {Slider} from "@qualcomm-ui/react/slider"

export default function SliderMinStepsDemo(): ReactElement {
  return (
    // preview
    <Slider
      className="sm:w-80"
      defaultValue={[20, 50]}
      minStepsBetweenThumbs={10}
    />
    // preview
  )
}
