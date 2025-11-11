import {
  CoreProgressBar,
  type CoreProgressBarProps,
  CoreProgressErrorText,
  type CoreProgressErrorTextProps,
  CoreProgressHint,
  type CoreProgressHintProps,
  CoreProgressLabel,
  type CoreProgressLabelProps,
  CoreProgressRoot,
  type CoreProgressRootProps,
  CoreProgressTrack,
  type CoreProgressTrackProps,
  CoreProgressValueText,
  type CoreProgressValueTextProps,
} from "./core-progress"

export * from "./progress-context"

export type {
  CoreProgressRootProps,
  CoreProgressBarProps,
  CoreProgressLabelProps,
  CoreProgressTrackProps,
  CoreProgressValueTextProps,
  CoreProgressErrorTextProps,
  CoreProgressHintProps,
}

type CoreProgressComponent = {
  Bar: typeof CoreProgressBar
  ErrorText: typeof CoreProgressErrorText
  Hint: typeof CoreProgressHint
  Label: typeof CoreProgressLabel
  Root: typeof CoreProgressRoot
  Track: typeof CoreProgressTrack
  ValueText: typeof CoreProgressValueText
}

export const CoreProgress: CoreProgressComponent = {
  Bar: CoreProgressBar,
  ErrorText: CoreProgressErrorText,
  Hint: CoreProgressHint,
  Label: CoreProgressLabel,
  Root: CoreProgressRoot,
  Track: CoreProgressTrack,
  ValueText: CoreProgressValueText,
}
