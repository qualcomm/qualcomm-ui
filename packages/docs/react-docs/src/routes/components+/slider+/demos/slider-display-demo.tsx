import type {ReactElement} from "react"

import {Slider} from "@qualcomm-ui/react/slider"

export default function SliderDisplayDemo(): ReactElement {
  return (
    // preview
    <Slider
      className="sm:w-[340px]"
      defaultValue={[20, 50]}
      display={(values) => `from ${values[0]} to ${values[1]}`}
    />
    // preview
  )
}
