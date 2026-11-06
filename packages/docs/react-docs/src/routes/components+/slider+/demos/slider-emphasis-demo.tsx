import type {ReactElement} from "react"

import {Slider} from "@qualcomm-ui/react/slider"

export function SliderEmphasisDemo(): ReactElement {
  return (
    // preview
    <Slider className="sm:w-80" defaultValue={[50]} emphasis="neutral" />
    // preview
  )
}
