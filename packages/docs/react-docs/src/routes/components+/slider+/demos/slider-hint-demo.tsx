import type {ReactElement} from "react"

import {Slider} from "@qualcomm-ui/react/slider"

export function SliderHintDemo(): ReactElement {
  return (
    // preview
    <Slider
      className="sm:w-[340px]"
      defaultValue={[50]}
      hint="Additional context"
    />
    // preview
  )
}
