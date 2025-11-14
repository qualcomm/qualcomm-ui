import type {ReactElement} from "react"

import {Slider} from "@qualcomm-ui/react/slider"

export default function SliderSizeDemo(): ReactElement {
  return <Slider className="sm:w-[340px]" defaultValue={[50]} size="sm" />
}
