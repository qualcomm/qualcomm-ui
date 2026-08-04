import {
  ProgressRingBar,
  type ProgressRingBarProps,
} from "./progress-ring-bar.js"
import {
  ProgressRingCircleContainer,
  type ProgressRingCircleContainerProps,
} from "./progress-ring-circle-container.js"
import {
  ProgressRingCircle,
  type ProgressRingCircleProps,
} from "./progress-ring-circle.js"
import {
  ProgressRingContext,
  type ProgressRingContextProps,
} from "./progress-ring-context.js"
import {
  ProgressRingErrorText,
  type ProgressRingErrorTextProps,
} from "./progress-ring-error-text.js"
import {
  ProgressRingLabel,
  type ProgressRingLabelProps,
} from "./progress-ring-label.js"
import {
  ProgressRingRoot,
  type ProgressRingRootProps,
} from "./progress-ring-root.js"
import {
  ProgressRingTrack,
  type ProgressRingTrackProps,
} from "./progress-ring-track.js"
import {
  ProgressRingValueText,
  type ProgressRingValueTextProps,
} from "./progress-ring-value-text.js"
import {ProgressRing as SimpleProgressRing} from "./progress-ring.js"

export * from "./qds-progress-ring-context.js"

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
