// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

import {
  type RenderStrategyApiProps,
  splitRenderStrategyProps,
} from "@qualcomm-ui/core/presence"
import {
  createTreeApi,
  splitTreeProps,
  type TreeApi,
  type TreeApiProps,
  treeMachine,
} from "@qualcomm-ui/core/tree"
import {useOnDestroy} from "@qualcomm-ui/react-core/effects"
import {useLocaleContext} from "@qualcomm-ui/react-core/locale"
import {normalizeProps, useMachine} from "@qualcomm-ui/react-core/machine"
import {RenderStrategyPropsProvider} from "@qualcomm-ui/react-core/presence"
import {useControlledId} from "@qualcomm-ui/react-core/state"
import {
  type ElementRenderProp,
  type IdProp,
  PolymorphicElement,
  type RenderProp,
  renderProp,
} from "@qualcomm-ui/react-core/system"
import type {TreeNode} from "@qualcomm-ui/utils/collection"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {TreeContextProvider, useTreeContext} from "./tree-context"
import {useTreeNodePropsContext} from "./tree-node-context"

export interface CoreTreeRootProps<T extends TreeNode = TreeNode>
  extends IdProp,
    Omit<ElementRenderProp<"div">, "dir">,
    TreeApiProps<T>,
    RenderStrategyApiProps {}

export function CoreTreeRoot<T extends TreeNode = TreeNode>({
  children,
  id,
  ...props
}: CoreTreeRootProps<T>): ReactElement {
  const [renderStrategyProps, localTreeProps] = splitRenderStrategyProps(props)
  const [treeProps, localProps] = splitTreeProps(localTreeProps)

  const {dir} = useLocaleContext()

  const machine = useMachine(treeMachine, {dir, ...treeProps})
  const api = createTreeApi(machine, normalizeProps)

  const mergedProps = mergeProps(
    api.getRootBindings({id: useControlledId(id)}),
    localProps,
  )

  return (
    <TreeContextProvider value={api}>
      <RenderStrategyPropsProvider value={renderStrategyProps}>
        <PolymorphicElement as="div" {...mergedProps}>
          {children}
        </PolymorphicElement>
      </RenderStrategyPropsProvider>
    </TreeContextProvider>
  )
}

export interface CoreTreeLabelProps extends IdProp, ElementRenderProp<"div"> {}

export function CoreTreeLabel({
  children,
  id,
  ...props
}: CoreTreeLabelProps): ReactElement {
  const treeContext = useTreeContext()

  const mergedProps = mergeProps(
    treeContext.getLabelBindings({
      id: useControlledId(id),
      onDestroy: useOnDestroy(),
    }),
    props,
  )

  return (
    <PolymorphicElement as="div" {...mergedProps}>
      {children}
    </PolymorphicElement>
  )
}

export interface CoreTreeBranchNodeProps extends ElementRenderProp<"div"> {}

export function CoreTreeBranchNode({
  children,
  ...props
}: CoreTreeBranchNodeProps): ReactElement {
  const treeContext = useTreeContext()
  const nodeProps = useTreeNodePropsContext()
  const mergedProps = mergeProps(
    treeContext.getBranchNodeBindings(nodeProps),
    props,
  )

  return (
    <PolymorphicElement as="div" {...mergedProps}>
      {children}
    </PolymorphicElement>
  )
}

export interface CoreTreeBranchIndentGuideProps
  extends ElementRenderProp<"div"> {}

export function CoreTreeBranchIndentGuide({
  children,
  ...props
}: CoreTreeBranchIndentGuideProps): ReactElement {
  const treeContext = useTreeContext()
  const nodeProps = useTreeNodePropsContext()
  const mergedProps = mergeProps(
    treeContext.getBranchIndentGuideBindings(nodeProps),
    props,
  )

  return (
    <PolymorphicElement as="div" {...mergedProps}>
      {children}
    </PolymorphicElement>
  )
}

export interface CoreTreeBranchTriggerProps extends ElementRenderProp<"div"> {}

export function CoreTreeBranchTrigger({
  children,
  ...props
}: CoreTreeBranchTriggerProps): ReactElement {
  const treeContext = useTreeContext()
  const nodeProps = useTreeNodePropsContext()
  const mergedProps = mergeProps(
    treeContext.getBranchTriggerBindings(nodeProps),
    props,
  )

  return (
    <PolymorphicElement as="div" {...mergedProps}>
      {children}
    </PolymorphicElement>
  )
}

