// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

import {ChevronDown, type LucideIcon} from "lucide-react"

import {InlineIconButton} from "@qualcomm-ui/react/inline-icon-button"
import {useSelectIndicator} from "@qualcomm-ui/react-core/select"
import type {ElementRenderProp} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsSelectContext} from "./qds-select-context"

export interface SelectIndicatorProps extends ElementRenderProp<"button"> {
  /**
   * Indicator icon.
   *
   * @default ChevronDown
   */
  icon?: ReactNode | LucideIcon
}

/**
 * Icon that indicates the open/close state of the select's associated panel.
 * Renders a `<div>` element by default.
 */
export function SelectIndicator({
  icon = ChevronDown,
  ...props
}: SelectIndicatorProps): ReactElement {
  const contextProps = useSelectIndicator()
  const qdsSelectContext = useQdsSelectContext()
  const mergedProps = mergeProps(
    contextProps,
    qdsSelectContext.getIndicatorBindings(),
    props,
  )

  return (
    <InlineIconButton
      icon={icon}
      size={qdsSelectContext.size === "sm" ? "sm" : "md"}
      variant="scale"
      {...mergedProps}
    />
  )
}
