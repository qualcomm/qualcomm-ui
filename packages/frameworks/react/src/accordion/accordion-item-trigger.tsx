// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

import type {LucideIcon} from "lucide-react"

import {accordionClasses} from "@qualcomm-ui/qds-core/accordion"
import {IconOrNode} from "@qualcomm-ui/react/icon"
import {useAccordionItemTrigger} from "@qualcomm-ui/react-core/accordion"
import {
  type ElementRenderProp,
  type IdProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export interface AccordionItemTriggerProps
  extends IdProp,
    ElementRenderProp<"button"> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode

  /**
   * An icon to display next to the trigger title.
   */
  icon?: LucideIcon
}

/**
 * A button that opens and closes the corresponding panel. Renders a `<button>`
 * element by default.
 */
export function AccordionItemTrigger({
  children,
  icon,
  id,
  ...props
}: AccordionItemTriggerProps): ReactElement {
  const contextProps = useAccordionItemTrigger({id})
  const mergedProps = mergeProps(
    contextProps,
    {
      className: accordionClasses.itemTrigger,
    },
    props,
  )

  return (
    <PolymorphicElement as="button" {...mergedProps}>
      {icon && <IconOrNode className={accordionClasses.icon} icon={icon} />}
      {children}
    </PolymorphicElement>
  )
}
