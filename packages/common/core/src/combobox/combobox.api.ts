// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {getPlacementStyles} from "@qualcomm-ui/dom/floating-ui"
import {isFocusVisible} from "@qualcomm-ui/dom/focus-visible"
import {
  getEventKey,
  isComposingEvent,
  isContextMenuEvent,
  isDownloadingEvent,
  isLeftClick,
  isOpeningInNewTab,
} from "@qualcomm-ui/dom/query"
import {booleanAriaAttr, booleanDataAttr} from "@qualcomm-ui/utils/attributes"
import type {CollectionItem} from "@qualcomm-ui/utils/collection"
import type {DirectionProperty} from "@qualcomm-ui/utils/direction"
import {ensure} from "@qualcomm-ui/utils/guard"
import type {
  EventKeyMap,
  IdRegistrationProps,
  Machine,
  PropNormalizer,
} from "@qualcomm-ui/utils/machine"

import type {
  ComboboxApi,
  ComboboxApiItemProps,
  ComboboxClearTriggerBindings,
  ComboboxControlBindings,
  ComboboxEmptyBindings,
  ComboboxErrorIndicatorBindings,
  ComboboxErrorTextBindings,
  ComboboxHintBindings,
  ComboboxItemBindings,
  ComboboxItemContext,
  ComboboxItemGroupBindings,
  ComboboxItemGroupLabelBindings,
  ComboboxItemIndicatorBindings,
  ComboboxItemTextBindings,
  ComboboxLabelBindings,
  ComboboxPositionerBindings,
  ComboboxRootBindings,
  ComboboxSchema,
  ComboboxTriggerBindings,
} from "./combobox.types"
import {
  domEls,
  domIds,
  getItemGroupId,
  getItemGroupLabelId,
  getItemId,
} from "./internal"

