import type {ReactElement} from "react"

import {Slider} from "@qualcomm-ui/react/slider"

export function SliderRangeDemo(): ReactElement {
  return (
    // preview
    <Slider className="sm:w-[340px]" defaultValue={[20, 50]} />
    // preview
  )
}
