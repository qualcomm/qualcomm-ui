import type {ReactElement} from "react"

import {Slider} from "@qualcomm-ui/react/slider"

export function SliderSimpleDemo(): ReactElement {
  return (
    // preview
    <Slider
      className="sm:w-[340px]"
      defaultValue={[25]}
      hint="Some contextual help here"
      label="Choose a value"
    />
    // preview
  )
}
