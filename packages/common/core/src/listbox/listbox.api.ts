// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  contains,
  getByTypeahead,
  getEventKey,
  getEventTarget,
  getNativeEvent,
  isComposingEvent,
  isContextMenuEvent,
  isCtrlOrMetaKey,
  isDownloadingEvent,
  isEditableElement,
  isOpeningInNewTab,
} from "@qualcomm-ui/dom/query"
import {booleanAriaAttr, booleanDataAttr} from "@qualcomm-ui/utils/attributes"
import {isGridCollection} from "@qualcomm-ui/utils/collection"
import {ensure} from "@qualcomm-ui/utils/guard"
import type {
  EventKeyMap,
  Machine,
  PropNormalizer,
} from "@qualcomm-ui/utils/machine"

import {listboxAnatomy} from "./listbox.anatomy.js"
import {listboxDomEls, listboxDomIds} from "./listbox.dom.js"
import type {
  ListboxApi,
  ListboxContentBindings,
  ListboxInputBindings,
  ListboxItemApiProps,
  ListboxItemBindings,
  ListboxItemGroupBindings,
  ListboxItemGroupLabelBindings,
  ListboxItemIndicatorBindings,
  ListboxItemState,
  ListboxItemLabelBindings,
  ListboxLabelBindings,
  ListboxRootBindings,
  ListboxSchema,
} from "./listbox.types.js"

const parts = listboxAnatomy.parts

