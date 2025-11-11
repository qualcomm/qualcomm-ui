// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {TypeaheadState} from "@qualcomm-ui/dom/query"
import type {BooleanAriaAttr, BooleanDataAttr} from "@qualcomm-ui/utils/attributes"
import type {
  IndexPath,
  TreeCollection,
  TreeNode,
  ValuePath,
} from "@qualcomm-ui/utils/collection"
import type {DirectionProperty} from "@qualcomm-ui/utils/direction"
import type {RequiredBy} from "@qualcomm-ui/utils/guard"
import type {
  ActionSchema,
  BindableIds,
  CommonProperties,
  GuardSchema,
  IdRegistrationProps,
  JSX,
  MachineSchema,
  Scope,
} from "@qualcomm-ui/utils/machine"

export interface FocusChangeDetails<T extends TreeNode = TreeNode> {
  /**
   * The focused node
   */
  focusedNode: T | null

  /**
   * The id of the focused node
   */
  focusedValue: string | null
}

export interface ExpandedChangeDetails<T extends TreeNode = TreeNode> {
  /**
   * The expanded nodes
   */
  expandedNodes: T[]

  /**
   * The ids of the expanded nodes
   */
  expandedValue: string[]

  /**
   * The id of the focused node
   */
  focusedValue: string | null
}

export interface SelectionChangeDetails<T = TreeNode> {
  /**
   * The id of the current focused value
   */
  focusedValue: string | null

  /**
   * The selected nodes
   */
  selectedNodes: T[]

  /**
   * The ids of the selected nodes
   */
  selectedValue: string[]
}

export interface CheckedChangeDetails<T extends TreeNode = TreeNode> {
  /**
   * The checked nodes
   */
  checkedNodes: T[]

  /**
   * The ids of the checked nodes
   */
  checkedValue: string[]
}

export interface LoadChildrenDetails<T extends TreeNode = TreeNode> {
  /**
   * The index path of the node whose children are being loaded
   */
  indexPath: IndexPath

  /**
   * The node whose children are being loaded
   */
  node: T

  /**
   * AbortSignal to cancel the loading operation
   */
  signal: AbortSignal

  /**
   * The value path of the node whose children are being loaded
   */
  valuePath: ValuePath
}

export interface LoadChildrenCompleteDetails<T extends TreeNode = TreeNode> {
  /**
   * The updated tree collection with the loaded children
   *
   * @inheritDoc
   */
  collection: TreeCollection<T>
}

export interface NodeWithError<T extends TreeNode = TreeNode> {
  error: Error
  indexPath: IndexPath
  node: T
  valuePath: ValuePath
}

export interface LoadChildrenErrorDetails<T extends TreeNode = TreeNode> {
  /**
   * Array of nodes that failed to load children
   * @inheritDoc
   */
  nodes: NodeWithError<T>[]
}

export interface TreeApiProps<T> extends DirectionProperty, CommonProperties {
  /**
   * The controlled checked node value
   */
  checkedValue?: string[] | undefined

  /**
   * The tree collection data
   * @inheritDoc
   */
  collection?: TreeCollection<T>

  /**
   * The initial checked node value when rendered.
   * Use when you don't need to control the checked node value.
   */
  defaultCheckedValue?: string[] | undefined

  /**
   * The initial expanded node ids when rendered.
   * Use when you don't need to control the expanded node value.
   */
  defaultExpandedValue?: string[] | undefined

  /**
   * The initial focused node value when rendered.
   * Use when you don't need to control the focused node value.
   */
  defaultFocusedValue?: string | null | undefined

  /**
   * The initial selected node value when rendered.
   * Use when you don't need to control the selected node value.
   */
  defaultSelectedValue?: string[] | undefined

  /**
   * The controlled expanded node ids
   */
  expandedValue?: string[] | undefined

  /**
   * Whether clicking on a branch should open it or not
   * @default true
   */
  expandOnClick?: boolean | undefined

