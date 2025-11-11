// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  getByTypeahead,
  getEventKey,
  getEventTarget,
  isAnchorElement,
  isComposingEvent,
  isEditableElement,
  isLeftClick,
  isModifierKey,
} from "@qualcomm-ui/dom/query"
import {add, uniq} from "@qualcomm-ui/utils/array"
import {booleanAriaAttr, booleanDataAttr} from "@qualcomm-ui/utils/attributes"
import type {TreeNode} from "@qualcomm-ui/utils/collection"
import {cast} from "@qualcomm-ui/utils/functions"
import type {
  EventKeyMap,
  Machine,
  PropNormalizer,
} from "@qualcomm-ui/utils/machine"

import {
  domIds,
  focusNode,
  getCheckedState,
  getCheckedValueMap,
  getNodeId,
  getNodeTextId,
} from "./internal"
import type {
  NodeProps,
  NodeState,
  TreeApi,
  TreeBranchBindings,
  TreeBranchContentBindings,
  TreeBranchIndentGuideBindings,
  TreeBranchIndicatorBindings,
  TreeBranchNodeBindings,
  TreeBranchTriggerBindings,
  TreeCommonBindings,
  TreeLabelBindings,
  TreeLeafNodeBindings,
  TreeNodeActionBindings,
  TreeNodeCheckboxBindings,
  TreeNodeIconBindings,
  TreeNodeIndicatorBindings,
  TreeNodeTextBindings,
  TreeRootBindings,
  TreeSchema,
} from "./tree.types"

