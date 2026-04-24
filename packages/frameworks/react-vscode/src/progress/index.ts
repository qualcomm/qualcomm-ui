import {ProgressBar, type ProgressBarProps} from "./progress-bar"
import {ProgressLabel, type ProgressLabelProps} from "./progress-label"
import {ProgressRoot, type ProgressRootProps} from "./progress-root"
import {ProgressTrack, type ProgressTrackProps} from "./progress-track"
import {ProgressValue, type ProgressValueProps} from "./progress-value"

export type {
  ProgressBarProps,
  ProgressLabelProps,
  ProgressRootProps,
  ProgressTrackProps,
  ProgressValueProps,
}

export const Progress: {
  Bar: typeof ProgressBar
  Label: typeof ProgressLabel
  Root: typeof ProgressRoot
  Track: typeof ProgressTrack
  Value: typeof ProgressValue
} = {
  Bar: ProgressBar,
  Label: ProgressLabel,
  Root: ProgressRoot,
  Track: ProgressTrack,
  Value: ProgressValue,
}
