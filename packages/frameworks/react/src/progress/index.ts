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

export * from "./qds-progress-context"

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
  /**
   * Visual indicator that shows progress completion. Renders a `<div>` element by
   * default.
   */
  Bar: typeof ProgressBar
  /**
   * Provides access to the progress API via a render prop.
   */
  Context: typeof ProgressContext
  /**
   * Error text displayed when the progress is in an invalid state. Renders a styled
   * error text element.
   */
  ErrorText: typeof ProgressErrorText
  Hint: typeof ProgressHint
  /**
   * Label for the progress indicator. Renders a `<label>` element by default.
   */
  Label: typeof ProgressLabel
  /**
   * Root container for a progress indicator. Renders a `<div>` element by default.
   */
  Root: typeof ProgressRoot
  /**
   * Container for the progress bar. Renders a `<div>` element by default.
   */
  Track: typeof ProgressTrack
  /**
   * Text that displays the progress value. Renders a `<div>` element by default.
   */
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
