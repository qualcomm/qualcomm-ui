// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

import {useAccordionItemState} from "@qualcomm-ui/react-core/accordion"
import {CoreCollapsible} from "@qualcomm-ui/react-core/collapsible"
import type {ElementRenderProp} from "@qualcomm-ui/react-core/system"

import {AccordionItemContentAnimator} from "./accordion-item-content-animator"
import {
  AccordionItemContentBody,
  type AccordionItemContentBodyProps,
} from "./accordion-item-content-body"

export interface AccordionItemContentProps extends ElementRenderProp<"div"> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode

  /**
   * Props applied to the content body element.
   * @inheritDoc
   */
  contentBodyProps?: AccordionItemContentBodyProps
}

/**
 * A collapsible panel with the accordion item contents. Renders a `<div>` element
 * by default.
 *
 * @remarks
 * This component is a shortcut for the following structure:
 * ```tsx
 * <CoreCollapsible.RootProvider open={open}>
 *   <Accordion.ItemContentAnimator>
 *     <Accordion.ItemContentBody>
 *       {props.children}
 *     </Accordion.ItemContentBody>
 *   </Accordion.ItemContentAnimator>
 * </CoreCollapsible.RootProvider>
 * ```
 */
export function AccordionItemContent({
  children,
  contentBodyProps,
  ...props
}: AccordionItemContentProps): ReactElement {
  const {open} = useAccordionItemState()

  return (
    <CoreCollapsible.RootProvider open={open}>
      <AccordionItemContentAnimator {...props}>
        <AccordionItemContentBody {...contentBodyProps}>
          {children}
        </AccordionItemContentBody>
      </AccordionItemContentAnimator>
    </CoreCollapsible.RootProvider>
  )
}
