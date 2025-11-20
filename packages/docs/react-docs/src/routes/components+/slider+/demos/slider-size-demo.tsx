import type {ReactElement} from "react"

import {Slider} from "@qualcomm-ui/react/slider"

export function SliderSizeDemo(): ReactElement {
  return <Slider className="sm:w-80" defaultValue={[50]} size="sm" />
}
