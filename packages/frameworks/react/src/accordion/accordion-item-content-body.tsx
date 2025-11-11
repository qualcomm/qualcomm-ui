// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

import {accordionClasses} from "@qualcomm-ui/qds-core/accordion"
import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export interface AccordionItemContentBodyProps
  extends ElementRenderProp<"div"> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode
}

/**
 * The inner container of the accordion item content. Renders a `<div>` element by
 * default.
 */
export function AccordionItemContentBody({
  children,
  ...props
}: AccordionItemContentBodyProps): ReactElement {
  const mergedProps = mergeProps(
    {className: accordionClasses.itemContentBody},
    props,
  )

  return (
    <PolymorphicElement as="div" {...mergedProps}>
      {children}
    </PolymorphicElement>
  )
}