  /**
   * The value of the focused node
   */
  focusedValue?: string | null | undefined

  /**
   * Function to load children for a node asynchronously.
   * When provided, branches will wait for this promise to resolve before expanding.
   */
  loadChildren?: ((details: LoadChildrenDetails<T>) => Promise<T[]>) | undefined

  /**
   * Called when the checked value changes
   */
  onCheckedValueChange?:
    | ((details: CheckedChangeDetails<T>) => void)
    | undefined

  /**
   * Called when the tree is opened or closed
   */
  onExpandedValueChange?:
    | ((details: ExpandedChangeDetails<T>) => void)
    | undefined

  /**
   * Called when the focused node changes
   */
  onFocusChange?: ((details: FocusChangeDetails<T>) => void) | undefined

  /**
   * Called when a node finishes loading children
   */
  onLoadChildrenComplete?:
    | ((details: LoadChildrenCompleteDetails<T>) => void)
    | undefined

  /**
   * Called when loading children fails for one or more nodes
   */
  onLoadChildrenError?:
    | ((details: LoadChildrenErrorDetails<T>) => void)
    | undefined

  /**
   * Called when the selection changes
   */
  onSelectedValueChange?:
    | ((details: SelectionChangeDetails<T>) => void)
    | undefined

  /**
   * The controlled selected node value
   */
  selectedValue?: string[] | undefined

  /**
   * Whether the tree supports multiple selection
   * @option `'single'`: only one node can be selected
   * @option `'multiple'`: multiple nodes can be selected
   *
   * @default 'single'
   */
  selectionMode?: "single" | "multiple" | undefined

  /**
   * Callback function that determines whether a node should be hidden.
   *
   * @inheritDoc
   */
  shouldHideNode?: (state: NodeState<T>) => boolean | undefined

  /**
   * Whether the tree supports typeahead search
   * @default true
   */
  typeahead?: boolean | undefined
}

type PropsWithDefault =
  | "collection"
  | "defaultExpandedValue"
  | "defaultSelectedValue"
  | "expandOnClick"
  | "selectionMode"
  | "typeahead"

export type TreeLoadingStatus = "loading" | "loaded"

export type TreeLoadingStatusMap = Record<string, TreeLoadingStatus>

export interface TreeElementIds {
  label: string
  root: string
}

export interface TreeScope extends Scope {
  ids: BindableIds<TreeSchema>
}

