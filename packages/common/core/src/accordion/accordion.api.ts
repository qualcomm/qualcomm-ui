import {getEventKey, isSafari} from "@qualcomm-ui/dom/query"
import {booleanAriaAttr, booleanDataAttr} from "@qualcomm-ui/utils/attributes"
import type {Direction} from "@qualcomm-ui/utils/direction"
import type {Machine, PropNormalizer} from "@qualcomm-ui/utils/machine"

import type {
  AccordionApi,
  AccordionItemApiProps,
  AccordionItemBindings,
  AccordionItemContentBindings,
  AccordionItemIndicatorBindings,
  AccordionItemSecondaryTextBindings,
  AccordionItemState,
  AccordionItemTextBindings,
  AccordionItemTriggerBindings,
  AccordionRootBindings,
  AccordionSchema,
} from "./accordion.types"
import {domIds} from "./internal"

export function createAccordionApi(
  machine: Machine<AccordionSchema>,
  normalize: PropNormalizer,
): AccordionApi {
  const {context, prop, scope, send} = machine

  const focusedValue = context.get("focusedValue")
  const value = context.get("value")
  const multiple = prop("multiple")

  const commonProps: {"data-scope": "accordion"; dir: Direction | undefined} = {
    "data-scope": "accordion",
    dir: prop("dir"),
  }

  function setValue(value: string[]) {
    send({
      type: "VALUE.SET",
      values: !multiple && value.length > 1 ? [value[0]] : value,
    })
  }

  function getAccordionItemState(
    itemProps: AccordionItemApiProps,
  ): AccordionItemState {
    return {
      ...itemProps,
      disabled: itemProps.disabled || prop("disabled"),
      open: value.includes(itemProps.value),
    }
  }

  return {
    focusedValue,
    setValue,
    value,

    // group: prop getters
    getAccordionItemBindings({
      id,
      onDestroy,
      ...itemProps
    }): AccordionItemBindings {
      const state = getAccordionItemState(itemProps)
      scope.ids.collection("item").register(state.value, id, onDestroy)
      return normalize.element({
        ...commonProps,
        "data-disabled": booleanDataAttr(state.disabled),
        "data-focus": booleanDataAttr(focusedValue === state.value),
        "data-part": "item",
        "data-state": state.open ? "open" : "closed",
        disabled: state.disabled,
        id,
      })
    },

    getAccordionItemContentBindings({
      id,
      onDestroy,
      ...itemProps
    }): AccordionItemContentBindings {
      const state = getAccordionItemState(itemProps)
      scope.ids.collection("content").register(state.value, id, onDestroy)

      return normalize.element({
        ...commonProps,
        "aria-hidden": booleanAriaAttr(!state.open, undefined),
        "aria-labelledby": domIds.trigger(scope, state.value)!,
        "data-disabled": booleanDataAttr(state.disabled),
        "data-expanded": booleanDataAttr(state.open),
        "data-focus": booleanDataAttr(focusedValue === state.value),
        "data-part": "item-content",
        "data-state": state.open ? "open" : "closed",
        id,
        role: "region",
      })
    },

    getAccordionItemIndicatorBindings(
      itemContext,
    ): AccordionItemIndicatorBindings {
      const state = getAccordionItemState(itemContext)
      return normalize.element({
        ...commonProps,
        "aria-hidden": true,
        "data-disabled": booleanDataAttr(state.disabled),
        "data-focus": booleanDataAttr(focusedValue === state.value),
        "data-part": "item-indicator",
        "data-state": state.open ? "open" : "closed",
      })
    },

    getAccordionItemSecondaryTextBindings(
      itemContext,
    ): AccordionItemSecondaryTextBindings {
      const state = getAccordionItemState(itemContext)

      return normalize.element({
        ...commonProps,
        "data-disabled": booleanDataAttr(state.disabled),
        "data-focus": booleanDataAttr(focusedValue === state.value),
        "data-part": "item-secondary-text",
        "data-state": state.open ? "open" : "closed",
      })
    },

    getAccordionItemState,

    getAccordionItemTextBindings(itemContext): AccordionItemTextBindings {
      const state = getAccordionItemState(itemContext)
      return normalize.element({
        ...commonProps,
        "data-disabled": booleanDataAttr(state.disabled),
        "data-focus": booleanDataAttr(focusedValue === state.value),
        "data-part": "item-text",
        "data-state": state.open ? "open" : "closed",
      })
    },

    getAccordionItemTriggerBindings({
      id,
      onDestroy,
      ...itemProps
    }): AccordionItemTriggerBindings {
      const state = getAccordionItemState(itemProps)
      scope.ids.collection("trigger").register(state.value, id, onDestroy)
      return normalize.element({
        ...commonProps,
        "aria-controls": domIds.content(scope, state.value)!,
        "aria-disabled": booleanAriaAttr(state.disabled),
        "aria-expanded": booleanAriaAttr(state.open),
        "data-disabled": booleanDataAttr(state.disabled),
        "data-focus": booleanDataAttr(focusedValue === state.value),
        "data-ownedby": domIds.root(scope),
        "data-part": "trigger",
        "data-state": state.open ? "open" : "closed",
        disabled: state.disabled,
        id,
        type: "button",
        // group: event handlers
        onBlur() {
          if (state.disabled) {
            return
          }
          send({type: "TRIGGER.BLUR"})
        },
        onClick(event) {
          if (state.disabled) {
            return
          }
          if (isSafari()) {
            ;(event.currentTarget as HTMLElement | null)?.focus()
          }
          send({type: "TRIGGER.CLICK", value: state.value})
        },
        onFocus() {
          if (state.disabled) {
            return
          }
          send({
            type: "TRIGGER.FOCUS",
            value: state.value,
          })
        },
        onKeyDown(event) {
          if (state.disabled || event.defaultPrevented) {
            return
          }
          type KeyType =
            | "ArrowDown"
            | "ArrowLeft"
            | "ArrowRight"
            | "ArrowUp"
            | "End"
            | "Home"
          const keyMap: Record<KeyType, (event: KeyboardEvent) => void> = {
            ArrowDown() {
              send({type: "GOTO.NEXT", value: state.value})
            },
            ArrowLeft() {
              send({type: "GOTO.PREV", value: state.value})
            },
            ArrowRight() {
              send({type: "GOTO.NEXT", value: state.value})
            },
            ArrowUp() {
              send({type: "GOTO.PREV", value: state.value})
            },
            End() {
              send({type: "GOTO.LAST", value: state.value})
            },
            Home() {
              send({type: "GOTO.FIRST", value: state.value})
            },
          }

          const key = getEventKey(event, {
            dir: prop("dir"),
          }) as KeyType

          const exec = keyMap[key]

          if (exec) {
            exec(event as unknown as KeyboardEvent)
            event.preventDefault()
          }
        },
      })
    },

    getRootBindings({id, onDestroy}): AccordionRootBindings {
      scope.ids.register("root", id, onDestroy)
      return normalize.element({
        ...commonProps,
        "data-part": "root",
        id,
      })
    },
  }
}
