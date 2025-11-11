// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

import type {ProgressApi} from "@qualcomm-ui/core/progress"
import {useOptionalContentId} from "@qualcomm-ui/react-core/machine"
import {useControlledId} from "@qualcomm-ui/react-core/state"
import {type BindingRenderProp, renderProp} from "@qualcomm-ui/react-core/system"

import {ProgressRingBar, type ProgressRingBarProps} from "./progress-ring-bar"
import {
  ProgressRingCircle,
  type ProgressRingCircleProps,
} from "./progress-ring-circle"
import {
  ProgressRingCircleContainer,
  type ProgressRingCircleContainerProps,
} from "./progress-ring-circle-container"
import {ProgressRingContext} from "./progress-ring-context"
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

export interface ProgressRingProps extends ProgressRingRootProps {
  /**
   * Props passed to the progress bar.
   *
   * @inheritDoc
   */
  barProps?: ProgressRingBarProps

  /**
   * Props passed to the progress circle container.
   *
   * @inheritDoc
   */
  circleContainerProps?: ProgressRingCircleContainerProps

  /**
   * Props passed to the progress circle.
   *
   * @inheritDoc
   */
  circleProps?: ProgressRingCircleProps

  /**
   * Error text rendered below the progress ring when {@link invalid} is true.
   */
  errorText?: ReactNode

  /**
   * Props passed to the error text.
   *
   * @inheritDoc
   */
  errorTextProps?: ProgressRingErrorTextProps

  /**
   * Accessible label for the progress ring, rendered below the circle.
   */
  label?: ReactNode

  /**
   * Props passed to the progress label.
   *
   * @inheritDoc
   */
  labelProps?: ProgressRingLabelProps

  /**
   * Props passed to the progress track.
   *
   * @inheritDoc
   */
  trackProps?: ProgressRingTrackProps

  /**
   * Value text {@link
   * https://react-next.qui.qualcomm.com/render-props#binding-render-prop
   * Render Prop}
   *
   * @inheritDoc
   */
  valueText?: BindingRenderProp<ProgressApi, ReactNode>

  /**
   * Props passed to the value text.
   *
   * @inheritDoc
   */
  valueTextProps?: ProgressRingValueTextProps
}

/**
 * A circular progress indicator that displays progress as a ring with optional
 * value text and labels.
 */
export function ProgressRing({
  barProps,
  circleContainerProps,
  circleProps,
  errorText,
  errorTextProps,
  label,
  labelProps,
  trackProps,
  valueText,
  valueTextProps,
  ...props
}: ProgressRingProps): ReactElement {
  const labelContent = label || labelProps?.children
  const errorTextContent = errorText || errorTextProps?.children

  const ids = {
    errorText: useOptionalContentId(errorTextContent, errorTextProps),
    label: useOptionalContentId(labelContent, labelProps),
    progress: useControlledId(trackProps?.id),
    ...props.ids,
  }

  return (
    <ProgressRingRoot {...props} ids={ids}>
      <ProgressRingCircleContainer {...circleContainerProps}>
        {valueText ? (
          <ProgressRingContext>
            {(api) => (
              <ProgressRingValueText {...valueTextProps}>
                {renderProp(valueText, api)}
              </ProgressRingValueText>
            )}
          </ProgressRingContext>
        ) : null}
        <ProgressRingCircle {...circleProps}>
          <ProgressRingTrack {...trackProps} id={ids.progress} />
          <ProgressRingBar {...barProps} />
        </ProgressRingCircle>
      </ProgressRingCircleContainer>

      {labelContent ? (
        <ProgressRingLabel {...labelProps} id={ids.label}>
          {labelContent}
        </ProgressRingLabel>
      ) : null}

      {errorTextContent ? (
        <ProgressRingErrorText {...errorTextProps} id={ids.errorText}>
          {errorTextContent}
        </ProgressRingErrorText>
      ) : null}
    </ProgressRingRoot>
  )
}
