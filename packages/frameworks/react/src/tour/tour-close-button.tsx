// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {X} from "lucide-react"

import type {LucideIconOrNode} from "@qualcomm-ui/react-core/lucide"
import {CoreTour} from "@qualcomm-ui/react-core/tour"
import {
  InlineIconButton,
  type InlineIconButtonProps,
} from "@qualcomm-ui/react/inline-icon-button"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsTourContext} from "./qds-tour-context.js"

export interface TourCloseButtonProps extends Omit<
  InlineIconButtonProps,
  "icon"
> {
  icon?: LucideIconOrNode | undefined
}

export function TourCloseButton({
  icon = X,
  ...props
}: TourCloseButtonProps): ReactElement {
  const mergedProps = mergeProps(
    useQdsTourContext().getCloseButtonBindings(),
    props,
  )
  return (
    <CoreTour.CloseTrigger>
      <InlineIconButton
        {...mergedProps}
        emphasis="neutral"
        icon={icon}
        size="sm"
        variant="fixed"
      />
    </CoreTour.CloseTrigger>
  )
}
