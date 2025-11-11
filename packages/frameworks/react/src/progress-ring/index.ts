import {ProgressRing as SimpleProgressRing} from "./progress-ring"
import {ProgressRingBar, type ProgressRingBarProps} from "./progress-ring-bar"
import {
  ProgressRingCircle,
  type ProgressRingCircleProps,
} from "./progress-ring-circle"
import {
  ProgressRingCircleContainer,
  type ProgressRingCircleContainerProps,
} from "./progress-ring-circle-container"
import {
  ProgressRingContext,
  type ProgressRingContextProps,
} from "./progress-ring-context"
import {
  ProgressRingErrorText,
  type ProgressRingErrorTextProps,
} from "./progress-ring-error-text"
import {
  ProgressRingLabel,
  type ProgressRingLabelProps,
} from "./progress-ring-label"
import {
  ProgressRingRoot,
  type ProgressRingRootProps,
} from "./progress-ring-root"
import {
  ProgressRingTrack,
  type ProgressRingTrackProps,
} from "./progress-ring-track"
import {
  ProgressRingValueText,
  type ProgressRingValueTextProps,
} from "./progress-ring-value-text"

export * from "./qds-progress-ring-context"

export type {
  ProgressRingBarProps,
  ProgressRingCircleContainerProps,
  ProgressRingCircleProps,
  ProgressRingContextProps,
  ProgressRingErrorTextProps,
  ProgressRingLabelProps,
  ProgressRingRootProps,
  ProgressRingTrackProps,
  ProgressRingValueTextProps,
}

type ProgressRingComponent = typeof SimpleProgressRing & {
  Bar: typeof ProgressRingBar
  Circle: typeof ProgressRingCircle
  CircleContainer: typeof ProgressRingCircleContainer
  Context: typeof ProgressRingContext
  ErrorText: typeof ProgressRingErrorText
  Label: typeof ProgressRingLabel
  Root: typeof ProgressRingRoot
  Track: typeof ProgressRingTrack
  ValueText: typeof ProgressRingValueText
}

export const ProgressRing: ProgressRingComponent =
  SimpleProgressRing as ProgressRingComponent

ProgressRing.Bar = ProgressRingBar
ProgressRing.CircleContainer = ProgressRingCircleContainer
ProgressRing.Circle = ProgressRingCircle
ProgressRing.Context = ProgressRingContext
ProgressRing.ErrorText = ProgressRingErrorText
ProgressRing.Label = ProgressRingLabel
ProgressRing.Root = ProgressRingRoot
ProgressRing.Track = ProgressRingTrack
ProgressRing.ValueText = ProgressRingValueText
