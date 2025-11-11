// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

import type {LucideIcon} from "lucide-react"

import type {AccordionItemApiProps} from "@qualcomm-ui/core/accordion"
import type {ElementRenderProp, IdProp} from "@qualcomm-ui/react-core/system"

import {
  AccordionItemContent,
  type AccordionItemContentProps,
} from "./accordion-item-content"
import {
  AccordionItemIndicator,
  type AccordionItemIndicatorProps,
} from "./accordion-item-indicator"
import {AccordionItemRoot} from "./accordion-item-root"
import {
  AccordionItemSecondaryText,
  type AccordionItemSecondaryTextProps,
} from "./accordion-item-secondary-text"
import {
  AccordionItemText,
  type AccordionItemTextProps,
} from "./accordion-item-text"
import {
  AccordionItemTrigger,
  type AccordionItemTriggerProps,
} from "./accordion-item-trigger"

export interface AccordionItemProps
  extends AccordionItemApiProps,
    IdProp,
    ElementRenderProp<"div"> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   * This is the content body of the item.
   */
  children?: ReactNode

  /**
   * Props applied to the content element.
   * @inheritDoc
   */
  contentProps?: AccordionItemContentProps

  /**
   * An icon to display next to the trigger title.
   */
  icon?: LucideIcon

  /**
   * Props applied to the indicator element.
   * @inheritDoc
   */
  indicatorProps?: AccordionItemIndicatorProps

  /**
   * The secondary text label for the item.
   */
  secondaryText?: ReactNode

  /**
   * Props applied to the secondary text element.
   * @inheritDoc
   */
  secondaryTextProps?: AccordionItemSecondaryTextProps

  /**
   * The primary text label for the item.
   */
  text: ReactNode

  /**
   * Props applied to the text element.
   * @inheritDoc
   */
  textProps?: AccordionItemTextProps

  /**
   * Props applied to the trigger element.
   * @inheritDoc
   */
  triggerProps?: AccordionItemTriggerProps
}

/**
 * Groups all parts of the accordion item and exposes customization via props.
 * Renders a `<div>` element by default.
 */
export function AccordionItem({
  children,
  contentProps,
  icon,
  indicatorProps,
  secondaryText,
  secondaryTextProps,
  text,
  textProps,
  triggerProps,
  ...props
}: AccordionItemProps): ReactElement {
  const secondaryTextContent = secondaryText || secondaryTextProps?.children
  return (
    <AccordionItemRoot {...props}>
      <AccordionItemTrigger icon={icon} {...triggerProps}>
        <AccordionItemText {...textProps}>{text}</AccordionItemText>
        {secondaryTextContent ? (
          <AccordionItemSecondaryText {...secondaryTextProps}>
            {secondaryTextContent}
          </AccordionItemSecondaryText>
        ) : null}
        <AccordionItemIndicator {...indicatorProps} />
      </AccordionItemTrigger>
      <AccordionItemContent {...contentProps}>{children}</AccordionItemContent>
    </AccordionItemRoot>
  )
}
