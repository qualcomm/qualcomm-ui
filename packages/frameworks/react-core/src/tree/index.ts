import {
  CoreTreeBranchIndentGuide,
  type CoreTreeBranchIndentGuideProps,
  CoreTreeBranchNode,
  type CoreTreeBranchNodeProps,
  CoreTreeBranchTrigger,
  type CoreTreeBranchTriggerProps,
  CoreTreeContext,
  type CoreTreeContextProps,
  CoreTreeLabel,
  type CoreTreeLabelProps,
  CoreTreeLeafNode,
  type CoreTreeLeafNodeProps,
  CoreTreeNodeAction,
  type CoreTreeNodeActionProps,
  CoreTreeNodeCheckbox,
  type CoreTreeNodeCheckboxProps,
  CoreTreeNodeIndicator,
  type CoreTreeNodeIndicatorProps,
  CoreTreeNodeText,
  type CoreTreeNodeTextProps,
  CoreTreeRoot,
  type CoreTreeRootProps,
} from "./core-tree.js"

export * from "./tree-context.js"
export * from "./tree-node-context.js"
export * from "./use-tree.js"

export type {
  CoreTreeRootProps,
  CoreTreeLabelProps,
  CoreTreeBranchNodeProps,
  CoreTreeBranchIndentGuideProps,
  CoreTreeBranchTriggerProps,
  CoreTreeContextProps,
  CoreTreeNodeIndicatorProps,
  CoreTreeNodeTextProps,
  CoreTreeLeafNodeProps,
  CoreTreeNodeCheckboxProps,
  CoreTreeNodeActionProps,
}

type CoreTreeComponent = {
  BranchIndentGuide: typeof CoreTreeBranchIndentGuide
  BranchNode: typeof CoreTreeBranchNode
  BranchTrigger: typeof CoreTreeBranchTrigger
  Context: typeof CoreTreeContext
  Label: typeof CoreTreeLabel
  LeafNode: typeof CoreTreeLeafNode
  NodeAction: typeof CoreTreeNodeAction
  NodeCheckbox: typeof CoreTreeNodeCheckbox
  NodeIndicator: typeof CoreTreeNodeIndicator
  NodeText: typeof CoreTreeNodeText
  Root: typeof CoreTreeRoot
}

export const CoreTree: CoreTreeComponent = {
  BranchIndentGuide: CoreTreeBranchIndentGuide,
  BranchNode: CoreTreeBranchNode,
  BranchTrigger: CoreTreeBranchTrigger,
  Context: CoreTreeContext,
  Label: CoreTreeLabel,
  LeafNode: CoreTreeLeafNode,
  NodeAction: CoreTreeNodeAction,
  NodeCheckbox: CoreTreeNodeCheckbox,
  NodeIndicator: CoreTreeNodeIndicator,
  NodeText: CoreTreeNodeText,
  Root: CoreTreeRoot,
}
