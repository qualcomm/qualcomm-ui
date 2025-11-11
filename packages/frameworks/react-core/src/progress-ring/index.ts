import {
  CoreProgressRingBar,
  type CoreProgressRingBarProps,
  CoreProgressRingCircle,
  type CoreProgressRingCircleProps,
  CoreProgressRingErrorText,
  type CoreProgressRingErrorTextProps,
  CoreProgressRingLabel,
  type CoreProgressRingLabelProps,
  CoreProgressRingRoot,
  type CoreProgressRingRootProps,
  CoreProgressRingTrack,
  type CoreProgressRingTrackProps,
  CoreProgressRingValueText,
  type CoreProgressRingValueTextProps,
} from "./core-progress-ring"

export * from "./progress-ring-context"

export type {
  CoreProgressRingRootProps,
  CoreProgressRingLabelProps,
  CoreProgressRingBarProps,
  CoreProgressRingTrackProps,
  CoreProgressRingCircleProps,
  CoreProgressRingValueTextProps,
  CoreProgressRingErrorTextProps,
}

type CoreProgressRingComponent = {
  Bar: typeof CoreProgressRingBar
  Circle: typeof CoreProgressRingCircle
  ErrorText: typeof CoreProgressRingErrorText
  Label: typeof CoreProgressRingLabel
  Root: typeof CoreProgressRingRoot
  Track: typeof CoreProgressRingTrack
  ValueText: typeof CoreProgressRingValueText
}

export const CoreProgressRing: CoreProgressRingComponent = {
  Bar: CoreProgressRingBar,
  Circle: CoreProgressRingCircle,
  ErrorText: CoreProgressRingErrorText,
  Label: CoreProgressRingLabel,
  Root: CoreProgressRingRoot,
  Track: CoreProgressRingTrack,
  ValueText: CoreProgressRingValueText,
}
