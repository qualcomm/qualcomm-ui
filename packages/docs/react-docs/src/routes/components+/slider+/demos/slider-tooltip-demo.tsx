import type {ReactElement} from "react"

import {Slider} from "@qualcomm-ui/react/slider"

export default function SliderTooltipDemo(): ReactElement {
  return (
    // preview
    <Slider className="sm:w-80" defaultValue={[25]} tooltip />
    // preview
  )
}
