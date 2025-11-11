// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {getByTypeahead} from "@qualcomm-ui/dom/query"
import {
  addOrRemove,
  diff,
  first,
  last,
  remove,
  toArray,
  uniq,
} from "@qualcomm-ui/utils/array"
import {TreeCollection, type TreeNode} from "@qualcomm-ui/utils/collection"
import {isEqual} from "@qualcomm-ui/utils/equal"
import {isArray} from "@qualcomm-ui/utils/guard"
import {
  createGuards,
  createMachine,
  type MachineConfig,
} from "@qualcomm-ui/utils/machine"

import {
  expandBranches,
  focusNode,
  skipFn,
  toggleBranchChecked,
} from "./internal"
import type {TreeLoadingStatusMap, TreeSchema} from "./tree.types"

const {and} = createGuards<TreeSchema>()

export const treeMachine: MachineConfig<TreeSchema> = createMachine<TreeSchema>(
  {
    actions: {
      clearChecked({context}) {
        context.set("checkedValue", [])
      },
      clearExpanded({context}) {
        context.set("expandedValue", [])
      },
      clearFocusedNode({context}) {
        context.set("focusedValue", null)
      },
      clearPendingAborts({refs}) {
        const aborts = refs.get("pendingAborts")
        aborts.forEach((abort) => abort.abort())
        aborts.clear()
      },
      clearSelected({context}) {
        context.set("selectedValue", [])
      },
      clearSelectedItem({context}) {
        context.set("selectedValue", [])
      },
      collapseBranch({context, event}) {
        context.set("expandedValue", (prev) => remove(prev, event.id))
      },
      collapseBranches({context, event}) {
        const value = toArray(event.value)
        context.set("expandedValue", (prev) => remove(prev, ...value))
      },
      deselectNode({context, event}) {
        const value = toArray(event.id || event.value)
        context.set("selectedValue", (prev) => remove(prev, ...value))
      },
      expandAllBranches(params) {
        const {context, prop} = params
        const branchValues = prop("collection").getBranchValues()
        const valuesToExpand = diff(branchValues, context.get("expandedValue"))
        expandBranches(params, valuesToExpand)
      },
      expandBranch(params) {
        const {event} = params
        expandBranches(params, [event.id])
      },
      expandBranches(params) {
        const {context, event} = params
        const valuesToExpand = toArray(event.value)
        expandBranches(
          params,
          diff(valuesToExpand, context.get("expandedValue")),
        )
      },
      expandSiblingBranches(params) {
        const {context, event, prop} = params
        const collection = prop("collection")

        const indexPath = collection.getIndexPath(event.id)
        if (!indexPath) {
          return
        }

        const nodes = collection.getSiblingNodes(indexPath)
        const values = nodes.map((node) => collection.getNodeValue(node))

        const valuesToExpand = diff(values, context.get("expandedValue"))
        expandBranches(params, valuesToExpand)
      },
      extendSelectionToFirstNode(params) {
        const {context, prop} = params
        const collection = prop("collection")
        const currentSelection = first(context.get("selectedValue"))
        const values: string[] = []

        collection.visit({
          onEnter: (node) => {
            const nodeValue = collection.getNodeValue(node)
            values.push(nodeValue)
            if (nodeValue === currentSelection) {
              return "stop"
            }
          },
          skip: skipFn(params),
        })

        context.set("selectedValue", values)
      },
      extendSelectionToLastNode(params) {
        const {context, prop} = params
        const collection = prop("collection")
        const currentSelection = first(context.get("selectedValue"))
        const values: string[] = []
        let current = false

        collection.visit({
          onEnter: (node) => {
            const nodeValue = collection.getNodeValue(node)
            if (nodeValue === currentSelection) {
              current = true
            }
            if (current) {
              values.push(nodeValue)
            }
          },
          skip: skipFn(params),
        })

        context.set("selectedValue", values)
      },
      extendSelectionToNextNode(params) {
        const {context, event, prop} = params
        const collection = prop("collection")
        const nextNode = collection.getNextNode(event.id, {
          skip: skipFn(params),
        })
        if (!nextNode) {
          return
        }

        // extend selection to nextNode (preserve the anchor node)
        const values = new Set(context.get("selectedValue"))
        const nextValue = collection.getNodeValue(nextNode)

        if (nextValue == null) {
          return
        }

        if (values.has(event.id) && values.has(nextValue)) {
          values.delete(event.id)
        } else if (!values.has(nextValue)) {
          values.add(nextValue)
        }

        context.set("selectedValue", Array.from(values))
      },
      extendSelectionToNode(params) {
        const {computed, context, event, prop} = params
        const collection = prop("collection")
        const anchorValue =
          first(context.get("selectedValue")) ||
          collection.getNodeValue(collection.getFirstNode())
        const targetValue = event.id

        const values: string[] = [anchorValue, targetValue]

        let hits = 0
        const visibleNodes = computed("visibleNodes")
        visibleNodes.forEach(({node}) => {
          const nodeValue = collection.getNodeValue(node)
          if (hits === 1) {
            values.push(nodeValue)
          }
          if (nodeValue === anchorValue || nodeValue === targetValue) {
            hits++
          }
        })
        context.set("selectedValue", uniq(values))
      },
      extendSelectionToPrevNode(params) {
        const {context, event, prop} = params
        const collection = prop("collection")
        const prevNode = collection.getPreviousNode(event.id, {
          skip: skipFn(params),
        })
        if (!prevNode) {
          return
        }

        // extend selection to prevNode (preserve the anchor node)
        const values = new Set(context.get("selectedValue"))
        const prevValue = collection.getNodeValue(prevNode)

        if (prevValue == null) {
          return
        }

        if (values.has(event.id) && values.has(prevValue)) {
          values.delete(event.id)
        } else if (!values.has(prevValue)) {
          values.add(prevValue)
        }

        context.set("selectedValue", Array.from(values))
      },
      focusBranchFirstNode({event, prop, scope}) {
        const collection = prop("collection")
        const branchNode = collection.findNode(event.id)
        const firstNode = collection.getFirstNode(branchNode)
        const firstValue = collection.getNodeValue(firstNode)
        focusNode(scope, firstValue)
      },
      focusBranchNode({event, prop, scope}) {
        const collection = prop("collection")
        const parentNode = collection.getParentNode(event.id)
        const parentValue = parentNode
          ? collection.getNodeValue(parentNode)
          : undefined
        focusNode(scope, parentValue)
      },
      focusMatchedNode(params) {
        const {computed, context, event, prop, refs, scope} = params
        const nodes = computed("visibleNodes")
        const elements = nodes.map(({node}) => ({
          id: prop("collection").getNodeValue(node),
          textContent: prop("collection").stringifyNode(node),
        }))
        const node = getByTypeahead(elements, {
          activeId: context.get("focusedValue"),
          key: event.key,
          state: refs.get("typeaheadState"),
        })

        focusNode(scope, node?.id)
      },
      focusTreeFirstNode({prop, scope}) {
        const collection = prop("collection")
        const firstNode = collection.getFirstNode()
        const firstValue = collection.getNodeValue(firstNode)
        focusNode(scope, firstValue)
      },
      focusTreeLastNode(params) {
        const {prop, scope} = params
        const collection = prop("collection")
        const lastNode = collection.getLastNode(undefined, {
          skip: skipFn(params),
        })
        const lastValue = collection.getNodeValue(lastNode)
        focusNode(scope, lastValue)
      },
      focusTreeNextNode(params) {
        const {event, prop, scope} = params
        const collection = prop("collection")
        const nextNode = collection.getNextNode(event.id, {
          skip: skipFn(params),
        })
        if (!nextNode) {
          return
        }
        const nextValue = collection.getNodeValue(nextNode)
        focusNode(scope, nextValue)
      },
      focusTreePrevNode(params) {
        const {event, prop, scope} = params
        const collection = prop("collection")
        const prevNode = collection.getPreviousNode(event.id, {
          skip: skipFn(params),
        })
        if (!prevNode) {
          return
        }
        const prevValue = collection.getNodeValue(prevNode)
        focusNode(scope, prevValue)
      },
      selectAllNodes({context, prop}) {
        context.set("selectedValue", prop("collection").getValues())
      },
      selectNode({context, event}) {
        const value = (event.id || event.value) as string | string[] | undefined
        context.set("selectedValue", (prev) => {
          if (value == null) {
            return prev
          }
          if (!event.isTrusted && isArray(value)) {
            return prev.concat(...value)
          }
          return [isArray(value) ? last(value) : value].filter(
            Boolean,
          ) as string[]
        })
      },
      setChecked({context, event}) {
        context.set("checkedValue", event.value)
      },
      setExpanded({context, event}) {
        if (!isArray(event.value)) {
          return
        }
        context.set("expandedValue", event.value)
      },
      setFocusedNode({context, event}) {
        context.set("focusedValue", event.id)
      },
      setSelected({context, event}) {
        if (!isArray(event.value)) {
          return
        }
        context.set("selectedValue", event.value)
      },
      toggleBranchNode({action, context, event}) {
        const isExpanded = context.get("expandedValue").includes(event.id)
        action(isExpanded ? ["collapseBranch"] : ["expandBranch"])
      },
      toggleChecked({context, event, prop}) {
        const collection = prop("collection")
        context.set("checkedValue", (prev) =>
          event.isBranch
            ? toggleBranchChecked(collection, event.value, prev)
            : addOrRemove(prev, event.value),
        )
      },
      toggleNodeSelection({context, event}) {
        const selectedValue = addOrRemove(
          context.get("selectedValue"),
          event.id,
        )
        context.set("selectedValue", selectedValue)
      },
    },

    computed: {
      isMultipleSelection: ({prop}) => prop("selectionMode") === "multiple",
      isTypingAhead: ({refs}) =>
        refs.get("typeaheadState").keysSoFar.length > 0,
      visibleNodes: ({context, prop}) => {
        const nodes: {indexPath: number[]; node: TreeNode}[] = []
        prop("collection").visit({
          onEnter: (node, indexPath) => {
            nodes.push({indexPath, node})
          },
          skip: skipFn({context, prop}),
        })
        return nodes
      },
    },

    context({bindable, getContext, prop}) {
      return {
        checkedValue: bindable(() => ({
          defaultValue: prop("defaultCheckedValue") || [],
          isEqual,
          onChange(value) {
            prop("onCheckedValueChange")?.({
              get checkedNodes() {
                return prop("collection").findNodes(value)
              },
              checkedValue: value,
            })
          },
          value: prop("checkedValue"),
        })),
        expandedValue: bindable(() => ({
          defaultValue: prop("defaultExpandedValue"),
          isEqual,
          onChange(expandedValue) {
            const ctx = getContext()
            const focusedValue = ctx.get("focusedValue")
            prop("onExpandedValueChange")?.({
              get expandedNodes() {
                return prop("collection").findNodes(expandedValue)
              },
              expandedValue,
              focusedValue,
            })
          },
          value: prop("expandedValue"),
        })),
        focusedValue: bindable(() => ({
          defaultValue: prop("defaultFocusedValue") || null,
          onChange(focusedValue) {
            prop("onFocusChange")?.({
              get focusedNode() {
                return focusedValue
                  ? prop("collection").findNode(focusedValue)
                  : null
              },
              focusedValue,
            })
          },
          value: prop("focusedValue"),
        })),
        loadingStatus: bindable<TreeLoadingStatusMap>(() => ({
          defaultValue: {},
        })),
        selectedValue: bindable(() => ({
          defaultValue: prop("defaultSelectedValue"),
          isEqual,
          onChange(selectedValue) {
            const ctx = getContext()
            const focusedValue = ctx.get("focusedValue")
            prop("onSelectedValueChange")?.({
              focusedValue,
              get selectedNodes() {
                return prop("collection").findNodes(selectedValue)
              },
              selectedValue,
            })
          },
          value: prop("selectedValue"),
        })),
      }
    },

    exitActions: ["clearPendingAborts"],

    guards: {
      expandOnClick: ({prop}) => !!prop("expandOnClick"),
      hasSelectedItems: ({context}) => context.get("selectedValue").length > 0,
      isBranchExpanded: ({context, event}) =>
        context.get("expandedValue").includes(event.id),
      isBranchFocused: ({context, event}) =>
        context.get("focusedValue") === event.id,
      isCtrlKey: ({event}) => event.ctrlKey,
      isMultipleSelection: ({prop}) => prop("selectionMode") === "multiple",
      isShiftKey: ({event}) => event.shiftKey,
      moveFocus: ({event}) => !!event.moveFocus,
    },

    ids({bindableId}) {
      return {
        label: bindableId(),
        root: bindableId(),
      }
    },

    initialState: () => "idle",

    on: {
      "BRANCH.COLLAPSE": {
        actions: ["collapseBranches"],
      },
      "BRANCH.EXPAND": {
        actions: ["expandBranches"],
      },
      "CHECKED.CLEAR": {
        actions: ["clearChecked"],
      },
      "CHECKED.SET": {
        actions: ["setChecked"],
      },
      "CHECKED.TOGGLE": {
        actions: ["toggleChecked"],
      },
      "EXPANDED.ALL": {
        actions: ["expandAllBranches"],
      },
      "EXPANDED.CLEAR": {
        actions: ["clearExpanded"],
      },
      "EXPANDED.SET": {
        actions: ["setExpanded"],
      },
      "NODE.DESELECT": {
        actions: ["deselectNode"],
      },
      "NODE.SELECT": {
        actions: ["selectNode"],
      },
      "SELECTED.ALL": [
        {
          actions: ["selectAllNodes", "focusTreeLastNode"],
          guard: and("isMultipleSelection", "moveFocus"),
        },
        {
          actions: ["selectAllNodes"],
          guard: "isMultipleSelection",
        },
      ],
      "SELECTED.CLEAR": {
        actions: ["clearSelected"],
      },
      "SELECTED.SET": {
        actions: ["setSelected"],
      },
    },

    props({props}) {
      return {
        collection: new TreeCollection({rootNode: {children: []}}),
        defaultExpandedValue: [],
        defaultSelectedValue: [],
        expandOnClick: true,
        selectionMode: "single",
        typeahead: true,
        ...props,
      }
    },

    refs() {
      return {
        pendingAborts: new Map(),
        typeaheadState: {...getByTypeahead.defaultOptions},
      }
    },

    states: {
      idle: {
        on: {
          "BRANCH_NODE.ARROW_LEFT": [
            {
              actions: ["collapseBranch"],
              guard: "isBranchExpanded",
            },
            {
              actions: ["focusBranchNode"],
            },
          ],
          "BRANCH_NODE.ARROW_RIGHT": [
            {
              actions: ["focusBranchFirstNode"],
              guard: and("isBranchFocused", "isBranchExpanded"),
            },
            {
              actions: ["expandBranch"],
            },
          ],
          "BRANCH_NODE.CLICK": [
            {
              actions: ["toggleNodeSelection"],
              guard: and("isCtrlKey", "isMultipleSelection"),
            },
            {
              actions: ["extendSelectionToNode"],
              guard: and("isShiftKey", "isMultipleSelection"),
            },
            {
              actions: ["selectNode", "toggleBranchNode"],
              guard: "expandOnClick",
            },
            {
              actions: ["selectNode"],
            },
          ],
          "BRANCH_TOGGLE.CLICK": {
            actions: ["toggleBranchNode"],
          },
          "NODE.ARROW_DOWN": [
            {
              actions: ["focusTreeNextNode", "extendSelectionToNextNode"],
              guard: and("isShiftKey", "isMultipleSelection"),
            },
            {
              actions: ["focusTreeNextNode"],
            },
          ],
          "NODE.ARROW_LEFT": {
            actions: ["focusBranchNode"],
          },
          "NODE.ARROW_UP": [
            {
              actions: ["focusTreePrevNode", "extendSelectionToPrevNode"],
              guard: and("isShiftKey", "isMultipleSelection"),
            },
            {
              actions: ["focusTreePrevNode"],
            },
          ],
          "NODE.CLICK": [
            {
              actions: ["toggleNodeSelection"],
              guard: and("isCtrlKey", "isMultipleSelection"),
            },
            {
              actions: ["extendSelectionToNode"],
              guard: and("isShiftKey", "isMultipleSelection"),
            },
            {
              actions: ["selectNode"],
            },
          ],
          "NODE.END": [
            {
              actions: ["extendSelectionToLastNode", "focusTreeLastNode"],
              guard: and("isShiftKey", "isMultipleSelection"),
            },
            {
              actions: ["focusTreeLastNode"],
            },
          ],
          "NODE.FOCUS": {
            actions: ["setFocusedNode"],
          },
          "NODE.HOME": [
            {
              actions: ["extendSelectionToFirstNode", "focusTreeFirstNode"],
              guard: and("isShiftKey", "isMultipleSelection"),
            },
            {
              actions: ["focusTreeFirstNode"],
            },
          ],
          "SIBLINGS.EXPAND": {
            actions: ["expandSiblingBranches"],
          },
          "TREE.TYPEAHEAD": {
            actions: ["focusMatchedNode"],
          },
        },
      },
    },
  },
)
