// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {tooltipClasses} from "./tooltip.classes"

type TooltipClasses = typeof tooltipClasses

export interface QdsTooltipArrowBindings {
  className: TooltipClasses["arrow"]
}

export interface QdsTooltipArrowTipBindings {
  className: TooltipClasses["arrowTip"]
}

export interface QdsTooltipContentBindings {
  className: TooltipClasses["content"]
}

export interface QdsTooltipPositionerBindings {
  className: TooltipClasses["positioner"]
}