export interface CoreTreeContextProps<T extends TreeNode = TreeNode> {
  /**
   * {@link
   * https://react-next.qui.qualcomm.com/render-props#render-prop
   * Render Prop}
   *
   * @inheritDoc
   */
  children: RenderProp<TreeApi<T>>
}

export function CoreTreeContext({children}: CoreTreeRootProps): ReactNode {
  const treeContext = useTreeContext()
  return renderProp(children, treeContext)
}

export interface CoreTreeNodeIndicatorProps extends ElementRenderProp<"div"> {}

export function CoreTreeNodeIndicator({
  children,
  ...props
}: CoreTreeNodeIndicatorProps): ReactElement {
  const treeContext = useTreeContext()
  const nodeProps = useTreeNodePropsContext()
  const mergedProps = mergeProps(
    treeContext.getNodeIndicatorBindings(nodeProps),
    props,
  )

  return (
    <PolymorphicElement as="div" {...mergedProps}>
      {children}
    </PolymorphicElement>
  )
}

export interface CoreTreeNodeTextProps extends ElementRenderProp<"span"> {}

export function CoreTreeNodeText({
  children,
  ...props
}: CoreTreeNodeTextProps): ReactElement {
  const treeContext = useTreeContext()
  const nodeProps = useTreeNodePropsContext()
  const mergedProps = mergeProps(
    treeContext.getNodeTextBindings(nodeProps),
    props,
  )

  return (
    <PolymorphicElement as="span" {...mergedProps}>
      {children}
    </PolymorphicElement>
  )
}

export interface CoreTreeLeafNodeProps extends ElementRenderProp<"div"> {}

export function CoreTreeLeafNode({
  children,
  ...props
}: CoreTreeLeafNodeProps): ReactElement {
  const treeContext = useTreeContext()
  const nodeProps = useTreeNodePropsContext()
  const mergedProps = mergeProps(
    treeContext.getLeafNodeBindings(nodeProps),
    props,
  )

  return (
    <PolymorphicElement as="div" {...mergedProps}>
      {children}
    </PolymorphicElement>
  )
}

export interface CoreTreeNodeCheckboxProps extends ElementRenderProp<"span"> {
  /**
   * React Node rendered when the node is checked.
   *
   * @default CheckmarkCheckedIcon
   */
  checked?: ReactNode

  /**
   * React Node rendered when the node is indeterminate.
   *
   * @default CheckmarkIndeterminateIcon
   */
  indeterminate?: ReactNode

  /**
   * React Node rendered when the node is unchecked.
   */
  unchecked?: ReactNode
}

export function CoreTreeNodeCheckbox({
  checked,
  indeterminate,
  unchecked,
  ...props
}: CoreTreeNodeCheckboxProps): ReactElement {
  const treeContext = useTreeContext()
  const nodeProps = useTreeNodePropsContext()
  const mergedProps = mergeProps(
    treeContext.getNodeCheckboxBindings(nodeProps),
    props,
  )

  const nodeState = treeContext.getNodeState(nodeProps)

  if (nodeState.checked === "indeterminate") {
    return (
      <PolymorphicElement as="span" {...mergedProps}>
        {indeterminate}
      </PolymorphicElement>
    )
  } else if (nodeState.checked) {
    return (
      <PolymorphicElement as="span" {...mergedProps}>
        {checked}
      </PolymorphicElement>
    )
  }

  return (
    <PolymorphicElement as="span" {...mergedProps}>
      {unchecked}
    </PolymorphicElement>
  )
}

export interface CoreTreeNodeActionProps extends ElementRenderProp<"button"> {}

export function CoreTreeNodeAction({
  children,
  ...props
}: CoreTreeNodeActionProps): ReactElement {
  const treeContext = useTreeContext()
  const nodeProps = useTreeNodePropsContext()
  const mergedProps = mergeProps(
    treeContext.getNodeActionBindings(nodeProps),
    props,
  )

  return (
    <PolymorphicElement as="button" {...mergedProps}>
      {children}
    </PolymorphicElement>
  )
}
