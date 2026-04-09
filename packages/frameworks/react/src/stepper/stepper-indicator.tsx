// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {Check, createLucideIcon, type IconNode} from "lucide-react"

import {StepperIndicatorAlert} from "@qualcomm-ui/qds-core/stepper"
import {IconOrNode} from "@qualcomm-ui/react/icon"
import type {LucideIconOrElement} from "@qualcomm-ui/react-core/lucide"
import {
  CoreStepper,
  type CoreStepperIndicatorProps,
  useStepperContext,
  useStepperItemContext,
} from "@qualcomm-ui/react-core/stepper"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsStepperContext} from "./qds-stepper-context"

export interface StepperIndicatorProps extends CoreStepperIndicatorProps {
  /**
   * Icon to display when the step is completed.
   *
   * @default Check
   */
  completedIcon?: LucideIconOrElement

  /**
   * Icon to display when the step is in an error state.
   *
   * @default StepperIndicatorAlert
   */
  errorIcon?: LucideIconOrElement
}

const AlertIcon = createLucideIcon(
  "stepper-indicator-alert",
  StepperIndicatorAlert as IconNode,
)

/**
 * Visual indicator for the step state. Renders a `<div>` element by default.
 *
 * By default, displays the step number or icon. When a step is completed, it shows a
 * checkmark icon. When a step is invalid, it shows an error icon.
 *
 * Rendering order:
 *
 * - errorIcon (when invalid)
 * - children (current step)
 * - completedIcon (when complete)
 * - children (not current step)
 */
export function StepperIndicator({
  children,
  completedIcon = Check,
  errorIcon = AlertIcon,
  ...props
}: StepperIndicatorProps): ReactElement {
  const qdsContext = useQdsStepperContext()
  const stepperContext = useStepperContext()
  const itemContext = useStepperItemContext()
  const itemState = stepperContext.getItemState(itemContext)
  const mergedProps = mergeProps(qdsContext.getIndicatorBindings(), props)

  return (
    <CoreStepper.Indicator {...mergedProps}>
      {itemState.current ? (
        <span>{children}</span>
      ) : itemState.completed ? (
        <IconOrNode icon={completedIcon} />
      ) : itemState.invalid ? (
        <IconOrNode icon={errorIcon} />
      ) : (
        <span>{children}</span>
      )}
    </CoreStepper.Indicator>
  )
}
