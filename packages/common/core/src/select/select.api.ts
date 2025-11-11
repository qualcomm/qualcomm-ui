import {getPlacementStyles, type PositioningOptions} from "@qualcomm-ui/dom/floating-ui"
import {isFocusVisible} from "@qualcomm-ui/dom/focus-visible"
import {
  getByTypeahead,
  getEventKey,
  getEventTarget,
  isEditableElement,
  isSelfTarget,
  visuallyHiddenStyle,
} from "@qualcomm-ui/dom/query"
import {booleanAriaAttr, booleanDataAttr} from "@qualcomm-ui/utils/attributes"
import {ensure} from "@qualcomm-ui/utils/guard"
import type {
  EventKeyMap,
  IdRegistrationProps,
  Machine,
  PropNormalizer,
} from "@qualcomm-ui/utils/machine"

import {domEls, domIds} from "./internal"
import type {
  ItemProps,
  ItemState,
  ScrollToIndexFn,
  SelectApi,
  SelectClearTriggerBindings,
  SelectControlBindings,
  SelectErrorIndicatorBindings,
  SelectErrorTextBindings,
  SelectHintBindings,
  SelectItemBindings,
  SelectItemGroupBindings,
  SelectItemIndicatorBindings,
  SelectItemTextBindings,
  SelectRootBindings,
  SelectSchema,
} from "./select.types"

