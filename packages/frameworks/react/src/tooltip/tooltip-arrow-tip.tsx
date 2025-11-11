// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {tooltipClasses} from "@qualcomm-ui/qds-core/tooltip"
import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {useTooltipArrowTip} from "@qualcomm-ui/react-core/tooltip"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export interface TooltipArrowTipProps extends ElementRenderProp<"div"> {}

/**
 * The arrow tip element. Renders a `<div>` element by default.
 */
export function TooltipArrowTip(props: TooltipArrowTipProps): ReactElement {
  const contextProps = useTooltipArrowTip()
  const mergedProps = mergeProps(
    contextProps,
    {className: tooltipClasses.arrowTip},
    props,
  )

  return <PolymorphicElement as="div" {...mergedProps} />
}
