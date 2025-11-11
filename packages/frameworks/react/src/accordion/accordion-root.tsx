// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

import {
  type AccordionApiProps,
  splitAccordionProps,
} from "@qualcomm-ui/core/accordion"
import {
  getQdsAccordionBindings,
  type QdsAccordionApiProps,
} from "@qualcomm-ui/qds-core/accordion"
import {
  AccordionContextProvider,
  useAccordion,
} from "@qualcomm-ui/react-core/accordion"
import {normalizeProps} from "@qualcomm-ui/react-core/machine"
import {useControlledId} from "@qualcomm-ui/react-core/state"
import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export interface AccordionRootProps
  extends AccordionApiProps,
    QdsAccordionApiProps,
    Omit<ElementRenderProp<"div">, "defaultValue" | "dir"> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode
}

/**
 * Groups all parts of the accordion. Renders a `<div>` element by default.
 */
export function AccordionRoot({
  children,
  id,
  size,
  uncontained,
  ...props
}: AccordionRootProps): ReactElement {
  const [accordionProps, localProps] = splitAccordionProps(props)
  const context = useAccordion(accordionProps)

  const mergedProps = mergeProps(
    context.getRootBindings({id: useControlledId(id)}),
    getQdsAccordionBindings({size, uncontained}, normalizeProps),
    localProps,
  )

  return (
    <AccordionContextProvider value={context}>
      <PolymorphicElement as="div" {...mergedProps}>
        {children}
      </PolymorphicElement>
    </AccordionContextProvider>
  )
}
