import {
  type ProgressCircleProps,
  ProgressCircle as SimpleProgressCircle,
} from "./progress-circle"
import {
  ProgressCircleBar,
  type ProgressCircleBarProps,
} from "./progress-circle-bar"
import {
  ProgressCircleCircle,
  type ProgressCircleCircleProps,
} from "./progress-circle-circle"
import {
  ProgressCircleCircleContainer,
  type ProgressCircleCircleContainerProps,
} from "./progress-circle-circle-container"
import {
  ProgressCircleContext,
  type ProgressCircleContextProps,
} from "./progress-circle-context"
import {
  ProgressCircleErrorText,
  type ProgressCircleErrorTextProps,
} from "./progress-circle-error-text"
import {
  ProgressCircleLabel,
  type ProgressCircleLabelProps,
} from "./progress-circle-label"
import {
  ProgressCircleRoot,
  type ProgressCircleRootProps,
} from "./progress-circle-root"
import {
  ProgressCircleTrack,
  type ProgressCircleTrackProps,
} from "./progress-circle-track"
import {
  ProgressCircleValueText,
  type ProgressCircleValueTextProps,
} from "./progress-circle-value-text"

export * from "./progress-circle.types"
export * from "./vs-progress-circle-context"

export type {
  ProgressCircleBarProps,
  ProgressCircleCircleContainerProps,
  ProgressCircleCircleProps,
  ProgressCircleContextProps,
  ProgressCircleErrorTextProps,
  ProgressCircleLabelProps,
  ProgressCircleProps,
  ProgressCircleRootProps,
  ProgressCircleTrackProps,
  ProgressCircleValueTextProps,
}

type ProgressCircleComponent = typeof SimpleProgressCircle & {
  Bar: typeof ProgressCircleBar
  Circle: typeof ProgressCircleCircle
  CircleContainer: typeof ProgressCircleCircleContainer
  Context: typeof ProgressCircleContext
  ErrorText: typeof ProgressCircleErrorText
  Label: typeof ProgressCircleLabel
  Root: typeof ProgressCircleRoot
  Track: typeof ProgressCircleTrack
  ValueText: typeof ProgressCircleValueText
}

export const ProgressCircle: ProgressCircleComponent =
  SimpleProgressCircle as ProgressCircleComponent

ProgressCircle.Bar = ProgressCircleBar
ProgressCircle.Circle = ProgressCircleCircle
ProgressCircle.CircleContainer = ProgressCircleCircleContainer
ProgressCircle.Context = ProgressCircleContext
ProgressCircle.ErrorText = ProgressCircleErrorText
ProgressCircle.Label = ProgressCircleLabel
ProgressCircle.Root = ProgressCircleRoot
ProgressCircle.Track = ProgressCircleTrack
ProgressCircle.ValueText = ProgressCircleValueText