export interface TreeSchema<T extends TreeNode = TreeNode>
  extends MachineSchema {
  actions: ActionSchema<
    | "clearChecked"
    | "clearExpanded"
    | "clearFocusedNode"
    | "clearPendingAborts"
    | "clearSelected"
    | "clearSelectedItem"
    | "collapseBranch"
    | "collapseBranches"
    | "deselectNode"
    | "expandAllBranches"
    | "expandBranch"
    | "expandBranches"
    | "expandSiblingBranches"
    | "extendSelectionToFirstNode"
    | "extendSelectionToLastNode"
    | "extendSelectionToNextNode"
    | "extendSelectionToNode"
    | "extendSelectionToPrevNode"
    | "focusBranchFirstNode"
    | "focusBranchNode"
    | "focusMatchedNode"
    | "focusTreeFirstNode"
    | "focusTreeLastNode"
    | "focusTreeNextNode"
    | "focusTreePrevNode"
    | "selectAllNodes"
    | "selectNode"
    | "setChecked"
    | "setExpanded"
    | "setFocusedNode"
    | "setSelected"
    | "toggleBranchNode"
    | "toggleChecked"
    | "toggleNodeSelection"
  >
  computed: {
    isMultipleSelection: boolean
    isTypingAhead: boolean
    visibleNodes: {indexPath: number[]; node: T}[]
  }
  context: {
    checkedValue: string[]
    expandedValue: string[]
    focusedValue: string | null
    loadingStatus: TreeLoadingStatusMap
    selectedValue: string[]
  }
  events:
    | {type: "CHECKED.CLEAR"}
    | {
        isBranch: boolean
        type: "CHECKED.TOGGLE"
        value: string
      }
    | {
        type:
          | "BRANCH.EXPAND"
          | "CHECKED.SET"
          | "EXPANDED.ALL"
          | "EXPANDED.CLEAR"
        value: string[]
      }
    | {
        isTrusted: boolean
        type: "NODE.SELECT"
        value: string[]
      }
    | {
        src: "select.parent"
        type: "SELECTED.SET" | "EXPANDED.SET"
        value: string[]
      }
    | {
        id: string
        shiftKey: boolean
        type: "NODE.ARROW_DOWN" | "NODE.ARROW_UP" | "NODE.HOME" | "NODE.END"
      }
    | {
        id: string
        type:
          | "BRANCH_NODE.ARROW_LEFT"
          | "BRANCH_NODE.ARROW_RIGHT"
          | "BRANCH_TOGGLE.CLICK"
          | "NODE.ARROW_LEFT"
          | "NODE.FOCUS"
          | "SIBLINGS.EXPAND"
      }
    | {
        id?: string
        key: string
        type: "TREE.TYPEAHEAD"
      }
    | {
        ctrlKey?: boolean
        id: string
        src?: string
        type: "BRANCH_NODE.CLICK" | "NODE.CLICK"
      }
    | {
        isTrusted?: boolean
        moveFocus?: boolean
        type: "SELECTED.ALL"
        value?: string[]
      }
    // TODO: remove any and validate after tests are built
    | any
  guards: GuardSchema<
    | "expandOnClick"
    | "hasSelectedItems"
    | "isBranchExpanded"
    | "isBranchFocused"
    | "isCtrlKey"
    | "isMultipleSelection"
    | "isShiftKey"
    | "moveFocus"
  >
  ids: TreeElementIds
  props: RequiredBy<TreeApiProps<T>, PropsWithDefault>
  refs: {
    pendingAborts: Map<string, AbortController>
    typeaheadState: TypeaheadState
  }
  state: "idle"
}

export interface TreeCommonBindings extends DirectionProperty {
  "data-scope": "tree"
}

export interface TreeRootBindings extends TreeCommonBindings {
  "aria-label": string
  "aria-labelledby": string | undefined
  "aria-multiselectable": boolean | undefined
  "data-part": "root"
  id: string
  onKeyDown: JSX.KeyboardEventHandler<HTMLElement>
  role: "tree"
  tabIndex: -1
}

export interface TreeBranchContentBindings extends TreeCommonBindings {
  "data-depth": number
  "data-part": "branch-content"
  "data-path": string
  "data-value": string
  role: "group"
}

export interface TreeBranchIndentGuideBindings extends TreeCommonBindings {
  "data-depth": number
  "data-part": "branch-indent-guide"
  style: JSX.CSSProperties
}

export interface TreeNodeCheckboxBindings extends TreeCommonBindings {
  "aria-checked": BooleanAriaAttr | "mixed"
  "aria-labelledby": string | undefined
  "data-disabled": BooleanDataAttr
  "data-part": "node-checkbox"
  "data-state": "checked" | "unchecked" | "indeterminate"
  onClick: JSX.MouseEventHandler
  role: "checkbox"
  tabIndex: -1
}

export interface TreeLabelBindings extends TreeCommonBindings {
  "data-part": "label"
  id: string
}

export interface TreeLeafNodeBindings extends TreeCommonBindings {
  "aria-current": "true" | undefined
  "aria-disabled": BooleanAriaAttr
  "aria-level": number
  "aria-selected": boolean | undefined
  "data-depth": number
  "data-disabled": BooleanDataAttr
  "data-focus": BooleanDataAttr
  "data-ownedby": string
  "data-part": "leaf-node"
  "data-path": string
  "data-selected": BooleanDataAttr
  "data-value": string
  hidden: boolean | undefined
  id: string
  onClick: JSX.MouseEventHandler<HTMLElement>
  onFocus: JSX.FocusEventHandler<HTMLElement>
  role: "treeitem"
  style: JSX.CSSProperties
  tabIndex: 0 | -1
}

