// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

import {
  createFilterPanelApi,
  splitFilterPanelProps,
  type FilterPanelApiProps,
  filterPanelMachine,
} from "@qualcomm-ui/core/filter-panel"
import {normalizeProps, useMachine} from "@qualcomm-ui/react-core/machine"
import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {FilterPanelContextProvider} from "./filter-panel-context.js"
import {useFilterPanelClearTrigger} from "./use-filter-panel.js"

export interface CoreFilterPanelRootProps
  extends FilterPanelApiProps, Omit<ElementRenderProp<"div">, "defaultValue"> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode
}

export function CoreFilterPanelRoot({
  children,
  ...props
}: CoreFilterPanelRootProps): ReactElement {
  const [filterPanelProps, localProps] = splitFilterPanelProps(props)
  const machine = useMachine(filterPanelMachine, filterPanelProps)
  const api = createFilterPanelApi(machine, normalizeProps)

  const mergedProps = mergeProps(api.getRootBindings(), localProps)

  return (
    <FilterPanelContextProvider value={api}>
      <PolymorphicElement as="div" {...mergedProps}>
        {children}
      </PolymorphicElement>
    </FilterPanelContextProvider>
  )
}

export interface CoreFilterPanelClearTriggerProps extends ElementRenderProp<"button"> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode
}

export function CoreFilterPanelClearTrigger({
  children,
  ...props
}: CoreFilterPanelClearTriggerProps): ReactElement {
  const mergedProps = mergeProps(useFilterPanelClearTrigger(), props)

  return (
    <PolymorphicElement as="button" {...mergedProps}>
      {children}
    </PolymorphicElement>
  )
}
