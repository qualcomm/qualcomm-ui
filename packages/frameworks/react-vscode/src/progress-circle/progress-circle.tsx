import type {ReactElement, ReactNode} from "react"

import type {ProgressApi} from "@qualcomm-ui/core/progress"
import {useOptionalContentId} from "@qualcomm-ui/react-core/machine"
import {useControlledId} from "@qualcomm-ui/react-core/state"
import {
  type BindingRenderProp,
  renderProp,
} from "@qualcomm-ui/react-core/system"

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
import {ProgressCircleContext} from "./progress-circle-context"
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

/**
 * A circular progress indicator with a simplified API.
 */
export interface ProgressCircleProps extends ProgressCircleRootProps {
  /**
   * Props passed to the progress bar.
   *
   * @inheritDoc
   */
  barProps?: ProgressCircleBarProps

  /**
   * Props passed to the progress circle container.
   *
   * @inheritDoc
   */
  circleContainerProps?: ProgressCircleCircleContainerProps

  /**
   * Props passed to the progress circle.
   *
   * @inheritDoc
   */
  circleProps?: ProgressCircleCircleProps

  /**
   * Error text rendered below the progress circle when `invalid` is true.
   */
  errorText?: ReactNode

  /**
   * Props passed to the error text.
   *
   * @inheritDoc
   */
  errorTextProps?: ProgressCircleErrorTextProps

  /**
   * Accessible label for the progress circle, rendered below the circle.
   */
  label?: ReactNode

  /**
   * Props passed to the progress label.
   *
   * @inheritDoc
   */
  labelProps?: ProgressCircleLabelProps

  /**
   * Props passed to the progress track.
   *
   * @inheritDoc
   */
  trackProps?: ProgressCircleTrackProps

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
  valueTextProps?: ProgressCircleValueTextProps
}

export function ProgressCircle({
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
}: ProgressCircleProps): ReactElement {
  const labelContent = label || labelProps?.children
  const errorTextContent = errorText || errorTextProps?.children

  const ids = {
    errorText: useOptionalContentId(errorTextContent, errorTextProps),
    label: useOptionalContentId(labelContent, labelProps),
    progress: useControlledId(trackProps?.id),
    ...props.ids,
  }

  return (
    <ProgressCircleRoot {...props} ids={ids}>
      <ProgressCircleCircleContainer {...circleContainerProps}>
        {valueText ? (
          <ProgressCircleContext>
            {(api) => (
              <ProgressCircleValueText {...valueTextProps}>
                {renderProp(valueText, api)}
              </ProgressCircleValueText>
            )}
          </ProgressCircleContext>
        ) : null}
        <ProgressCircleCircle {...circleProps}>
          <ProgressCircleTrack {...trackProps} id={ids.progress} />
          <ProgressCircleBar {...barProps} />
        </ProgressCircleCircle>
      </ProgressCircleCircleContainer>

      {labelContent ? (
        <ProgressCircleLabel {...labelProps} id={ids.label}>
          {labelContent}
        </ProgressCircleLabel>
      ) : null}

      {errorTextContent ? (
        <ProgressCircleErrorText {...errorTextProps} id={ids.errorText}>
          {errorTextContent}
        </ProgressCircleErrorText>
      ) : null}
    </ProgressCircleRoot>
  )
}