export interface TreeNodeActionBindings extends TreeCommonBindings {
  "data-disabled": BooleanDataAttr
  "data-focus": BooleanDataAttr
  "data-part": "node-action"
  "data-selected": BooleanDataAttr
  onClick: JSX.MouseEventHandler
}

export interface TreeNodeTextBindings extends TreeCommonBindings {
  "data-disabled": BooleanDataAttr
  "data-focus": BooleanDataAttr
  "data-part": "node-text"
  "data-selected": BooleanDataAttr
  id: string
}

export interface TreeNodeIconBindings extends TreeCommonBindings {
  "data-disabled": BooleanDataAttr
  "data-focus": BooleanDataAttr
  "data-part": "node-icon"
  "data-selected": BooleanDataAttr
}

export interface TreeNodeIndicatorBindings extends TreeCommonBindings {
  "aria-hidden": true
  "data-disabled": BooleanDataAttr
  "data-focus": BooleanDataAttr
  "data-part": "node-indicator"
  "data-selected": BooleanDataAttr
  hidden: boolean
}

export interface TreeBranchBindings extends TreeCommonBindings {
  "aria-disabled": BooleanAriaAttr
  "aria-expanded": BooleanAriaAttr
  "aria-level": number
  "aria-selected": boolean | undefined
  "data-branch": string
  "data-depth": number
  "data-disabled": BooleanDataAttr
  "data-loading": BooleanDataAttr
  "data-ownedby": string
  "data-part": "branch"
  "data-path": string
  "data-selected": BooleanDataAttr
  "data-state": "open" | "closed"
  "data-value": string
  hidden: boolean | undefined
  role: "treeitem"
  style: JSX.CSSProperties
}

export interface TreeBranchIndicatorBindings extends TreeCommonBindings {
  "aria-hidden": true
  "data-disabled": BooleanDataAttr
  "data-focus": BooleanDataAttr
  "data-loading": BooleanDataAttr
  "data-part": "branch-indicator"
  "data-selected": BooleanDataAttr
  "data-state": "open" | "closed"
}

export interface TreeBranchTriggerBindings extends TreeCommonBindings {
  "data-disabled": BooleanDataAttr
  "data-loading": BooleanDataAttr
  "data-part": "branch-trigger"
  "data-state": "open" | "closed"
  "data-value": string
  disabled: boolean
  onClick: JSX.MouseEventHandler<HTMLElement>
  role: "button"
}

export interface TreeBranchNodeBindings extends TreeCommonBindings {
  "aria-busy": BooleanAriaAttr
  "data-depth": number
  "data-disabled": BooleanDataAttr
  "data-focus": BooleanDataAttr
  "data-loading": BooleanDataAttr
  "data-part": "branch-node"
  "data-path": string
  "data-selected": BooleanDataAttr
  "data-state": "open" | "closed"
  "data-value": string
  id: string
  onClick: JSX.MouseEventHandler<HTMLElement>
  onFocus: JSX.FocusEventHandler<HTMLElement>
  role: "button"
  tabIndex: 0 | -1
}

export interface NodeProps<T = TreeNode> {
  /**
   * The index path of the tree node
   */
  indexPath: number[]

  /**
   * The tree node
   *
   * @inheritDoc
   */
  node: T
}

export type CheckedState = boolean | "indeterminate"

export interface NodeState<T = TreeNode> {
  /**
   * Whether the tree item is checked
   */
  checked: CheckedState

  /**
   * The depth of the tree item
   */
  depth: number

  /**
   * Whether the tree item is disabled
   */
  disabled: boolean

  /**
   * Whether the tree branch is expanded
   */
  expanded: boolean

  /**
   * Whether the tree item is focused
   */
  focused: boolean

  /**
   * The DOM id of the tree item
   */
  id: string