export function createTreeApi<V extends TreeNode = TreeNode>(
  machine: Machine<TreeSchema>,
  normalize: PropNormalizer,
): TreeApi<V> {
  const {computed, context, prop, scope, send} = machine
  const collection = prop("collection")

  const expandedValue = Array.from(context.get("expandedValue"))
  const selectedValue = Array.from(context.get("selectedValue"))
  const checkedValue = Array.from(context.get("checkedValue"))

  const isTypingAhead = computed("isTypingAhead")
  const focusedValue = context.get("focusedValue")
  const loadingStatus = context.get("loadingStatus")

  function getNodeState(props: NodeProps): NodeState {
    const {indexPath, node} = props
    const value = collection.getNodeValue(node)
    const firstNode = collection.getFirstNode()
    const firstNodeValue = firstNode ? collection.getNodeValue(firstNode) : null
    return {
      get checked() {
        return getCheckedState(collection, node, checkedValue)
      },
      depth: indexPath.length,
      disabled: Boolean(node.disabled),
      expanded: expandedValue.includes(value),
      focused:
        focusedValue == null
          ? firstNodeValue === value
          : focusedValue === value,
      id: getNodeId(scope, value),
      indexPath,
      isBranch: collection.isBranchNode(node),
      loading: loadingStatus[value] === "loading",
      node: props.node,
      selected: selectedValue.includes(value),
      textId: getNodeTextId(scope, value),
      value,
      valuePath: collection.getValuePath(indexPath),
    }
  }

  const commonBindings: TreeCommonBindings = {
    "data-scope": "tree",
  }

  return {
    checkedValue,
    clearChecked() {
      send({type: "CHECKED.CLEAR"})
    },
    collapse(value) {
      send({type: value ? "BRANCH.COLLAPSE" : "EXPANDED.CLEAR", value})
    },
    collection,
    deselect(value) {
      send({type: value ? "NODE.DESELECT" : "SELECTED.CLEAR", value})
    },
    expand(value) {
      send({type: value ? "BRANCH.EXPAND" : "EXPANDED.ALL", value})
    },
    expandedValue,
    expandParent(value) {
      const parentNode = collection.getParentNode(value)
      if (!parentNode) {
        return
      }
      const _expandedValue = add(
        expandedValue,
        collection.getNodeValue(parentNode),
      )
      send({src: "expand.parent", type: "EXPANDED.SET", value: _expandedValue})
    },
    focus(value) {
      focusNode(scope, value)
    },
    getCheckedMap() {
      return getCheckedValueMap(collection, checkedValue)
    },

    getVisibleNodes() {
      return computed("visibleNodes").map(({node}) => node)
    },

    select(value) {
      send({
        isTrusted: false,
        type: value ? "NODE.SELECT" : "SELECTED.ALL",
        value,
      })
    },

    selectedValue,

    selectParent(value) {
      const parentNode = collection.getParentNode(value)
      if (!parentNode) {
        return
      }
      const _selectedValue = add(
        selectedValue,
        collection.getNodeValue(parentNode),
      )
      send({src: "select.parent", type: "SELECTED.SET", value: _selectedValue})
    },

    setChecked(value) {
      send({type: "CHECKED.SET", value})
    },

    setExpandedValue(value) {
      const _expandedValue = uniq(value)
      send({type: "EXPANDED.SET", value: _expandedValue})
    },

    setSelectedValue(value) {
      const _selectedValue = uniq(value)
      send({type: "SELECTED.SET", value: _selectedValue})
    },
    toggleChecked(value, isBranch) {
      send({isBranch, type: "CHECKED.TOGGLE", value})
    },

    // group: bindings
    getBranchBindings(props): TreeBranchBindings {
      const nodeState = getNodeState(props)
      return normalize.element({
        ...commonBindings,
        "aria-busy": booleanAriaAttr(nodeState.loading, undefined),
        "aria-disabled": booleanAriaAttr(nodeState.disabled),
        "aria-expanded": booleanAriaAttr(nodeState.expanded),
        "aria-level": nodeState.depth,
        "aria-selected": nodeState.disabled ? undefined : nodeState.selected,
        "data-branch": nodeState.value,
        "data-depth": nodeState.depth,
        "data-disabled": booleanDataAttr(nodeState.disabled),
        "data-loading": booleanDataAttr(nodeState.loading),
        "data-ownedby": domIds.root(scope),
        "data-part": "branch",
        "data-path": props.indexPath.join("/"),
        "data-selected": booleanDataAttr(nodeState.selected),
        "data-state": nodeState.expanded ? "open" : "closed",
        "data-value": nodeState.value,
        dir: prop("dir"),
        hidden: prop("shouldHideNode")?.(nodeState),
        role: "treeitem",
        style: {
          "--depth": nodeState.depth,
        },
      })
    },
    getBranchContentBindings(props): TreeBranchContentBindings {
      const nodeState = getNodeState(props)
      return normalize.element({
        ...commonBindings,
        "data-depth": nodeState.depth,
        "data-part": "branch-content",
        "data-path": props.indexPath.join("/"),
        "data-value": nodeState.value,
        dir: prop("dir"),
        role: "group",
      })
    },
    getBranchIndentGuideBindings(props): TreeBranchIndentGuideBindings {
      const nodeState = getNodeState(props)
      return normalize.element({
        ...commonBindings,
        "data-depth": nodeState.depth,
        "data-part": "branch-indent-guide",
        style: {
          "--depth": nodeState.depth,
        },
      })
    },
    getBranchIndicatorBindings(props): TreeBranchIndicatorBindings {
      const nodeState = getNodeState(props)
      return normalize.element({
        ...commonBindings,
        "aria-hidden": true,
        "data-disabled": booleanDataAttr(nodeState.disabled),
        "data-focus": booleanDataAttr(nodeState.focused),
        "data-loading": booleanDataAttr(nodeState.loading),
        "data-part": "branch-indicator",
        "data-selected": booleanDataAttr(nodeState.selected),
        "data-state": nodeState.expanded ? "open" : "closed",
      })
    },
    getBranchNodeBindings(props): TreeBranchNodeBindings {
      const nodeState = getNodeState(props)
      return normalize.element({
        ...commonBindings,
        "aria-busy": booleanAriaAttr(nodeState.loading, undefined),
        "data-depth": nodeState.depth,
        "data-disabled": booleanDataAttr(nodeState.disabled),
        "data-focus": booleanDataAttr(nodeState.focused),
        "data-loading": booleanDataAttr(nodeState.loading),
        "data-part": "branch-node",
        "data-path": props.indexPath.join("/"),
        "data-selected": booleanDataAttr(nodeState.selected),
        "data-state": nodeState.expanded ? "open" : "closed",
        "data-value": nodeState.value,
        dir: prop("dir"),
        id: nodeState.id,
        onClick(event) {
          if (nodeState.disabled || nodeState.loading || !isLeftClick(event)) {
            return
          }
          if (isAnchorElement(event.currentTarget) && isModifierKey(event)) {
            return
          }

          const isMetaKey = event.metaKey || event.ctrlKey
          send({
            ctrlKey: isMetaKey,
            id: nodeState.value,
            shiftKey: event.shiftKey,
            type: "BRANCH_NODE.CLICK",
          })
          event.stopPropagation()
        },
        onFocus(event) {
          send({id: nodeState.value, type: "NODE.FOCUS"})
          event.stopPropagation()
        },
        role: "button",
        tabIndex: nodeState.focused ? 0 : -1,
      })
    },
    getBranchTriggerBindings(props): TreeBranchTriggerBindings {
      const nodeState = getNodeState(props)
      return normalize.element({
        ...commonBindings,
        "data-disabled": booleanDataAttr(nodeState.disabled),
        "data-loading": booleanDataAttr(nodeState.loading),
        "data-part": "branch-trigger",
        "data-state": nodeState.expanded ? "open" : "closed",
        "data-value": nodeState.value,
        dir: prop("dir"),
        disabled: nodeState.loading,
        onClick(event) {
          if (nodeState.disabled || nodeState.loading) {
            return
          }
          send({id: nodeState.value, type: "BRANCH_TOGGLE.CLICK"})
          event.stopPropagation()
        },
        role: "button",
      })
    },
    getLabelBindings(props): TreeLabelBindings {
      scope.ids.register("label", props)
      return normalize.element({
        ...commonBindings,
        "data-part": "label",
        dir: prop("dir"),
        id: props.id,
      })
    },
    getLeafNodeBindings(props): TreeLeafNodeBindings {
      const nodeState = getNodeState(props)
      return normalize.element({
        ...commonBindings,
        "aria-current": nodeState.selected ? "true" : undefined,
        "aria-disabled": booleanAriaAttr(nodeState.disabled),
        "aria-level": nodeState.depth,
        "aria-selected": nodeState.disabled ? undefined : nodeState.selected,
        "data-depth": nodeState.depth,
        "data-disabled": booleanDataAttr(nodeState.disabled),
        "data-focus": booleanDataAttr(nodeState.focused),
        "data-ownedby": domIds.root(scope),
        "data-part": "leaf-node",
        "data-path": props.indexPath.join("/"),
        "data-selected": booleanDataAttr(nodeState.selected),
        "data-value": nodeState.value,
        dir: prop("dir"),
        hidden: prop("shouldHideNode")?.(nodeState),
        id: nodeState.id,
        onClick(event) {
          if (nodeState.disabled) {
            return
          }
          if (!isLeftClick(event)) {
            return
          }
          if (isAnchorElement(event.currentTarget) && isModifierKey(event)) {
            return
          }

          const isMetaKey = event.metaKey || event.ctrlKey
          send({
            ctrlKey: isMetaKey,
            id: nodeState.value,
            shiftKey: event.shiftKey,
            type: "NODE.CLICK",
          })
          event.stopPropagation()

          if (!isAnchorElement(event.currentTarget)) {
            event.preventDefault()
          }
        },
        onFocus(event) {
          event.stopPropagation()
          send({id: nodeState.value, type: "NODE.FOCUS"})
        },
        role: "treeitem",
        style: {
          "--depth": nodeState.depth,
        },
        tabIndex: nodeState.focused ? 0 : -1,
      })
    },

    getNodeActionBindings(nodeProps: NodeProps): TreeNodeActionBindings {
      const nodeState = getNodeState(nodeProps)
      return normalize.button({
        ...commonBindings,
        "data-disabled": booleanDataAttr(nodeState.disabled),
        "data-focus": booleanDataAttr(nodeState.focused),
        "data-part": "node-action",
        "data-selected": booleanDataAttr(nodeState.selected),
        onClick: (event) => {
          event.stopPropagation()
        },
      })
    },

    getNodeCheckboxBindings(props): TreeNodeCheckboxBindings {
      const nodeState = getNodeState(props)
      const checkedState = nodeState.checked
      return normalize.element({
        ...commonBindings,
        "aria-checked":
          checkedState === true
            ? "true"
            : checkedState === false
              ? "false"
              : "mixed",
        "aria-labelledby": nodeState.textId,
        "data-disabled": booleanDataAttr(nodeState.disabled),
        "data-part": "node-checkbox",
        "data-state":
          checkedState === true
            ? "checked"
            : checkedState === false
              ? "unchecked"
              : "indeterminate",
        onClick(event) {
          if (event.defaultPrevented) {
            return
          }
          if (nodeState.disabled) {
            return
          }
          if (!isLeftClick(event)) {
            return
          }

          send({
            isBranch: nodeState.isBranch,
            type: "CHECKED.TOGGLE",
            value: nodeState.value,
          })
          event.stopPropagation()

          const node = event.currentTarget.closest("[role=treeitem]")
          cast<HTMLButtonElement>(node)?.focus({preventScroll: true})
        },
        role: "checkbox",
        tabIndex: -1,
      })
    },

    getNodeIconBindings(props): TreeNodeIconBindings {
      const itemState = getNodeState(props)
      return normalize.element({
        ...commonBindings,
        "data-disabled": booleanDataAttr(itemState.disabled),
        "data-focus": booleanDataAttr(itemState.focused),
        "data-part": "node-icon",
        "data-selected": booleanDataAttr(itemState.selected),
      })
    },

    getNodeIndicatorBindings(props): TreeNodeIndicatorBindings {
      const itemState = getNodeState(props)
      return normalize.element({
        ...commonBindings,
        "aria-hidden": true,
        "data-disabled": booleanDataAttr(itemState.disabled),
        "data-focus": booleanDataAttr(itemState.focused),
        "data-part": "node-indicator",
        "data-selected": booleanDataAttr(itemState.selected),
        hidden: !itemState.selected,
      })
    },

    getNodeState,

    getNodeTextBindings(props): TreeNodeTextBindings {
      const itemState = getNodeState(props)
      return normalize.element({
        ...commonBindings,
        "data-disabled": booleanDataAttr(itemState.disabled),
        "data-focus": booleanDataAttr(itemState.focused),
        "data-part": "node-text",
        "data-selected": booleanDataAttr(itemState.selected),
        id: itemState.textId,
      })
    },

    getRootBindings(props): TreeRootBindings {
      scope.ids.register("root", props)
      return normalize.element({
        ...commonBindings,
        "aria-label": "Tree View",
        "aria-labelledby": domIds.label(scope),
        "aria-multiselectable":
          prop("selectionMode") === "multiple" || undefined,
        "data-part": "root",
        dir: prop("dir"),
        id: props.id,
        onKeyDown(event) {
          if (event.defaultPrevented) {
            return
          }
          if (isComposingEvent(event)) {
            return
          }

          const target = getEventTarget<HTMLElement>(event)
          // allow typing in input elements within the tree
          if (isEditableElement(target)) {
            return
          }

          const node = target?.closest<HTMLElement>(
            "[data-part=branch-node], [data-part=leaf-node]",
          )
          if (!node) {
            return
          }

          const nodeId = node.dataset.value

          if (nodeId == null) {
            console.warn(
              `[@qualcomm-ui/core/tree] Node id not found for node`,
              node,
            )
            return
          }

          const isBranchNode = node.matches("[data-part=branch-node]")

          const keyMap: EventKeyMap = {
            "*"(event) {
              if (node.dataset.disabled) {
                return
              }
              event.preventDefault()
              send({id: nodeId, type: "SIBLINGS.EXPAND"})
            },
            a(event) {
              if (!event.metaKey || node.dataset.disabled) {
                return
              }
              event.preventDefault()
              send({moveFocus: true, type: "SELECTED.ALL"})
            },
            ArrowDown(event) {
              if (isModifierKey(event)) {
                return
              }
              event.preventDefault()
              send({
                id: nodeId,
                shiftKey: event.shiftKey,
                type: "NODE.ARROW_DOWN",
              })
            },
            ArrowLeft(event) {
              if (isModifierKey(event) || node.dataset.disabled) {
                return
              }
              event.preventDefault()
              send({
                id: nodeId,
                type: isBranchNode
                  ? "BRANCH_NODE.ARROW_LEFT"
                  : "NODE.ARROW_LEFT",
              })
            },
            ArrowRight(event) {
              if (!isBranchNode || node.dataset.disabled) {
                return
              }
              event.preventDefault()
              send({id: nodeId, type: "BRANCH_NODE.ARROW_RIGHT"})
            },
            ArrowUp(event) {
              if (isModifierKey(event)) {
                return
              }
              event.preventDefault()
              send({
                id: nodeId,
                shiftKey: event.shiftKey,
                type: "NODE.ARROW_UP",
              })
            },
            End(event) {
              if (isModifierKey(event)) {
                return
              }
              event.preventDefault()
              send({id: nodeId, shiftKey: event.shiftKey, type: "NODE.END"})
            },
            Enter(event) {
              if (node.dataset.disabled) {
                return
              }
              if (isAnchorElement(target) && isModifierKey(event)) {
                return
              }

              send({
                id: nodeId,
                src: "keyboard",
                type: isBranchNode ? "BRANCH_NODE.CLICK" : "NODE.CLICK",
              })

              if (!isAnchorElement(target)) {
                event.preventDefault()
              }
            },
            Home(event) {
              if (isModifierKey(event)) {
                return
              }
              event.preventDefault()
              send({id: nodeId, shiftKey: event.shiftKey, type: "NODE.HOME"})
            },
            Space(event) {
              if (node.dataset.disabled) {
                return
              }

              if (isTypingAhead) {
                send({key: event.key, type: "TREE.TYPEAHEAD"})
              } else {
                keyMap.Enter?.(event)
              }
            },
          }

          const key = getEventKey(event, {dir: prop("dir")})
          const exec = keyMap[key]

          if (exec) {
            exec(event)
            return
          }

          if (!getByTypeahead.isValidEvent(event)) {
            return
          }

          send({id: nodeId, key: event.key, type: "TREE.TYPEAHEAD"})
          event.preventDefault()
        },
        role: "tree",
        tabIndex: -1,
      })
    },
  }
}
