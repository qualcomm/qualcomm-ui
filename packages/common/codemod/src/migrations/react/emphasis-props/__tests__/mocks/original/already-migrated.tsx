import type {ReactElement} from "react"

import type {QdsSliderEmphasis} from "@qualcomm-ui/qds-core/slider"
import {Slider} from "@qualcomm-ui/react/slider"
import {Tag} from "@qualcomm-ui/react/tag"

export function Demo({emphasis}: {emphasis: QdsSliderEmphasis}): ReactElement {
  return (
    <>
      <Slider emphasis={emphasis} />
      <Tag emphasis="brand-outline" variant="selectable">
        brand
      </Tag>
    </>
  )
}
