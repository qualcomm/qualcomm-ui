// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

import {
  type FilterPanelApi,
  type FilterPanelApiProps,
  splitFilterPanelProps,
} from "@qualcomm-ui/core/filter-panel"
import type {
  FilterDefinition,
  FilterDefinitions,
  IdentifiedFilterDefinition,
} from "@qualcomm-ui/core/filters"
import {
  CoreCollapsible,
  type CoreCollapsibleContentProps,
  type CoreCollapsibleRootProps,
  type CoreCollapsibleTriggerProps,
} from "@qualcomm-ui/react-core/collapsible"
import {useControlledId} from "@qualcomm-ui/react-core/state"
import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {
  FilterPanelContextProvider,
  useFilterPanelContext,
} from "./filter-panel-context.js"
import {
  FilterPanelFilterContextProvider,
  useFilterPanelFilterContext,
} from "./filter-panel-filter-context.js"
import {
  useFilterPanel,
  useFilterPanelApplyTrigger,
  useFilterPanelClearTrigger,
  useFilterPanelFilterState,
} from "./use-filter-panel.js"

export interface CoreFilterPanelRootProps<
  TDefs extends FilterDefinitions = FilterDefinitions,
>
  extends
    FilterPanelApiProps<TDefs>,
    Omit<ElementRenderProp<"div">, "defaultValue"> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode
}

export function CoreFilterPanelRoot<
  TDefs extends FilterDefinitions = FilterDefinitions,
>({children, ...props}: CoreFilterPanelRootProps<TDefs>): ReactElement {
  const [filterPanelProps, localProps] = splitFilterPanelProps(props)
  const api = useFilterPanel(filterPanelProps)

  return (
    <CoreFilterPanelRootProvider value={api} {...localProps}>
      {children}
    </CoreFilterPanelRootProvider>
  )
}

export interface CoreFilterPanelRootProviderProps extends ElementRenderProp<"div"> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode

  /**
   * A filter panel API created with `useFilterPanel`.
   *
   * @inheritDoc
   */
  value: FilterPanelApi<any>
}

export function CoreFilterPanelRootProvider({
  children,
  value,
  ...props
}: CoreFilterPanelRootProviderProps): ReactElement {
  const mergedProps = mergeProps(value.getRootBindings(), props)

  return (
    <FilterPanelContextProvider value={value}>
      <PolymorphicElement as="div" {...mergedProps}>
        {children}
      </PolymorphicElement>
    </FilterPanelContextProvider>
  )
}

export interface CoreFilterPanelApplyTriggerProps extends ElementRenderProp<"button"> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode
}

export function CoreFilterPanelApplyTrigger({
  children,
  ...props
}: CoreFilterPanelApplyTriggerProps): ReactElement {
  const mergedProps = mergeProps(useFilterPanelApplyTrigger(), props)

  return (
    <PolymorphicElement as="button" {...mergedProps}>
      {children}
    </PolymorphicElement>
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

export interface CoreFilterPanelFilterProps<
  TDefinition extends FilterDefinition = FilterDefinition,
> extends CoreCollapsibleRootProps {
  /**
   * The filter's definition, from `defineFilters`.
   */
  filter: IdentifiedFilterDefinition<TDefinition>
}

/**
 * Provides one filter's state to its parts, and expands and collapses its
 * content. Expanded by default.
 */
export function CoreFilterPanelFilter<TDefinition extends FilterDefinition>({
  children,
  defaultOpen = true,
  filter,
  ...props
}: CoreFilterPanelFilterProps<TDefinition>): ReactElement {
  const api = useFilterPanelContext()
  const labelId = useControlledId()
  const context = useFilterPanelFilterState(filter, labelId)

  const mergedProps = mergeProps(api.getFilterBindings({id: filter.id}), props)

  return (
    <FilterPanelFilterContextProvider value={context}>
      <CoreCollapsible.Root defaultOpen={defaultOpen} {...mergedProps}>
        {children}
      </CoreCollapsible.Root>
    </FilterPanelFilterContextProvider>
  )
}

export interface CoreFilterPanelFilterTriggerProps extends CoreCollapsibleTriggerProps {}

export function CoreFilterPanelFilterTrigger(
  props: CoreFilterPanelFilterTriggerProps,
): ReactElement {
  return <CoreCollapsible.Trigger {...props} />
}

export interface CoreFilterPanelFilterLabelProps extends Omit<
  ElementRenderProp<"span">,
  "children"
> {
  /**
   * Overrides how the label renders. Accepts a `ReactNode`, or a function
   * that receives the resolved string label. The rendered label also names the
   * filter's control. `getFilterLabel` and value summaries keep the resolved
   * string.
   */
  children?: ReactNode | ((label: string) => ReactNode)
}

export function CoreFilterPanelFilterLabel({
  children,
  ...props
}: CoreFilterPanelFilterLabelProps): ReactElement {
  const api = useFilterPanelContext()
  const filter = useFilterPanelFilterContext()

  const mergedProps = mergeProps(
    api.getFilterLabelBindings({id: filter.id}),
    {id: filter.labelId},
    props,
  )

  return (
    <PolymorphicElement as="span" {...mergedProps}>
      {typeof children === "function"
        ? children(filter.label)
        : (children ?? filter.label)}
    </PolymorphicElement>
  )
}

export interface CoreFilterPanelFilterCountProps extends Omit<
  ElementRenderProp<"span">,
  "children"
> {
  /**
   * Overrides how the count renders.
   */
  children?: ReactNode | ((count: number) => ReactNode)
}

export function CoreFilterPanelFilterCount({
  children,
  ...props
}: CoreFilterPanelFilterCountProps): ReactElement {
  const api = useFilterPanelContext()
  const filter = useFilterPanelFilterContext()

  const mergedProps = mergeProps(
    api.getFilterCountBindings({id: filter.id}),
    props,
  )

  return (
    <PolymorphicElement as="span" {...mergedProps}>
      {typeof children === "function"
        ? children(filter.count)
        : (children ?? filter.count)}
    </PolymorphicElement>
  )
}

export interface CoreFilterPanelFilterContentProps extends CoreCollapsibleContentProps {}

export function CoreFilterPanelFilterContent(
  props: CoreFilterPanelFilterContentProps,
): ReactElement | null {
  return <CoreCollapsible.Content {...props} />
}
