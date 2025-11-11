// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

import {accordionClasses} from "@qualcomm-ui/qds-core/accordion"
import {useAccordionItemSecondaryText} from "@qualcomm-ui/react-core/accordion"
import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export interface AccordionItemSecondaryTextProps
  extends ElementRenderProp<"span"> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode
}

/**
 * A description with additional information about the accordion item. Renders a
 * `<span>` element by default.
 */
export function AccordionItemSecondaryText(
  props: AccordionItemSecondaryTextProps,
): ReactElement {
  const contextProps = useAccordionItemSecondaryText()
  const mergedProps = mergeProps(
    contextProps,
    {className: accordionClasses.itemTriggerSecondary},
    props,
  )

  return <PolymorphicElement as="span" {...mergedProps} />
}
