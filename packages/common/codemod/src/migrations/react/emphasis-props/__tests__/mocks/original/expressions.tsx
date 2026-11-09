import type {ReactElement} from "react"

import type {QdsSliderVariant} from "@qualcomm-ui/qds-core/slider"
import {Slider} from "@qualcomm-ui/react/slider"
import {Tag} from "@qualcomm-ui/react/tag"

interface DemoProps {
  neutral: boolean
  variant?: QdsSliderVariant
}

export function Demo({neutral, variant}: DemoProps): ReactElement {
  return (
    <>
      <Slider variant={neutral ? "neutral" : "primary"} />
      <Slider variant={variant ?? "primary"} />
      <Slider variant={variant} />
      <Slider variant={neutral && "primary"} />
      <Tag
        emphasis={neutral ? "outline-neutral" : ("outline-brand" as const)}
      />
      <Tag emphasis={variant === "primary" ? "kiwi" : "blue"} />
    </>
  )
}
