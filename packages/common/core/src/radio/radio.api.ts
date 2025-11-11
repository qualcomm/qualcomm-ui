// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {isFocusVisible} from "@qualcomm-ui/dom/focus-visible"
import {
  isLeftClick,
  isSafari,
  visuallyHiddenStyle,
} from "@qualcomm-ui/dom/query"
import {booleanAriaAttr, booleanDataAttr} from "@qualcomm-ui/utils/attributes"
import type {Machine, PropNormalizer} from "@qualcomm-ui/utils/machine"

import {domEls, domIds} from "./internal"
import type {
  ItemState,
  RadioApi,
  RadioCommonBindings,
  RadioGroupBindings,
  RadioGroupErrorTextBindings,
  RadioGroupItemsBindings,
  RadioGroupLabelBindings,
  RadioItemBindings,
  RadioItemContext,
  RadioItemControlBindings,
  RadioItemDataBindings,
  RadioItemHiddenInputBindings,
  RadioItemLabelBindings,
  RadioSchema,
} from "./radio.types"

export function createRadioApi(
  machine: Machine<RadioSchema>,
  normalize: PropNormalizer,
): RadioApi {
  const {computed, context, prop, scope, send} = machine

  const commonBindings: RadioCommonBindings = {
    "data-scope": "radio",
    dir: prop("dir"),
  }

  const groupDisabled = computed("disabled")
  const readOnly = prop("readOnly")

  function getItemState(props: RadioItemContext): ItemState {
    const focused = context.get("focusedValue") === props.value
    const focusVisible = focused && isFocusVisible()
    return {
      active: context.get("activeValue") === props.value,
      checked: context.get("value") === props.value,
      disabled: !!props.disabled || groupDisabled,
      focused,
      focusVisible,
      hovered: context.get("hoveredValue") === props.value,
      value: props.value,
    }
  }

  function getItemDataAttrs<T extends RadioItemContext>(
    props: T,
  ): RadioItemDataBindings {
    const itemState = getItemState(props)
    return {
      "data-disabled": booleanDataAttr(itemState.disabled),
      "data-focus": booleanDataAttr(itemState.focused),
      "data-focus-visible": booleanDataAttr(itemState.focusVisible),
      "data-hover": booleanDataAttr(itemState.hovered),
      "data-readonly": booleanDataAttr(readOnly),
      "data-state": itemState.checked ? "checked" : "unchecked",
    }
  }

  const focus = () => {
    if (!groupDisabled) {
      send({type: "FOCUS_INPUT"})
    }
  }

  return {
    clearValue() {
      send({isTrusted: false, type: "SET_VALUE", value: null})
    },
    focus,
    setValue(value) {
      send({isTrusted: false, type: "SET_VALUE", value})
    },
    value: context.get("value"),

    // group: prop getters
    getGroupBindings(props): RadioGroupBindings {
      scope.ids.register("root", props)
      return normalize.element({
        ...commonBindings,
        "aria-describedby": prop("invalid")
          ? domIds.errorText(scope)
          : undefined,
        "aria-invalid": booleanAriaAttr(prop("invalid")),
        "aria-labelledby": domIds.label(scope),
        "aria-orientation": prop("orientation"),
        "data-disabled": booleanDataAttr(groupDisabled),
        "data-orientation": prop("orientation"),
        "data-part": "group",
        id: domIds.root(scope),
        role: "radiogroup",
      })
    },

    getGroupErrorTextBindings(props): RadioGroupErrorTextBindings {
      scope.ids.register("errorText", props)
      return normalize.element({
        ...commonBindings,
        "aria-live": "polite",
        "data-part": "error-text",
        hidden: !prop("invalid"),
        id: domIds.errorText(scope),
      })
    },

    getGroupItemsBindings(): RadioGroupItemsBindings {
      return {
        ...commonBindings,
        "data-orientation": prop("orientation"),
        "data-part": "items",
      }
    },

    getItemState,

    getLabelBindings(props): RadioGroupLabelBindings {
      scope.ids.register("label", props)
      return normalize.label({
        ...commonBindings,
        "data-disabled": booleanDataAttr(groupDisabled),
        "data-part": "label",
        id: domIds.label(scope),
        onClick: focus,
      })
    },

    getRadioBindings(itemProps): RadioItemBindings {
      scope.ids
        .collection("item")
        .register(itemProps.value, itemProps.id, itemProps.onDestroy)
      const itemState = getItemState(itemProps)
      return normalize.element({
        ...commonBindings,
        ...getItemDataAttrs(itemProps),
        "data-part": "item",
        htmlFor: domIds.itemHiddenInput(scope, itemProps.value)!,
        onClick(event) {
          if (!itemState.disabled && isSafari() && !event.defaultPrevented) {
            domEls.itemHiddenInput(scope, itemProps.value)?.focus()
          }
        },
        onPointerDown(event) {
          if (
            itemState.disabled ||
            !isLeftClick(event) ||
            event.defaultPrevented
          ) {
            return
          }
          // On pointerdown, the input blurs and returns focus to the `body`,
          // we need to prevent this.
          if (itemState.focused && event.pointerType === "mouse") {
            event.preventDefault()
          }
          send({active: true, type: "SET_ACTIVE", value: itemProps.value})
        },
        onPointerLeave() {
          if (itemState.disabled) {
            return
          }
          send({type: "SET_HOVERED", value: null})
        },
        onPointerMove() {
          if (itemState.disabled) {
            return
          }
          if (itemState.hovered) {
            return
          }
          send({hovered: true, type: "SET_HOVERED", value: itemProps.value})
        },
        onPointerUp() {
          if (itemState.disabled) {
            return
          }
          send({type: "SET_ACTIVE", value: null})
        },
      })
    },

    getRadioControlBindings(itemProps): RadioItemControlBindings {
      const itemState = getItemState(itemProps)
      return normalize.element({
        ...commonBindings,
        ...getItemDataAttrs(itemProps),
        "aria-hidden": true,
        "data-active": booleanDataAttr(itemState.active),
        "data-part": "item-control",
      })
    },

    getRadioHiddenInputBindings(itemProps): RadioItemHiddenInputBindings {
      const itemState = getItemState(itemProps)
      scope.ids
        .collection("itemHiddenInput")
        .register(itemProps.value, itemProps.id, itemProps.onDestroy)
      return normalize.input({
        ...commonBindings,
        ...getItemDataAttrs(itemProps),
        "aria-labelledby": scope.ids
          .collection("itemLabel")
          .get(itemProps.value),
        "data-ownedby": domIds.root(scope),
        "data-part": "item-hidden-input",
        defaultChecked: itemState.checked,
        disabled: itemState.disabled,
        form: prop("form") || undefined,
        id: itemProps.id,
        name: prop("name") || domIds.root(scope),
        onBlur() {
          send({focused: false, type: "SET_FOCUSED", value: null})
        },
        onClick(event) {
          if (readOnly) {
            event.preventDefault()
            return
          }

          if (event.currentTarget.checked) {
            send({isTrusted: true, type: "SET_VALUE", value: itemProps.value})
          }
        },
        onFocus() {
          send({focused: true, type: "SET_FOCUSED", value: itemProps.value})
        },
        onKeyDown(event) {
          if (event.defaultPrevented) {
            return
          }
          if (event.key === " ") {
            send({active: true, type: "SET_ACTIVE", value: itemProps.value})
          }
        },
        onKeyUp(event) {
          if (event.defaultPrevented) {
            return
          }
          if (event.key === " ") {
            send({type: "SET_ACTIVE", value: null})
          }
        },
        style: visuallyHiddenStyle,
        type: "radio",
        value: itemProps.value,
      })
    },

    getRadioLabelBindings(itemProps): RadioItemLabelBindings {
      scope.ids
        .collection("itemLabel")
        .register(itemProps.value, itemProps.id, itemProps.onDestroy)
      return normalize.label({
        ...commonBindings,
        ...getItemDataAttrs(itemProps),
        "data-part": "item-label",
        id: itemProps.id,
        onClick: () => {
          if (!getItemState(itemProps).disabled) {
            focus()
          }
        },
      })
    },
  }
}