export function createListboxApi(
  machine: Machine<ListboxSchema>,
  normalize: PropNormalizer,
): ListboxApi {
  const {computed, context, prop, refs, scope, send} = machine

  const disabled = prop("disabled")
  const collection = prop("collection")
  const layout = isGridCollection(collection) ? "grid" : "list"

  const focused = context.get("focused")
  const focusVisible = refs.get("focusVisible") && focused
  const inputState = refs.get("inputState")

  const value = context.get("value")
  const selectedItems = computed("selectedItems")

  const highlightedValue = context.get("highlightedValue")
  const highlightedItem = context.get("highlightedItem")

  const isTypingAhead = computed("isTypingAhead")
  const interactive = computed("isInteractive")

  const ariaActiveDescendant = highlightedValue
    ? listboxDomIds.item(scope, highlightedValue)
    : undefined

  function getItemState(props: ListboxItemApiProps): ListboxItemState {
    const itemDisabled = collection.getItemDisabled(props.item)
    const value = collection.getItemValue(props.item)
    ensure(
      value,
      () =>
        `[qualcomm-ui] No value found for item ${JSON.stringify(props.item)}`,
    )
    const highlighted = highlightedValue === value
    return {
      disabled: Boolean(disabled || itemDisabled),
      focused: highlighted && focused,
      focusVisible: highlighted && focusVisible,
      highlighted: highlighted && (inputState.focused ? focused : focusVisible),
      selected: context.get("value").includes(value),
      value,
    }
  }

  return {
    clearHighlightedValue() {
      send({type: "HIGHLIGHTED_VALUE.SET", value: null})
    },
    clearValue(value) {
      if (value) {
        send({type: "ITEM.CLEAR", value})
      } else {
        send({type: "VALUE.CLEAR"})
      }
    },
    collection,
    disabled: !!disabled,
    empty: value.length === 0,
    getItemState,
    hasSelectedItems: computed("hasSelectedItems"),
    highlightedItem,
    highlightedValue,
    highlightFirst() {
      send({type: "HIGHLIGHT.FIRST"})
    },
    highlightLast() {
      send({type: "HIGHLIGHT.LAST"})
    },
    highlightNext() {
      send({type: "HIGHLIGHT.NEXT"})
    },
    highlightPrevious() {
      send({type: "HIGHLIGHT.PREV"})
    },
    highlightValue(value) {
      send({type: "HIGHLIGHTED_VALUE.SET", value})
    },
    selectAll() {
      if (!computed("multiple")) {
        throw new Error(
          "[qualcomm-ui] Cannot select all items in a single-select listbox",
        )
      }
      send({type: "VALUE.SET", value: collection.getValues()})
    },
    selectedItems,
    selectValue(value) {
      send({type: "ITEM.SELECT", value})
    },
    setValue(value) {
      send({type: "VALUE.SET", value})
    },
    value,
    valueAsString: computed("valueAsString"),

    // group: bindings
    getContentBindings(props): ListboxContentBindings {
      scope.ids.register("content", props)
      return normalize.element({
        ...parts.content,
        "aria-activedescendant": ariaActiveDescendant,
        "aria-labelledby": listboxDomIds.label(scope),
        "aria-multiselectable": computed("multiple") ? true : undefined,
        "data-activedescendant": ariaActiveDescendant,
        "data-empty": booleanDataAttr(collection.size === 0),
        "data-layout": layout,
        "data-orientation": prop("orientation"),
        dir: prop("dir"),
        id: scope.ids.get("content"),
        onBlur() {
          send({type: "CONTENT.BLUR"})
        },
        onFocus() {
          send({type: "CONTENT.FOCUS"})
        },
        onKeyDown(event) {
          if (!interactive) {
            return
          }
          const target = getEventTarget<Element>(event)
          if (!contains(event.currentTarget, getEventTarget(event))) {
            return
          }

          const shiftKey = event.shiftKey

          const keyMap: EventKeyMap = {
            a(event) {
              if (
                isCtrlOrMetaKey(event) &&
                computed("multiple") &&
                !prop("disallowSelectAll")
              ) {
                event.preventDefault()
                send({type: "VALUE.SET", value: collection.getValues()})
              }
            },

            ArrowDown(event) {
              let nextValue: string | null = null
              if (isGridCollection(collection) && highlightedValue) {
                nextValue = collection.getNextRowValue(highlightedValue)
              } else if (highlightedValue) {
                nextValue = collection.getNextValue(highlightedValue)
              }

              if (!nextValue && (prop("loopFocus") || !highlightedValue)) {
                nextValue = collection.firstValue
              }

              if (!nextValue) {
                return
              }
              event.preventDefault()
              send({
                anchorValue: highlightedValue,
                shiftKey,
                type: "NAVIGATE",
                value: nextValue,
              })
            },

            ArrowLeft() {
              if (
                !isGridCollection(collection) &&
                prop("orientation") === "vertical"
              ) {
                return
              }
              let nextValue = highlightedValue
                ? collection.getPreviousValue(highlightedValue)
                : null
              if (!nextValue && prop("loopFocus")) {
                nextValue = collection.lastValue
              }
              if (!nextValue) {
                return
              }
              event.preventDefault()
              send({
                anchorValue: highlightedValue,
                shiftKey,
                type: "NAVIGATE",
                value: nextValue,
              })
            },

            ArrowRight() {
              if (
                !isGridCollection(collection) &&
                prop("orientation") === "vertical"
              ) {
                return
              }
              let nextValue = highlightedValue
                ? collection.getNextValue(highlightedValue)
                : null
              if (!nextValue && prop("loopFocus")) {
                nextValue = collection.firstValue
              }
              if (!nextValue) {
                return
              }
              event.preventDefault()
              send({
                anchorValue: highlightedValue,
                shiftKey,
                type: "NAVIGATE",
                value: nextValue,
              })
            },

            ArrowUp(event) {
              let nextValue: string | null = null
              if (isGridCollection(collection) && highlightedValue) {
                nextValue = collection.getPreviousRowValue(highlightedValue)
              } else if (highlightedValue) {
                nextValue = collection.getPreviousValue(highlightedValue)
              }

              if (!nextValue && (prop("loopFocus") || !highlightedValue)) {
                nextValue = collection.lastValue
              }

              if (!nextValue) {
                return
              }

              event.preventDefault()
              send({
                anchorValue: highlightedValue,
                shiftKey,
                type: "NAVIGATE",
                value: nextValue,
              })
            },
            End(event) {
              if (isEditableElement(target)) {
                return
              }
              event.preventDefault()
              const nextValue = collection.lastValue
              send({
                anchorValue: highlightedValue,
                shiftKey,
                type: "NAVIGATE",
                value: nextValue,
              })
            },
            Enter() {
              send({type: "ITEM.CLICK", value: highlightedValue})
            },
            Escape(event) {
              if (prop("deselectable") && value.length > 0) {
                event.preventDefault()
                event.stopPropagation()
                send({type: "VALUE.CLEAR"})
              }
            },
            Home(event) {
              if (isEditableElement(target)) {
                return
              }
              event.preventDefault()
              const nextValue = collection.firstValue
              send({
                anchorValue: highlightedValue,
                shiftKey,
                type: "NAVIGATE",
                value: nextValue,
              })
            },
            Space(event) {
              if (isTypingAhead && prop("typeahead")) {
                send({key: event.key, type: "CONTENT.TYPEAHEAD"})
              } else {
                keyMap.Enter?.(event)
                // prevent scroll
                event.preventDefault()
              }
            },
          }

          const exec = keyMap[getEventKey(event)]

          if (exec) {
            exec(event)
            return
          }

          if (isEditableElement(target)) {
            return
          }

          if (getByTypeahead.isValidEvent(event) && prop("typeahead")) {
            send({key: event.key, type: "CONTENT.TYPEAHEAD"})
            event.preventDefault()
          }
        },
        role: "listbox",
        style: {
          "--column-count": isGridCollection(collection)
            ? collection.columnCount
            : 1,
        },
        tabIndex: 0,
      })
    },
    getInputBindings(props = {}): ListboxInputBindings {
      const keyboardPriority = props.keyboardPriority ?? "caret"
      return normalize.input({
        ...parts.input,
        "aria-activedescendant": ariaActiveDescendant,
        "aria-autocomplete": "list",
        "aria-controls": listboxDomIds.content(scope),
        "aria-haspopup": "listbox",
        autoComplete: "off",
        autoCorrect: "off",
        "data-disabled": booleanDataAttr(disabled),
        dir: prop("dir"),
        disabled,
        enterKeyHint: "go",
        onBlur() {
          send({src: "input", type: "CONTENT.BLUR"})
        },
        onFocus() {
          queueMicrotask(() => {
            send({autoHighlight: !!props?.autoHighlight, type: "INPUT.FOCUS"})
          })
        },
        onInput(event) {
          if (!props?.autoHighlight) {
            return
          }
          if ((event.currentTarget as any).value.trim()) {
            return
          }
          queueMicrotask(() => {
            send({type: "HIGHLIGHTED_VALUE.SET", value: null})
          })
        },
        onKeyDown(event) {
          if (event.defaultPrevented) {
            return
          }
          if (isComposingEvent(event)) {
            return
          }
          const nativeEvent = getNativeEvent(event)

          const navigateToValue = (nextValue: string | null): void => {
            if (!nextValue) {
              return
            }

            event.preventDefault()
            send({
              anchorValue: highlightedValue,
              shiftKey: event.shiftKey,
              type: "NAVIGATE",
              value: nextValue,
            })
          }

          switch (nativeEvent.key) {
            case "ArrowLeft": {
              if (!isGridCollection(collection)) {
                return
              }
              if (event.ctrlKey) {
                return
              }
              if (keyboardPriority !== "navigate") {
                return
              }

              let nextValue = highlightedValue
                ? collection.getPreviousValue(highlightedValue)
                : null
              if (!nextValue && prop("loopFocus")) {
                nextValue = collection.lastValue
              }

              navigateToValue(nextValue)
              break
            }

            case "ArrowRight": {
              if (!isGridCollection(collection)) {
                return
              }
              if (event.ctrlKey) {
                return
              }
              if (keyboardPriority !== "navigate") {
                return
              }

              let nextValue = highlightedValue
                ? collection.getNextValue(highlightedValue)
                : null
              if (!nextValue && prop("loopFocus")) {
                nextValue = collection.firstValue
              }

              navigateToValue(nextValue)
              break
            }

            case "Home": {
              if (keyboardPriority !== "navigate") {
                return
              }
              if (highlightedValue == null && event.shiftKey) {
                return
              }

              navigateToValue(collection.firstValue)
              break
            }

            case "End": {
              if (keyboardPriority !== "navigate") {
                return
              }
              if (highlightedValue == null && event.shiftKey) {
                return
              }

              navigateToValue(collection.lastValue)
              break
            }

            case "ArrowDown": {
              let nextValue: string | null = null
              if (isGridCollection(collection) && highlightedValue) {
                nextValue = collection.getNextRowValue(highlightedValue)
              } else if (highlightedValue) {
                nextValue = collection.getNextValue(highlightedValue)
              }

              if (!nextValue && (prop("loopFocus") || !highlightedValue)) {
                nextValue = collection.firstValue
              }

              navigateToValue(nextValue)
              break
            }

            case "ArrowUp": {
              let nextValue: string | null = null
              if (isGridCollection(collection) && highlightedValue) {
                nextValue = collection.getPreviousRowValue(highlightedValue)
              } else if (highlightedValue) {
                nextValue = collection.getPreviousValue(highlightedValue)
              }

              if (!nextValue && (prop("loopFocus") || !highlightedValue)) {
                nextValue = collection.lastValue
              }

              navigateToValue(nextValue)
              break
            }

            case "Enter":
              if (highlightedValue != null) {
                event.preventDefault()
                send({type: "ITEM.CLICK", value: highlightedValue})
              }
              break
            default:
              break
          }
        },
        spellCheck: false,
      })
    },
    getItemBindings(props): ListboxItemBindings {
      const itemState = getItemState(props)
      scope.ids
        .collection("item")
        .register(itemState.value, props.id, props.onDestroy)
      return normalize.element({
        ...parts.item,
        "aria-disabled": booleanAriaAttr(itemState.disabled),
        "aria-selected": itemState.selected,
        "data-disabled": booleanDataAttr(itemState.disabled),
        "data-highlighted": booleanDataAttr(
          itemState.focused && itemState.focusVisible,
        ),
        "data-layout": layout,
        "data-orientation": prop("orientation"),
        "data-selected": booleanDataAttr(itemState.selected),
        "data-state": itemState.selected ? "checked" : "unchecked",
        "data-value": itemState.value,
        dir: prop("dir"),
        id: props.id,
        onClick(event) {
          if (event.defaultPrevented) {
            return
          }
          if (isDownloadingEvent(event)) {
            return
          }
          if (isOpeningInNewTab(event)) {
            return
          }
          if (isContextMenuEvent(event)) {
            return
          }
          if (itemState.disabled) {
            return
          }
          send({
            anchorValue: highlightedValue,
            metaKey: isCtrlOrMetaKey(event),
            shiftKey: event.shiftKey,
            type: "ITEM.CLICK",
            value: itemState.value,
          })
        },
        onMouseDown(event) {
          event.preventDefault()
          listboxDomEls.content(scope)?.focus()
        },
        role: "option",
      })
    },
    getItemGroupBindings(props): ListboxItemGroupBindings {
      scope.ids
        .collection("itemGroup")
        .register(props.id, props.id, props.onDestroy)
      return normalize.element({
        ...parts.itemGroup,
        "aria-labelledby": listboxDomIds.itemGroupLabel(scope, props.id),
        "data-disabled": booleanDataAttr(disabled),
        "data-empty": booleanDataAttr(collection.size === 0),
        "data-orientation": prop("orientation"),
        dir: prop("dir"),
        id: props.id,
        role: "group",
      })
    },
    getItemGroupLabelBindings(props): ListboxItemGroupLabelBindings {
      const {groupId} = props
      scope.ids
        .collection("itemGroupLabel")
        .register(groupId, props.id, props.onDestroy)
      return normalize.element({
        ...parts.itemGroupLabel,
        dir: prop("dir"),
        id: props.id,
        role: "presentation",
      })
    },
    getItemIndicatorBindings(props): ListboxItemIndicatorBindings {
      const itemState = getItemState(props)
      return normalize.element({
        ...parts.itemIndicator,
        "aria-hidden": true,
        "data-state": itemState.selected ? "checked" : "unchecked",
        dir: prop("dir"),
        hidden: !itemState.selected || undefined,
        role: "presentation",
      })
    },
    getItemLabelBindings(props): ListboxItemLabelBindings {
      const itemState = getItemState(props)
      return normalize.element({
        ...parts.itemText,
        "data-disabled": booleanDataAttr(itemState.disabled),
        "data-highlighted": booleanDataAttr(itemState.highlighted),
        "data-state": itemState.selected ? "checked" : "unchecked",
        dir: prop("dir"),
        role: "presentation",
      })
    },
    getLabelBindings(props): ListboxLabelBindings {
      scope.ids.register("label", props)
      return normalize.element({
        ...parts.label,
        "data-disabled": booleanDataAttr(disabled),
        dir: prop("dir"),
        id: scope.ids.get("label"),
      })
    },
    getRootBindings(props): ListboxRootBindings {
      scope.ids.register("root", props)
      return normalize.element({
        ...parts.root,
        "data-disabled": booleanDataAttr(disabled),
        "data-orientation": prop("orientation"),
        dir: prop("dir"),
        id: scope.ids.get("root"),
      })
    },
  }
}
