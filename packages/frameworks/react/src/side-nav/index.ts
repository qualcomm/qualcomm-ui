import {SideNavBranch, type SideNavBranchProps} from "./side-nav-branch"
import {
  SideNavBranchContent,
  type SideNavBranchContentProps,
} from "./side-nav-branch-content"
import {
  SideNavBranchIndentGuide,
  type SideNavBranchIndentGuideProps,
} from "./side-nav-branch-indent-guide"
import {
  SideNavBranchNode,
  type SideNavBranchNodeProps,
} from "./side-nav-branch-node"
import {
  SideNavBranchTrigger,
  type SideNavBranchTriggerProps,
} from "./side-nav-branch-trigger"
import {
  SideNavCollapseTrigger,
  type SideNavCollapseTriggerProps,
} from "./side-nav-collapse-trigger"
import {SideNavDivider, type SideNavDividerProps} from "./side-nav-divider"
import {
  SideNavFilterInput,
  type SideNavFilterInputProps,
} from "./side-nav-filter-input"
import {SideNavGroup, type SideNavGroupProps} from "./side-nav-group"
import {
  SideNavGroupLabel,
  type SideNavGroupLabelProps,
} from "./side-nav-group-label"
import {SideNavHeader, type SideNavHeaderProps} from "./side-nav-header"
import {
  SideNavHeaderAction,
  type SideNavHeaderActionProps,
} from "./side-nav-header-action"
import {
  SideNavHeaderLogo,
  type SideNavHeaderLogoProps,
} from "./side-nav-header-logo"
import {
  SideNavHeaderTitle,
  type SideNavHeaderTitleProps,
} from "./side-nav-header-title"
import {SideNavLeafNode, type SideNavLeafNodeProps} from "./side-nav-leaf-node"
import {
  SideNavNodeAccessory,
  type SideNavNodeAccessoryProps,
} from "./side-nav-node-accessory"
import {
  SideNavNodeAction,
  type SideNavNodeActionProps,
} from "./side-nav-node-action"
import {SideNavNodeIcon, type SideNavNodeIconProps} from "./side-nav-node-icon"
import {
  SideNavNodeIndicator,
  type SideNavNodeIndicatorProps,
} from "./side-nav-node-indicator"
import {
  SideNavNodeProvider,
  type SideNavNodeProviderProps,
} from "./side-nav-node-provider"
import {SideNavNodeText, type SideNavNodeTextProps} from "./side-nav-node-text"
import {SideNavNodes, type SideNavNodesProps} from "./side-nav-nodes"
import {SideNavRoot, type SideNavRootProps} from "./side-nav-root"

export * from "./qds-side-nav-context"

export type {
  SideNavBranchContentProps,
  SideNavBranchIndentGuideProps,
  SideNavBranchNodeProps,
  SideNavBranchTriggerProps,
  SideNavBranchProps,
  SideNavCollapseTriggerProps,
  SideNavDividerProps,
  SideNavFilterInputProps,
  SideNavGroupLabelProps,
  SideNavGroupProps,
  SideNavHeaderActionProps,
  SideNavHeaderLogoProps,
  SideNavHeaderTitleProps,
  SideNavHeaderProps,
  SideNavLeafNodeProps,
  SideNavNodeAccessoryProps,
  SideNavNodeActionProps,
  SideNavNodeIconProps,
  SideNavNodeIndicatorProps,
  SideNavNodeProviderProps,
  SideNavNodeTextProps,
  SideNavNodesProps,
  SideNavRootProps,
}

type SideNavComponent = {
  Branch: typeof SideNavBranch
  /**
   * Container element for the branch node's children. Renders a `<div>` element by
   * default.
   */
  BranchContent: typeof SideNavBranchContent
  /**
   * Provides a visual guide to the indentation level of the branch's children.
   * Renders a `<div>` element by default.
   */
  BranchIndentGuide: typeof SideNavBranchIndentGuide
  /**
   * An interactive tree node with children. Renders a `<div>` element by default.
   */
  BranchNode: typeof SideNavBranchNode
  /**
   * Icon that indicates whether a branch is expanded or collapsed. Renders a `<div>`
   * element by default.
   */
  BranchTrigger: typeof SideNavBranchTrigger
  CollapseTrigger: typeof SideNavCollapseTrigger
  Divider: typeof SideNavDivider
  FilterInput: typeof SideNavFilterInput
  Group: typeof SideNavGroup
  GroupLabel: typeof SideNavGroupLabel
  Header: typeof SideNavHeader
  HeaderAction: typeof SideNavHeaderAction
  HeaderLogo: typeof SideNavHeaderLogo
  HeaderTitle: typeof SideNavHeaderTitle
  /**
   * A childless tree node. Renders a `<div>` element by default.
   */
  LeafNode: typeof SideNavLeafNode
  NodeAccessory: typeof SideNavNodeAccessory
  /**
   * An action button within a tree node's interactive area. Renders a `<button>`
   * element by default.
   */
  NodeAction: typeof SideNavNodeAction
  /**
   * The icon for the tree node. Renders a `<span>` element by default.
   */
  NodeIcon: typeof SideNavNodeIcon
  /**
   * Indicates whether the tree node is selected. Renders a `<div>` element by
   * default.
   */
  NodeIndicator: typeof SideNavNodeIndicator
  NodeProvider: typeof SideNavNodeProvider
  /**
   * A helper component that renders recursive tree nodes. Doesn't render its own
   * HTML element.
   */
  Nodes: typeof SideNavNodes
  /**
   * The primary title of the tree node. Renders a `<span>` element by default.
   */
  NodeText: typeof SideNavNodeText
  Root: typeof SideNavRoot
}

export const SideNav: SideNavComponent = {
  Branch: SideNavBranch,
  BranchContent: SideNavBranchContent,
  BranchIndentGuide: SideNavBranchIndentGuide,
  BranchNode: SideNavBranchNode,
  BranchTrigger: SideNavBranchTrigger,
  CollapseTrigger: SideNavCollapseTrigger,
  Divider: SideNavDivider,
  FilterInput: SideNavFilterInput,
  Group: SideNavGroup,
  GroupLabel: SideNavGroupLabel,
  Header: SideNavHeader,
  HeaderAction: SideNavHeaderAction,
  HeaderLogo: SideNavHeaderLogo,
  HeaderTitle: SideNavHeaderTitle,
  LeafNode: SideNavLeafNode,
  NodeAccessory: SideNavNodeAccessory,
  NodeAction: SideNavNodeAction,
  NodeIcon: SideNavNodeIcon,
  NodeIndicator: SideNavNodeIndicator,
  NodeProvider: SideNavNodeProvider,
  Nodes: SideNavNodes,
  NodeText: SideNavNodeText,
  Root: SideNavRoot,
}
