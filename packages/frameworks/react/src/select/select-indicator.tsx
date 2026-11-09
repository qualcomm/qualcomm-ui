// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {ChevronDown} from "lucide-react"

import type {LucideIconOrElement} from "@qualcomm-ui/react-core/lucide"
import {useSelectIndicator} from "@qualcomm-ui/react-core/select"
import type {ElementRenderProp} from "@qualcomm-ui/react-core/system"
import {IconButton} from "@qualcomm-ui/react/button"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsSelectContext} from "./qds-select-context.js"

export interface SelectIndicatorProps extends ElementRenderProp<"button"> {
  /**
   * Indicator icon.
   *
   * @default ChevronDown
   */
  icon?: LucideIconOrElement
}

/**
 * Icon that indicates the open/close state of the select's associated panel.
 * Renders a `<button>` element by default.
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
    <IconButton
      density="compact"
      icon={icon}
      size={qdsSelectContext.size === "sm" ? "sm" : "md"}
      variant="ghost"
      {...mergedProps}
    />
  )
}
