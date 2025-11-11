// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type ReactElement, type ReactNode, useMemo} from "react"

import type {AccordionItemApiProps} from "@qualcomm-ui/core/accordion"
import {accordionClasses} from "@qualcomm-ui/qds-core/accordion"
import {
  AccordionItemContextProvider,
  useAccordionItem,
} from "@qualcomm-ui/react-core/accordion"
import {
  type ElementRenderProp,
  type IdProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export interface AccordionItemRootProps
  extends IdProp,
    ElementRenderProp<"div">,
    AccordionItemApiProps {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode
}

/**
 * Groups all parts of the accordion item. Renders a `<div>` element by default.
 * Intended to be used with the composite elements:
 *
 * @example
 * ```tsx
 * <Accordion.ItemRoot value="...">
 *   <Accordion.ItemTrigger>
 *     <Accordion.ItemText>...</Accordion.ItemText>
 *     <Accordion.ItemSecondaryText>
 *       ...
 *     </Accordion.ItemSecondaryText>
 *     <Accordion.ItemIndicator />
 *   </Accordion.ItemTrigger>
 *   <Accordion.ItemContent>
 *     ...
 *   </Accordion.ItemContent>
 * </Accordion.ItemRoot>
 * ```
 */
export function AccordionItemRoot({
  children,
  disabled,
  id,
  value,
  ...props
}: AccordionItemRootProps): ReactElement {
  const contextProps = useAccordionItem({disabled, id, value})
  const mergedProps = mergeProps(
    contextProps,
    {className: accordionClasses.item},
    props,
  )

  const itemContext = useMemo(
    () => ({disabled: mergedProps.disabled, value}),
    [mergedProps.disabled, value],
  )
  return (
    <AccordionItemContextProvider value={itemContext}>
      <PolymorphicElement
        as="div"
        open={contextProps["data-state"] === "open"}
        {...mergedProps}
      >
        {children}
      </PolymorphicElement>
    </AccordionItemContextProvider>
  )
}
