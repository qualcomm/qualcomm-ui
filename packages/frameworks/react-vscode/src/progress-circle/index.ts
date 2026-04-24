import {
  ProgressCircleCircle,
  type ProgressCircleCircleProps,
} from "./progress-circle-circle"
import {
  ProgressCircleLabel,
  type ProgressCircleLabelProps,
} from "./progress-circle-label"
import {
  ProgressCircleRoot,
  type ProgressCircleRootProps,
} from "./progress-circle-root"

export * from "./progress-circle-context"
export * from "./progress-circle.types"

export type {
  ProgressCircleLabelProps,
  ProgressCircleCircleProps,
  ProgressCircleRootProps,
}

export const ProgressCircle: {
  Circle: typeof ProgressCircleCircle
  Label: typeof ProgressCircleLabel
  Root: typeof ProgressCircleRoot
} = {
  Circle: ProgressCircleCircle,
  Label: ProgressCircleLabel,
  Root: ProgressCircleRoot,
}
