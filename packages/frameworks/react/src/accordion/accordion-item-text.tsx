// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ComponentPropsWithRef, ReactElement, ReactNode} from "react"

import {accordionClasses} from "@qualcomm-ui/qds-core/accordion"
import {useAccordionItemText} from "@qualcomm-ui/react-core/accordion"
import {PolymorphicElement} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export interface AccordionItemTextProps extends ComponentPropsWithRef<"span"> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode
}

/**
 * A heading that labels the accordion item. Renders a `<span>` element by default.
 */
export function AccordionItemText(props: AccordionItemTextProps): ReactElement {
  const contextProps = useAccordionItemText()
  const mergedProps = mergeProps(
    contextProps,
    {className: accordionClasses.itemText},
    props,
  )
  return <PolymorphicElement as="span" {...mergedProps} />
}
