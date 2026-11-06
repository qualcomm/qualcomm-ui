import type {ReactElement} from "react"

import type {QdsSliderEmphasis} from "@qualcomm-ui/qds-core/slider"
import {Slider} from "@qualcomm-ui/react/slider"
import {Tag} from "@qualcomm-ui/react/tag"

interface DemoProps {
  neutral: boolean
  variant?: QdsSliderEmphasis
}

export function Demo({neutral, variant}: DemoProps): ReactElement {
  return (
    <>
      <Slider emphasis={neutral ? "neutral" : "brand"} />
      <Slider emphasis={variant ?? "brand"} />
      <Slider emphasis={variant} />
      <Slider emphasis={neutral && "brand"} />
      <Tag
        emphasis={neutral ? "neutral-outline" : ("brand-outline" as const)}
      />
      <Tag emphasis={variant === "primary" ? "lime" : "blue"} />
    </>
  )
}
