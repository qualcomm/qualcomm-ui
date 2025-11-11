// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {ChevronDown} from "lucide-react"

import {accordionClasses} from "@qualcomm-ui/qds-core/accordion"
import {IconOrNode} from "@qualcomm-ui/react/icon"
import {useAccordionItemIndicator} from "@qualcomm-ui/react-core/accordion"
import type {LucideIconOrNode} from "@qualcomm-ui/react-core/lucide"
import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export interface AccordionItemIndicatorProps extends ElementRenderProp<"div"> {
  /**
   * Indicator icon for the accordion item trigger.
   * @default ChevronDown
   */
  icon?: LucideIconOrNode
}

/**
 * Indicates the open/close state of the trigger's associated panel. Renders a
 * `<div>` element by default.
 */
export function AccordionItemIndicator({
  icon = ChevronDown,
  ...props
}: AccordionItemIndicatorProps): ReactElement {
  const contextProps = useAccordionItemIndicator()
  const mergedProps = mergeProps(
    contextProps,
    {className: accordionClasses.itemTriggerIndicator},
    props,
  )

  return (
    <PolymorphicElement as="div" {...mergedProps}>
      <IconOrNode icon={icon} />
    </PolymorphicElement>
  )
}