export function createSelectApi(
  machine: Machine<SelectSchema>,
  normalize: PropNormalizer,
): SelectApi {
  const {computed, context, prop, refs, scope, send, state} = machine

  const disabled = prop("disabled") || context.get("fieldsetDisabled")
  const invalid = prop("invalid")
  const readOnly = prop("readOnly")
  const collection = prop("collection")

  const open = state.hasTag("open")
  const focused = state.matches("focused")

  const highlightedValue = context.get("highlightedValue")
  const highlightedItem = context.get("highlightedItem")
  const selectedItems = context.get("selectedItems")
  const currentPlacement = context.get("currentPlacement")

  const isTypingAhead = computed("isTypingAhead")
  const interactive = computed("isInteractive")

  const ariaActiveDescendant =
    (highlightedValue && domIds.item?.(scope, highlightedValue)) || undefined

  function getItemState(props: ItemProps): ItemState {
    const _disabled = collection.getItemDisabled(props.item)
    const value = collection.getItemValue(props.item)
    ensure(
      value,
      () => `[@qualcomm-ui/core] No value found for item ${JSON.stringify(props.item)}`,
    )
    return {
      disabled: Boolean(disabled || _disabled),
      highlighted: highlightedValue === value,
      persistFocus: props.persistFocus,
      selected: context.get("value")?.includes(value) || false,
      value,
    }
  }

  const popperStyles = getPlacementStyles({
    ...prop("positioning"),
    placement: currentPlacement,
  })

  return {
    clearValue(value) {
      send({type: "ITEM.CLEAR", value})
    },
    collection,
    disabled,
    empty: computed("isEmpty"),
    focus() {
      domEls.control(scope)?.focus({preventScroll: true})
    },
    focused,
    getItemState,
    hasSelectedItems: computed("hasSelectedItems"),
    hiddenSelectOptions: [],
    highlightedItem,
    highlightedValue,
    highlightValue(value) {
      send({type: "HIGHLIGHTED_VALUE.SET", value})
    },
    multiple: prop("multiple"),
    open,
    placeholder: prop("placeholder"),
    reposition(options: Partial<PositioningOptions> = {}) {
      send({options, type: "POSITIONING.SET"})
    },
    required: prop("required"),
    selectAll() {
      send({type: "VALUE.SET", value: collection.getValues()})
    },
    selectedItems,
    selectValue(value) {
      send({type: "ITEM.SELECT", value})
    },
    setOpen(nextOpen) {
      const open = state.hasTag("open")
      if (open === nextOpen) {
        return
      }
      send({type: nextOpen ? "OPEN" : "CLOSE"})
    },
    setScrollToIndexFn(fn: ScrollToIndexFn) {
      refs.set("scrollToIndexFn", fn)
    },
    setValue(value) {
      send({type: "VALUE.SET", value})
    },
    value: context.get("value"),
    valueAsString: context.get("valueAsString"),

    // group: prop getters
    getClearTriggerBindings(props): SelectClearTriggerBindings {
      scope.ids.register("clearTrigger", props)
      return normalize.button({
        "aria-label": "Clear value",
        "data-invalid": booleanDataAttr(invalid),
        "data-part": "clear-trigger",
        "data-scope": "select",
        dir: prop("dir"),
        disabled,
        hidden: !computed("hasSelectedItems"),
        id: domIds.clearTrigger(scope),
        onClick(event) {
          if (event.defaultPrevented || !interactive) {
            return
          }
          send({type: "CLEAR.CLICK"})
          // prevent the same click from reopening the select.
          if (!open) {
            event.stopPropagation()
          }
        },
        type: "button",
      })
    },

    getContentBindings(props) {
      scope.ids.register("content", props)
      return normalize.element({
        "aria-activedescendant": ariaActiveDescendant,
        "aria-labelledby": domIds.label(scope),
        "aria-multiselectable": booleanAriaAttr(prop("multiple")),
        "data-activedescendant": ariaActiveDescendant,
        "data-focus-visible": booleanDataAttr(isFocusVisible()),
        "data-part": "content",
        "data-placement": currentPlacement,
        "data-scope": "select",
        "data-state": open ? "open" : "closed",
        dir: prop("dir"),
        hidden: !open,
        id: domIds.content(scope),
        onKeyDown(event) {
          if (!interactive) {
            return
          }
          if (!isSelfTarget(event)) {
            return
          }
          if (event.defaultPrevented) {
            return
          }

          const keyMap: EventKeyMap = {
            ArrowDown() {
              send({type: "CONTENT.ARROW_DOWN"})
            },
            ArrowUp() {
              send({type: "CONTENT.ARROW_UP"})
            },
            End() {
              send({type: "CONTENT.END"})
            },
            Enter() {
              send({type: "ITEM.CLICK"})
            },
            Home() {
              send({type: "CONTENT.HOME"})
            },
            Space() {
              if (isTypingAhead) {
                send({key: event.key, type: "CONTENT.TYPEAHEAD"})
              } else {
                keyMap.Enter?.(event)
              }
            },
            Tab() {
              send({type: "TRIGGER.TAB"})
            },
          }

          const exec = keyMap[getEventKey(event)]

          if (exec) {
            exec(event)
            event.preventDefault()
            return
          }

          const target = getEventTarget<Element>(event)

          if (isEditableElement(target)) {
            return
          }

          if (getByTypeahead.isValidEvent(event)) {
            send({key: event.key, type: "CONTENT.TYPEAHEAD"})
            event.preventDefault()
          }
        },
        role: "listbox",
        tabIndex: 0,
      })
    },

    getControlBindings(props): SelectControlBindings {
      scope.ids.register("control", props)
      return normalize.button({
        "aria-controls": domIds.content(scope),
        "aria-expanded": booleanAriaAttr(open),
        "aria-haspopup": "listbox",
        "aria-invalid": invalid,
        "aria-labelledby": domIds.label(scope),
        "data-disabled": booleanDataAttr(disabled),
        "data-invalid": booleanDataAttr(invalid),
        "data-part": "control",
        "data-placeholder-shown": booleanDataAttr(
          !computed("hasSelectedItems"),
        ),
        "data-placement": currentPlacement,
        "data-readonly": booleanDataAttr(readOnly),
        "data-scope": "select",
        "data-state": open ? "open" : "closed",
        dir: prop("dir"),
        disabled,
        id: domIds.control(scope),
        onBlur() {
          send({type: "TRIGGER.BLUR"})
        },
        onClick(event) {
          if (!interactive) {
            return
          }
          if (event.defaultPrevented) {
            return
          }
          send({type: "TRIGGER.CLICK"})
        },
        onFocus() {
          send({type: "TRIGGER.FOCUS"})
        },
        onKeyDown(event) {
          if (event.defaultPrevented) {
            return
          }
          if (!interactive) {
            return
          }

          const keyMap: EventKeyMap = {
            ArrowDown(event) {
              if (event.altKey) {
                send({type: "OPEN"})
              } else {
                send({type: "TRIGGER.ARROW_DOWN"})
              }
            },
            ArrowLeft() {
              send({type: "TRIGGER.ARROW_LEFT"})
            },
            ArrowRight() {
              send({type: "TRIGGER.ARROW_RIGHT"})
            },
            ArrowUp() {
              send({type: "TRIGGER.ARROW_UP"})
            },
            End() {
              send({type: "TRIGGER.END"})
            },
            Enter() {
              send({type: "TRIGGER.ENTER"})
            },
            Home() {
              send({type: "TRIGGER.HOME"})
            },
            Space(event) {
              if (isTypingAhead) {
                send({type: "TRIGGER.TYPEAHEAD", value: event.key})
              } else {
                send({type: "TRIGGER.ENTER"})
              }
            },
          }

          const exec =
            keyMap[
              getEventKey(event, {
                dir: prop("dir"),
                orientation: "vertical",
              })
            ]

          if (exec) {
            exec(event)
            event.preventDefault()
            return
          }

          if (getByTypeahead.isValidEvent(event)) {
            send({type: "TRIGGER.TYPEAHEAD", value: event.key})
            event.preventDefault()
          }
        },
        role: "combobox",
        tabIndex: disabled ? -1 : 0,
      })
    },

    getErrorIndicatorBindings(): SelectErrorIndicatorBindings {
      return normalize.element({
        "aria-label": "Error",
        "data-part": "error-indicator",
        "data-scope": "select",
        dir: prop("dir"),
        hidden: !prop("invalid"),
      })
    },

    getErrorTextBindings(props: IdRegistrationProps): SelectErrorTextBindings {
      scope.ids.register("errorText", props)
      return normalize.element({
        "aria-live": "polite",
        "data-part": "error-text",
        "data-scope": "select",
        dir: prop("dir"),
        hidden: !invalid,
        id: domIds.errorText(scope),
      })
    },

    getHiddenSelectBindings(props) {
      scope.ids.register("hiddenSelect", props)
      const value = context.get("value")
      const defaultValue = prop("multiple") ? value : value?.[0]
      return normalize.select({
        "aria-hidden": true,
        "aria-labelledby": domIds.label(scope),
        "data-part": "hidden-select",
        "data-scope": "select",
        defaultValue,
        dir: prop("dir"),
        disabled,
        form: prop("form"),
        id: domIds.hiddenSelect(scope),
        multiple: prop("multiple"),
        name: prop("name"),
        // Some browser extensions will focus the hidden select.
        // Let's forward the focus to the trigger.
        onFocus() {
          domEls.control(scope)?.focus({preventScroll: true})
        },
        required: !!prop("required"),
        style: visuallyHiddenStyle,
        tabIndex: -1,
      })
    },

    getHintBindings(props: IdRegistrationProps): SelectHintBindings {
      scope.ids.register("hint", props)
      return normalize.element({
        "data-disabled": booleanDataAttr(disabled),
        "data-part": "hint",
        "data-scope": "select",
        dir: prop("dir"),
        id: domIds.hint(scope),
      })
    },

    getIndicatorBindings() {
      return normalize.element({
        "aria-hidden": true,
        "data-disabled": booleanDataAttr(disabled),
        "data-invalid": booleanDataAttr(invalid),
        "data-part": "indicator",
        "data-readonly": booleanDataAttr(readOnly),
        "data-scope": "select",
        "data-state": open ? "open" : "closed",
        dir: prop("dir"),
      })
    },

    getItemBindings(props: ItemState): SelectItemBindings {
      return normalize.element({
        "aria-disabled": booleanAriaAttr(props.disabled),
        "aria-selected": props.selected,
        "data-disabled": booleanDataAttr(props.disabled),
        "data-highlighted": booleanDataAttr(props.highlighted),
        "data-part": "item",
        "data-scope": "select",
        "data-state": props.selected ? "checked" : "unchecked",
        "data-value": props.value,
        dir: prop("dir"),
        id: domIds.item(scope, props.value),
        onClick(event) {
          if (event.defaultPrevented) {
            return
          }
          if (props.disabled) {
            return
          }
          send({src: "pointerup", type: "ITEM.CLICK", value: props.value})
        },
        onPointerLeave(event) {
          if (props.disabled) {
            return
          }
          if (props.persistFocus) {
            return
          }
          if (event.pointerType !== "mouse") {
            return
          }

          const pointerMoved = machine?.event
            ?.previous()
            ?.type?.includes("POINTER")
          if (!pointerMoved) {
            return
          }
          send({type: "ITEM.POINTER_LEAVE"})
        },
        onPointerMove(event) {
          if (props.disabled || event.pointerType !== "mouse") {
            return
          }
          if (props.value === highlightedValue) {
            return
          }
          send({type: "ITEM.POINTER_MOVE", value: props.value})
        },
        role: "option",
      })
    },

    getItemGroupBindings({id}): SelectItemGroupBindings {
      return normalize.element({
        "aria-labelledby": domIds.itemGroupLabel(scope, id),
        "data-disabled": booleanDataAttr(disabled),
        "data-part": "item-group",
        "data-scope": "select",
        dir: prop("dir"),
        id: domIds.itemGroup(scope, id),
        role: "group",
      })
    },

    getItemGroupLabelBindings({htmlFor}) {
      return normalize.element({
        "data-part": "item-group-label",
        "data-scope": "select",
        dir: prop("dir"),
        id: domIds.itemGroupLabel(scope, htmlFor),
        role: "presentation",
      })
    },

    getItemIndicatorBindings(props: ItemState): SelectItemIndicatorBindings {
      return normalize.element({
        "aria-hidden": true,
        "data-part": "item-indicator",
        "data-scope": "select",
        "data-state": props.selected ? "checked" : "unchecked",
        dir: prop("dir"),
        hidden: !props.selected,
      })
    },

    getItemTextBindings(props: ItemState): SelectItemTextBindings {
      return normalize.element({
        "data-disabled": booleanDataAttr(props.disabled),
        "data-highlighted": booleanDataAttr(props.highlighted),
        "data-part": "item-text",
        "data-scope": "select",
        "data-state": props.selected ? "checked" : "unchecked",
        dir: prop("dir"),
      })
    },

    getLabelBindings(props) {
      scope.ids.register("label", props)
      return normalize.label({
        "data-disabled": booleanDataAttr(disabled),
        "data-invalid": booleanDataAttr(invalid),
        "data-part": "label",
        "data-readonly": booleanDataAttr(readOnly),
        "data-scope": "select",
        dir: prop("dir"),
        /**
         * the content element will not have rendered on SSR when this first
         * executes. It is immediately resolved on CSR.  The impact to accessibility
         * is minimal and quickly corrected.
         */
        htmlFor: domIds.hiddenSelect(scope),
        id: domIds.label(scope),
        onClick(event) {
          if (event.defaultPrevented) {
            return
          }
          if (disabled) {
            return
          }
          domEls.control(scope)?.focus({preventScroll: true})
        },
      })
    },

    getPositionerBindings(props) {
      scope.ids.register("positioner", props)
      return normalize.element({
        "data-part": "positioner",
        "data-scope": "select",
        dir: prop("dir"),
        id: domIds.positioner(scope),
        style: popperStyles.floating,
      })
    },

    getRootBindings(props): SelectRootBindings {
      scope.ids.register("root", props)
      return normalize.element({
        "data-invalid": booleanDataAttr(invalid),
        "data-part": "root",
        "data-readonly": booleanDataAttr(readOnly),
        "data-scope": "select",
        dir: prop("dir"),
        id: domIds.root(scope),
      })
    },

    getValueTextBindings() {
      return normalize.element({
        "data-disabled": booleanDataAttr(disabled),
        "data-focus": booleanDataAttr(focused),
        "data-invalid": booleanDataAttr(invalid),
        "data-multiple": booleanDataAttr(prop("multiple")),
        "data-part": "value-text",
        "data-scope": "select",
        dir: prop("dir"),
      })
    },
  }
}
