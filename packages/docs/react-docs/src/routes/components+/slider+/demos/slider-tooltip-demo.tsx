import type {ReactElement} from "react"

import {Slider} from "@qualcomm-ui/react/slider"

export function SliderTooltipDemo(): ReactElement {
  return (
    // preview
    <Slider className="sm:w-[340px]" defaultValue={[25]} tooltip />
    // preview
  )
}
