// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import type {TourStepAction} from "@qualcomm-ui/core/tour"
import {CoreTour} from "@qualcomm-ui/react-core/tour"
import {Button, type ButtonProps} from "@qualcomm-ui/react/button"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsTourContext} from "./qds-tour-context.js"

export interface TourActionTriggerProps extends ButtonProps {
  action: TourStepAction
}

export function TourActionTrigger({
  action,
  emphasis,
  size = "sm",
  variant,
  ...props
}: TourActionTriggerProps): ReactElement {
  const mergedProps = mergeProps(
    useQdsTourContext().getActionTriggerBindings(),
    props,
  )
  const primary = action.action === "next"
  return (
    <CoreTour.ActionTrigger action={action}>
      <Button
        {...mergedProps}
        emphasis={emphasis ?? (primary ? "primary" : "neutral")}
        size={size}
        variant={variant ?? (primary ? "fill" : "outline")}
      />
    </CoreTour.ActionTrigger>
  )
}
