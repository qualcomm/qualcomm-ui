import {Progress as SimpleProgress} from "./progress"
import {ProgressBar, type ProgressBarProps} from "./progress-bar"
import {ProgressContext, type ProgressContextProps} from "./progress-context"
import {
  ProgressErrorText,
  type ProgressErrorTextProps,
} from "./progress-error-text"
import {ProgressHint, type ProgressHintProps} from "./progress-hint"
import {ProgressLabel, type ProgressLabelProps} from "./progress-label"
import {ProgressRoot, type ProgressRootProps} from "./progress-root"
import {ProgressTrack, type ProgressTrackProps} from "./progress-track"
import {
  ProgressValueText,
  type ProgressValueTextProps,
} from "./progress-value-text"

export type {
  ProgressBarProps,
  ProgressContextProps,
  ProgressErrorTextProps,
  ProgressHintProps,
  ProgressLabelProps,
  ProgressRootProps,
  ProgressTrackProps,
  ProgressValueTextProps,
}

type ProgressComponent = typeof SimpleProgress & {
  Bar: typeof ProgressBar
  Context: typeof ProgressContext
  ErrorText: typeof ProgressErrorText
  Hint: typeof ProgressHint
  Label: typeof ProgressLabel
  Root: typeof ProgressRoot
  Track: typeof ProgressTrack
  ValueText: typeof ProgressValueText
}

export const Progress: ProgressComponent = SimpleProgress as ProgressComponent

Progress.Bar = ProgressBar
Progress.Context = ProgressContext
Progress.ErrorText = ProgressErrorText
Progress.Hint = ProgressHint
Progress.Label = ProgressLabel
Progress.Root = ProgressRoot
Progress.Track = ProgressTrack
Progress.ValueText = ProgressValueText
