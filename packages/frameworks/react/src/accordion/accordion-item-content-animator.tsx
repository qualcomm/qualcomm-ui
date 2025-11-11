// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

import {accordionClasses} from "@qualcomm-ui/qds-core/accordion"
import {Collapsible} from "@qualcomm-ui/react/collapsible"
import {useAccordionItemContent} from "@qualcomm-ui/react-core/accordion"
import type {ElementRenderProp, IdProp} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export interface AccordionItemContentAnimatorProps
  extends IdProp,
    ElementRenderProp<"div"> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode
}

/**
 * The outer container of the accordion item content. Responsible for animating the
 * inner accordion contents. Renders a `<div>` element by default.
 */
export function AccordionItemContentAnimator({
  children,
  id,
  ...props
}: AccordionItemContentAnimatorProps): ReactElement {
  const contextProps = useAccordionItemContent({id})
  const mergedProps = mergeProps(
    contextProps,
    {className: accordionClasses.itemContentAnimator},
    props,
  )

  return <Collapsible.Content {...mergedProps}>{children}</Collapsible.Content>
}
