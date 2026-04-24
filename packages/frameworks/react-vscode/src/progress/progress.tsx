import type {ReactElement, ReactNode} from "react"

import type {ProgressApi} from "@qualcomm-ui/core/progress"
import {useOptionalContentId} from "@qualcomm-ui/react-core/machine"
import {useControlledId} from "@qualcomm-ui/react-core/state"
import {
  type BindingRenderProp,
  renderProp,
} from "@qualcomm-ui/react-core/system"

import {ProgressBar, type ProgressBarProps} from "./progress-bar"
import {ProgressContext} from "./progress-context"
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

/**
 * A progress indicator with a simplified API.
 */
export interface ProgressProps extends ProgressRootProps {
  barProps?: ProgressBarProps
  errorText?: ReactNode
  errorTextProps?: ProgressErrorTextProps
  hint?: ReactNode
  hintProps?: ProgressHintProps
  label?: ReactNode
  labelProps?: ProgressLabelProps
  trackProps?: ProgressTrackProps
  valueText?: BindingRenderProp<ProgressApi, ReactNode> | string | number
  valueTextProps?: ProgressValueTextProps
}

export function Progress({
  barProps,
  errorText,
  errorTextProps,
  hint,
  hintProps,
  label,
  labelProps,
  trackProps,
  valueText,
  valueTextProps,
  ...props
}: ProgressProps): ReactElement {
  const labelContent = label || labelProps?.children
  const errorTextContent = errorText || errorTextProps?.children
  const hintContent = hint || hintProps?.children

  const ids = {
    errorText: useOptionalContentId(errorTextContent, errorTextProps),
    hint: useOptionalContentId(hintContent, hintProps),
    label: useOptionalContentId(labelContent, labelProps),
    progress: useControlledId(trackProps?.id),
    ...props.ids,
  }

  return (
    <ProgressRoot {...props} ids={ids}>
      {labelContent ? (
        <ProgressLabel {...labelProps} id={ids.label}>
          {labelContent}
        </ProgressLabel>
      ) : null}

      {valueText ? (
        <ProgressContext>
          {(api) => (
            <ProgressValueText {...valueTextProps}>
              {renderProp(valueText, api)}
            </ProgressValueText>
          )}
        </ProgressContext>
      ) : null}

      <ProgressTrack {...trackProps} id={ids.progress}>
        <ProgressBar {...barProps} />
      </ProgressTrack>

      {errorTextContent ? (
        <ProgressErrorText {...errorTextProps} id={ids.errorText}>
          {errorTextContent}
        </ProgressErrorText>
      ) : null}

      {hintContent ? (
        <ProgressHint {...hintProps} id={ids.hint}>
          {hintContent}
        </ProgressHint>
      ) : null}
    </ProgressRoot>
  )
}