  /**
   * The index path of the tree item
   */
  indexPath: IndexPath

  /**
   * Whether the tree item is a branch
   */
  isBranch: boolean

  /**
   * Whether the tree item is currently loading children
   */
  loading: boolean

  /**
   * The tree node
   */
  node: T

  /**
   * Whether the tree item is selected
   */
  selected: boolean

  /**
   * The DOM id of the tree item's text element
   */
  textId: string

  /**
   * The value of the tree item
   */
  value: string

  /**
   * The value path of the tree item
   */
  valuePath: ValuePath
}

export type CheckedValueMap = Map<
  string,
  {checked: CheckedState; type: "leaf" | "branch"}
>

export interface TreeApi<T extends TreeNode = TreeNode> {
  /**
   * The value of the checked nodes
   */
  checkedValue: string[]

  /**
   * Clears the checked value of a node
   */
  clearChecked: () => void

  /**
   * Function to collapse nodes
   * If no value is provided, all nodes will be collapsed
   */
  collapse: (value?: string[]) => void

  /**
   * The tree collection data
   *
   * @inheritDoc
   */
  collection: TreeCollection<T>

  /**
   * Function to deselect nodes
   * If no value is provided, all nodes will be deselected
   */
  deselect: (value?: string[]) => void

  /**
   * Function to expand nodes.
   * If no value is provided, all nodes will be expanded
   */
  expand: (value?: string[]) => void

  /**
   * The value of the expanded nodes.
   */
  expandedValue: string[]

  /**
   * Function to expand the parent node of the focused node
   */
  expandParent: (value: string) => void

  /**
   * Function to focus a node by value
   */
  focus: (value: string) => void

  /**
   * Returns the checked details of branch and leaf nodes
   */
  getCheckedMap: () => CheckedValueMap

  /**
   * Returns the visible nodes as a flat array of nodes and their index path
   */
  getVisibleNodes: () => T[]

  /**
   * Function to select nodes
   * If no value is provided, all nodes will be selected
   */
  select: (value?: string[]) => void

  /**
   * The value of the selected nodes.
   */
  selectedValue: string[]

  /**
   * Function to select the parent node of the focused node
   */
  selectParent: (value: string) => void

  /**
   * Sets the checked value of a node
   */
  setChecked: (value: string[]) => void

  /**
   * Sets the expanded value
   */
  setExpandedValue: (value: string[]) => void

  /**
   * Sets the selected value
   */
  setSelectedValue: (value: string[]) => void

  /**
   * Toggles the checked value of a node
   */
  toggleChecked: (value: string, isBranch: boolean) => void

  // group: getters
  getBranchBindings: (props: NodeProps) => TreeBranchBindings
  getBranchContentBindings: (props: NodeProps) => TreeBranchContentBindings
  getBranchIndentGuideBindings: (
    props: NodeProps,
  ) => TreeBranchIndentGuideBindings
  getBranchIndicatorBindings: (props: NodeProps) => TreeBranchIndicatorBindings
  getBranchNodeBindings: (props: NodeProps) => TreeBranchNodeBindings
  getBranchTriggerBindings: (props: NodeProps) => TreeBranchTriggerBindings
  getLabelBindings: (props: IdRegistrationProps) => TreeLabelBindings
  getLeafNodeBindings: (props: NodeProps) => TreeLeafNodeBindings
  getNodeActionBindings: (props: NodeProps) => TreeNodeActionBindings
  getNodeCheckboxBindings: (props: NodeProps) => TreeNodeCheckboxBindings
  getNodeIconBindings: (props: NodeProps) => TreeNodeIconBindings
  getNodeIndicatorBindings: (props: NodeProps) => TreeNodeIndicatorBindings
  getNodeState: (props: NodeProps) => NodeState
  getNodeTextBindings: (props: NodeProps) => TreeNodeTextBindings
  getRootBindings: (props: IdRegistrationProps) => TreeRootBindings
}
