import type {ReactElement} from "react"

import {Slider} from "@qualcomm-ui/react/slider"

export default function SliderVariantDemo(): ReactElement {
  return (
    // preview
    <Slider className="sm:w-[340px]" defaultValue={[50]} variant="neutral" />
    // preview
  )
}