export function createComboboxApi(
  machine: Machine<ComboboxSchema>,
  normalize: PropNormalizer,
): ComboboxApi {
  const {computed, context, event, prop, refs, scope, send, state} = machine

  const translations = prop("translations")
  const collection = prop("collection")

  const disabled = !!prop("disabled")
  const interactive = computed("isInteractive")
  const invalid = !!prop("invalid")
  const required = !!prop("required")
  const readOnly = !!prop("readOnly")

  const open = state.hasTag("open")
  const focused = state.hasTag("focused")
  const composite = prop("composite")
  const highlightedValue = context.get("highlightedValue")

  const popperStyles = getPlacementStyles({
    ...prop("positioning"),
    placement: context.get("currentPlacement"),
  })

  function getItemState(
    props: ComboboxApiItemProps<CollectionItem>,
  ): ComboboxItemContext {
    const itemDisabled = collection.getItemDisabled(props.item)
    const value = collection.getItemValue(props.item)
    ensure(
      value,
      () =>
        `[@qualcomm-ui/core] No value found for item ${JSON.stringify(props.item)}`,
    )
    return {
      ...props,
      disabled: disabled || itemDisabled,
      highlighted: highlightedValue === value,
      selected: context.get("value").includes(value),
      value,
    }
  }

  const commonBindings: {"data-scope": "combobox"} & DirectionProperty = {
    "data-scope": "combobox",
    dir: prop("dir"),
  }

  return {
    clearHighlightValue() {
      send({type: "HIGHLIGHTED_VALUE.CLEAR"})
    },
    clearValue(value) {
      if (value != null) {
        send({type: "ITEM.CLEAR", value})
      } else {
        send({type: "VALUE.CLEAR"})
      }
    },
    collection: prop("collection"),
    disabled: !!disabled,
    focus() {
      domEls.input(scope)?.focus()
    },
    focused,
    hasSelectedItems: computed("hasSelectedItems"),
    highlightedItem: context.get("highlightedItem"),
    highlightedValue,
    inputValue: context.get("inputValue"),
    multiple: !!prop("multiple"),
    open,
    reposition(options = {}) {
      send({options, type: "POSITIONING.SET"})
    },
    required: prop("required"),
    selectedItems: context.get("selectedItems"),
    selectValue(value) {
      send({type: "ITEM.SELECT", value})
    },
    setHighlightValue(value) {
      send({type: "HIGHLIGHTED_VALUE.SET", value})
    },
    setInputValue(value, reason = "script") {
      send({src: reason, type: "INPUT_VALUE.SET", value})
    },
    setOpen(nextOpen, reason = "script") {
      const open = state.hasTag("open")
      if (open === nextOpen) {
        return
      }
      send({src: reason, type: nextOpen ? "OPEN" : "CLOSE"})
    },
    setScrollToIndexFn(fn) {
      refs.set("scrollToIndexFn", fn)
    },
    setValue(value) {
      send({type: "VALUE.SET", value})
    },
    syncSelectedItems() {
      send({type: "SELECTED_ITEMS.SYNC"})
    },
    value: context.get("value"),
    valueAsString: computed("valueAsString"),

    // group: bindings
    getClearTriggerBindings(props): ComboboxClearTriggerBindings {
      scope.ids.register("clearTrigger", props)
      return normalize.button({
        ...commonBindings,
        "aria-controls": domIds.input(scope),
        "aria-label": translations.clearTriggerLabel,
        "data-invalid": booleanDataAttr(invalid),
        "data-part": "clear-trigger",

        disabled,
        hidden: !context.get("value").length,
        id: props.id,
        onClick(event) {
          if (event.defaultPrevented) {
            return
          }
          if (!interactive) {
            return
          }
          send({src: "clear-trigger", type: "VALUE.CLEAR"})
        },
        onPointerDown(event) {
          if (!isLeftClick(event)) {
            return
          }
          event.preventDefault()
        },
        tabIndex: -1,
        type: "button",
      })
    },

    getContentBindings(props) {
      scope.ids.register("content", props)
      return normalize.element({
        ...commonBindings,
        "aria-labelledby": domIds.label(scope),
        "aria-multiselectable":
          prop("multiple") && composite ? "true" : undefined,
        "data-disabled": booleanDataAttr(disabled),
        "data-empty": booleanDataAttr(collection.size === 0),
        "data-focus-visible": booleanDataAttr(isFocusVisible()),
        "data-part": "content",
        "data-placement": context.get("currentPlacement"),
        "data-state": open ? "open" : "closed",
        hidden: !open,
        id: props.id,
        onPointerDown(event) {
          if (!isLeftClick(event)) {
            return
          }
          // prevent options or elements within listbox from taking focus
          event.preventDefault()
        },
        role: !composite ? "dialog" : "listbox",
        tabIndex: -1,
      })
    },

    getControlBindings(props): ComboboxControlBindings {
      scope.ids.register("control", props)
      return normalize.element({
        ...commonBindings,
        "data-disabled": booleanDataAttr(disabled),
        "data-focus": booleanDataAttr(focused),
        "data-invalid": booleanDataAttr(invalid),
        "data-part": "control",
        "data-state": open ? "open" : "closed",
        id: props.id,
      })
    },

    getEmptyBindings(): ComboboxEmptyBindings {
      return normalize.element({
        ...commonBindings,
        "data-part": "empty",
        hidden: collection.size > 0,
        role: "presentation",
      })
    },

    getErrorIndicatorBindings(): ComboboxErrorIndicatorBindings {
      return normalize.element({
        ...commonBindings,
        "aria-label": "Error",
        "data-part": "error-indicator",
        hidden: !prop("invalid"),
      })
    },

    getErrorTextBindings(
      props: IdRegistrationProps,
    ): ComboboxErrorTextBindings {
      scope.ids.register("errorText", props)
      return normalize.element({
        ...commonBindings,
        "aria-live": "polite",
        "data-part": "error-text",
        hidden: !prop("invalid"),
        id: props.id,
      })
    },

    getHintBindings(props: IdRegistrationProps): ComboboxHintBindings {
      scope.ids.register("hint", props)
      return normalize.element({
        ...commonBindings,
        "data-disabled": booleanDataAttr(disabled),
        "data-part": "hint",
        id: props.id,
      })
    },

    getInputBindings(props) {
      scope.ids.register("input", props)
      return normalize.input({
        ...commonBindings,
        "aria-activedescendant": highlightedValue
          ? getItemId(scope, highlightedValue)
          : undefined,
        "aria-autocomplete": computed("autoComplete") ? "both" : "list",
        "aria-controls": domIds.content(scope),
        "aria-expanded": booleanAriaAttr(open),
        "aria-invalid": booleanAriaAttr(invalid),
        autoCapitalize: "none",
        autoComplete: "off",
        autoCorrect: "off",
        "data-autofocus": booleanDataAttr(prop("autoFocus")),
        "data-invalid": booleanDataAttr(invalid),
        "data-part": "input",
        "data-state": open ? "open" : "closed",
        defaultValue: context.get("inputValue"),
        disabled,
        form: prop("form"),
        id: props.id,
        name: prop("name"),
        onBlur() {
          if (disabled) {
            return
          }
          send({type: "INPUT.BLUR"})
        },
        onChange(event) {
          send({
            src: "input-change",
            type: "INPUT.CHANGE",
            value: event.currentTarget.value,
          })
        },
        onClick(event) {
          if (event.defaultPrevented) {
            return
          }
          if (!prop("openOnClick")) {
            return
          }
          if (!interactive) {
            return
          }
          send({src: "input-click", type: "INPUT.CLICK"})
        },
        onFocus() {
          if (disabled) {
            return
          }
          send({type: "INPUT.FOCUS"})
        },
        onKeyDown(event) {
          if (event.defaultPrevented || !interactive) {
            return
          }
          if (event.ctrlKey || event.shiftKey || isComposingEvent(event)) {
            return
          }

          const openOnKeyPress = prop("openOnKeyPress")
          const isModifierKey = event.ctrlKey || event.metaKey || event.shiftKey
          const keypress = true

          const keymap: EventKeyMap = {
            ArrowDown(event) {
              if (!openOnKeyPress && !open) {
                return
              }
              send({
                keypress,
                src: "arrow-key",
                type: event.altKey ? "OPEN" : "INPUT.ARROW_DOWN",
              })
              event.preventDefault()
            },
            ArrowUp() {
              if (!openOnKeyPress && !open) {
                return
              }
              send({
                keypress,
                src: "arrow-key",
                type: event.altKey ? "CLOSE" : "INPUT.ARROW_UP",
              })
              event.preventDefault()
            },
            End(event) {
              if (isModifierKey) {
                return
              }
              send({keypress, type: "INPUT.END"})
              if (open) {
                event.preventDefault()
              }
            },
            Enter(event) {
              send({keypress, src: "item-select", type: "INPUT.ENTER"})

              // when there's a form owner, allow submitting custom value if
              // `allowCustomValue` is true
              const submittable =
                computed("isCustomValue") && prop("allowCustomValue")
              // Also allow submission when there's no highlighted item (bug fix)
              const hasHighlight = highlightedValue != null
              // Allow submission when alwaysSubmitOnEnter is true
              const alwaysSubmit = prop("alwaysSubmitOnEnter")

              if (open && !submittable && !alwaysSubmit && hasHighlight) {
                event.preventDefault()
              }
            },
            Escape() {
              send({keypress, src: "escape-key", type: "INPUT.ESCAPE"})
              event.preventDefault()
            },
            Home(event) {
              if (isModifierKey) {
                return
              }
              send({keypress, type: "INPUT.HOME"})
              if (open) {
                event.preventDefault()
              }
            },
          }

          const key = getEventKey(event, {dir: prop("dir")})
          const exec = keymap[key]
          exec?.(event)
        },
        placeholder: prop("placeholder"),
        readOnly,
        required: prop("required"),
        role: "combobox",
        spellCheck: "false",
        type: "text",
      })
    },

    getItemBindings(itemState): ComboboxItemBindings {
      const value = itemState.value

      return normalize.element({
        ...commonBindings,
        "aria-disabled": booleanAriaAttr(itemState.disabled),
        "aria-selected": booleanAriaAttr(itemState.highlighted),
        "data-disabled": booleanDataAttr(itemState.disabled),
        "data-highlighted": booleanDataAttr(itemState.highlighted),
        "data-part": "item",
        "data-state": itemState.selected ? "checked" : "unchecked",
        "data-value": itemState.value,
        id: getItemId(scope, value),
        onClick(event) {
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
          send({src: "item-select", type: "ITEM.CLICK", value})
        },
        onPointerLeave() {
          if (itemState.persistFocus) {
            return
          }
          if (itemState.disabled) {
            return
          }
          const prev = event.previous()
          const mouseMoved = prev?.type.includes("POINTER")
          if (!mouseMoved) {
            return
          }
          send({type: "ITEM.POINTER_LEAVE", value})
        },
        onPointerMove() {
          if (itemState.disabled) {
            return
          }
          if (itemState.highlighted) {
            return
          }
          send({type: "ITEM.POINTER_MOVE", value})
        },
        role: "option",
        tabIndex: -1,
      })
    },

    getItemGroupBindings(props): ComboboxItemGroupBindings {
      const {id} = props
      return normalize.element({
        ...commonBindings,
        "aria-labelledby": getItemGroupLabelId(scope, id),
        "data-empty": booleanDataAttr(collection.size === 0),
        "data-part": "item-group",
        id: getItemGroupId(scope, id),
        role: "group",
      })
    },

    getItemGroupLabelBindings(props): ComboboxItemGroupLabelBindings {
      return normalize.element({
        ...commonBindings,
        "data-part": "item-group-label",
        id: getItemGroupLabelId(scope, props.htmlFor),
        role: "presentation",
      })
    },

    getItemIndicatorBindings(itemState): ComboboxItemIndicatorBindings {
      return normalize.element({
        ...commonBindings,
        "aria-hidden": true,
        "data-part": "item-indicator",
        "data-state": itemState.selected ? "checked" : "unchecked",
        hidden: !itemState.selected,
      })
    },

    getItemState,

    getItemTextBindings(itemState): ComboboxItemTextBindings {
      return normalize.element({
        ...commonBindings,
        "data-disabled": booleanDataAttr(itemState.disabled),
        "data-highlighted": booleanDataAttr(itemState.highlighted),
        "data-part": "item-text",
        "data-state": itemState.selected ? "checked" : "unchecked",
      })
    },

    getLabelBindings(props): ComboboxLabelBindings {
      scope.ids.register("label", props)
      return normalize.label({
        ...commonBindings,
        "data-disabled": booleanDataAttr(disabled),
        "data-focus": booleanDataAttr(focused),
        "data-invalid": booleanDataAttr(invalid),
        "data-part": "label",
        "data-readonly": booleanDataAttr(readOnly),
        "data-required": booleanDataAttr(required),
        htmlFor: domIds.input(scope),
        id: props.id,
        onClick(event) {
          if (composite) {
            return
          }
          event.preventDefault()
          domEls.trigger(scope)?.focus({preventScroll: true})
        },
      })
    },

    getPositionerBindings(props): ComboboxPositionerBindings {
      scope.ids.register("positioner", props)
      return normalize.element({
        ...commonBindings,
        "data-part": "positioner",
        id: props.id,
        style: popperStyles.floating,
      })
    },

    getRootBindings(props): ComboboxRootBindings {
      scope.ids.register("root", props)
      return normalize.element({
        ...commonBindings,
        "data-invalid": booleanDataAttr(invalid),
        "data-part": "root",
        "data-readonly": booleanDataAttr(readOnly),
        id: props.id,
        onClick: (event) => {
          if (event.target === domEls.control(scope)) {
            domEls.input(scope)?.focus({preventScroll: true})
          }
        },
      })
    },

    getTriggerBindings(props): ComboboxTriggerBindings {
      scope.ids.register("trigger", props)
      return normalize.button({
        ...commonBindings,
        "aria-controls": open ? domIds.content(scope) : undefined,
        "aria-expanded": booleanAriaAttr(open),
        "aria-haspopup": composite ? "listbox" : "dialog",
        "aria-label": translations.triggerLabel,
        "data-disabled": booleanDataAttr(disabled),
        "data-focusable": booleanDataAttr(props.focusable),
        "data-invalid": booleanDataAttr(invalid),
        "data-part": "trigger",
        "data-readonly": booleanDataAttr(readOnly),
        "data-state": open ? "open" : "closed",
        disabled,
        id: props.id,
        onClick(event) {
          if (event.defaultPrevented) {
            return
          }
          if (!interactive) {
            return
          }
          if (!isLeftClick(event)) {
            return
          }
          send({src: "trigger-click", type: "TRIGGER.CLICK"})
        },
        onFocus() {
          if (!props.focusable) {
            return
          }
          send({src: "trigger", type: "INPUT.FOCUS"})
        },
        onKeyDown(event) {
          if (event.defaultPrevented) {
            return
          }
          if (composite) {
            return
          }

          const keyMap: EventKeyMap = {
            ArrowDown() {
              send({src: "arrow-key", type: "INPUT.ARROW_DOWN"})
            },
            ArrowUp() {
              send({src: "arrow-key", type: "INPUT.ARROW_UP"})
            },
          }

          const key = getEventKey(event, {dir: prop("dir")})
          const exec = keyMap[key]

          if (exec) {
            exec(event as any)
            event.preventDefault()
          }
        },
        onPointerDown(event) {
          if (!interactive) {
            return
          }
          if (event.pointerType === "touch") {
            return
          }
          if (!isLeftClick(event)) {
            return
          }
          event.preventDefault()
          queueMicrotask(() => {
            domEls.input(scope)?.focus({preventScroll: true})
          })
        },
        tabIndex: props.focusable ? undefined : -1,
        type: "button",
      })
    },
  }
}
