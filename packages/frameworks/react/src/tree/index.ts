import {
  TreeBranchContent,
  type TreeBranchContentProps,
} from "./tree-branch-content.js"
import {
  TreeBranchIndentGuide,
  type TreeBranchIndentGuideProps,
} from "./tree-branch-indent-guide.js"
import {TreeBranchNode, type TreeBranchNodeProps} from "./tree-branch-node.js"
import {
  TreeBranchTrigger,
  type TreeBranchTriggerProps,
} from "./tree-branch-trigger.js"
import {TreeBranch, type TreeBranchProps} from "./tree-branch.js"
import {TreeContext, type TreeContextProps} from "./tree-context.js"
import {TreeLabel, type TreeLabelProps} from "./tree-label.js"
import {TreeLeafNode, type TreeLeafNodeProps} from "./tree-leaf-node.js"
import {TreeNodeAction, type TreeNodeActionProps} from "./tree-node-action.js"
import {
  TreeNodeCheckbox,
  type TreeNodeCheckboxProps,
} from "./tree-node-checkbox.js"
import {TreeNodeIcon, type TreeNodeIconProps} from "./tree-node-icon.js"
import {
  TreeNodeIndicator,
  type TreeNodeIndicatorProps,
} from "./tree-node-indicator.js"
import {
  TreeNodeProvider,
  type TreeNodeProviderProps,
} from "./tree-node-provider.js"
import {TreeNodeText, type TreeNodeTextProps} from "./tree-node-text.js"
import {TreeNodes, type TreeNodesProps} from "./tree-nodes.js"
import {TreeRoot, type TreeRootProps} from "./tree-root.js"

export * from "./qds-tree-context.js"

export type {
  TreeBranchContentProps,
  TreeBranchIndentGuideProps,
  TreeBranchNodeProps,
  TreeBranchTriggerProps,
  TreeBranchProps,
  TreeContextProps,
  TreeLabelProps,
  TreeLeafNodeProps,
  TreeNodeActionProps,
  TreeNodeCheckboxProps,
  TreeNodeIconProps,
  TreeNodeIndicatorProps,
  TreeNodeProviderProps,
  TreeNodeTextProps,
  TreeNodesProps,
  TreeRootProps,
}

type TreeComponent = {
  /**
   * Groups the branch node and its content element. Renders a `<div>` element by
   * default.
   */
  Branch: typeof TreeBranch
  /**
   * Container element for the branch node's children. Renders a `<div>` element by
   * default.
   */
  BranchContent: typeof TreeBranchContent
  /**
   * Provides a visual guide to the indentation level of the branch's children.
   * Renders a `<div>` element by default.
   */
  BranchIndentGuide: typeof TreeBranchIndentGuide
  /**
   * An interactive tree item with children. Renders a `<div>` element by default.
   */
  BranchNode: typeof TreeBranchNode
  /**
   * Action that indicates whether a branch is expanded or collapsed. Renders a
   * `<div>` element by default.
   */
  BranchTrigger: typeof TreeBranchTrigger
  Context: typeof TreeContext
  /**
   * An optional accessible label for the tree. Renders a `<div>` element by default.
   */
  Label: typeof TreeLabel
  /**
   * A childless tree item. Renders a `<div>` element by default.
   */
  LeafNode: typeof TreeLeafNode
  /**
   * An action button within a tree item's interactive area. Renders a `<button>`
   * element by default.
   */
  NodeAction: typeof TreeNodeAction
  /**
   * A checkbox control within a tree item. Renders a `<span>` element by default.
   */
  NodeCheckbox: typeof TreeNodeCheckbox
  /**
   * The icon for the tree item. Renders a `<span>` element by default.
   */
  NodeIcon: typeof TreeNodeIcon
  /**
   * Indicates whether the tree item is selected. Renders a `<div>` element by
   * default.
   */
  NodeIndicator: typeof TreeNodeIndicator
  NodeProvider: typeof TreeNodeProvider
  /**
   * A helper component that renders recursive tree nodes. Doesn't render its own
   * HTML element.
   */
  Nodes: typeof TreeNodes
  /**
   * The primary title of the tree item. Renders a `<span>` element by default.
   */
  NodeText: typeof TreeNodeText
  /**
   * Groups all parts of the tree. Renders a `<div>` element by default.
   */
  Root: typeof TreeRoot
}

export const Tree: TreeComponent = {
  Branch: TreeBranch,
  BranchContent: TreeBranchContent,
  BranchIndentGuide: TreeBranchIndentGuide,
  BranchNode: TreeBranchNode,
  BranchTrigger: TreeBranchTrigger,
  Context: TreeContext,
  Label: TreeLabel,
  LeafNode: TreeLeafNode,
  NodeAction: TreeNodeAction,
  NodeCheckbox: TreeNodeCheckbox,
  NodeIcon: TreeNodeIcon,
  NodeIndicator: TreeNodeIndicator,
  NodeProvider: TreeNodeProvider,
  Nodes: TreeNodes,
  NodeText: TreeNodeText,
  Root: TreeRoot,
}
