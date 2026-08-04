// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  getEventStep,
  isComposingEvent,
  isLeftClick,
  isModifierKey,
} from "@qualcomm-ui/dom/query"
import {booleanAriaAttr, booleanDataAttr} from "@qualcomm-ui/utils/attributes"
import type {
  EventKeyMap,
  IdRegistrationProps,
  Machine,
  PropNormalizer,
} from "@qualcomm-ui/utils/machine"

import {domEls, domIds} from "./internal/index.js"
import {numberInputAnatomy} from "./number-input.anatomy.js"
import type {
  NumberInputApi,
  NumberInputControlBindings,
  NumberInputDecrementTriggerBindings,
  NumberInputErrorIndicatorBindings,
  NumberInputErrorTextBindings,
  NumberInputHintBindings,
  NumberInputIncrementTriggerBindings,
  NumberInputInputBindings,
  NumberInputInputGroupBindings,
  NumberInputLabelBindings,
  NumberInputRootBindings,
  NumberInputSchema,
  NumberInputUnitSelectBindings,
  NumberInputValueTextBindings,
} from "./number-input.types.js"

const parts = numberInputAnatomy.parts

export function createNumberInputApi(
  machine: Machine<NumberInputSchema>,
  normalize: PropNormalizer,
): NumberInputApi {
  const {computed, context, prop, scope, send, state} = machine

  const focused = state.hasTag("focus")
  const disabled = computed("isDisabled")
  const readOnly = prop("readOnly")

  const empty = computed("isValueEmpty")
  const invalid = computed("isOutOfRange") || !!prop("invalid")

  const isIncrementDisabled = disabled || !computed("canIncrement") || readOnly
  const isDecrementDisabled = disabled || !computed("canDecrement") || readOnly

  const translations = prop("translations")

  return {
    clearValue() {
      send({type: "VALUE.CLEAR"})
    },
    decrement() {
      send({type: "VALUE.DECREMENT"})
    },
    empty,
    focus() {
      domEls.input(scope)?.focus()
    },
    focused,

    increment() {
      send({type: "VALUE.INCREMENT"})
    },

    invalid,

    required: prop("required"),

    setToMax() {
      send({type: "VALUE.SET", value: prop("max")})
    },

    setToMin() {
      send({type: "VALUE.SET", value: prop("min")})
    },

    setUnit(unit) {
      send({type: "UNIT.SET", unit})
    },

    setValue(value) {
      send({type: "VALUE.SET", value})
    },

    unit: context.get("unit"),

    unitOptions: prop("unitOptions"),

    value: computed("formattedValue"),

    valueAsNumber: computed("valueAsNumber"),

    // group: prop getters
    getControlBindings(): NumberInputControlBindings {
      return normalize.element({
        ...parts.control,
        "aria-disabled": booleanAriaAttr(disabled),
        "aria-invalid": booleanAriaAttr(invalid),
        "data-disabled": booleanDataAttr(disabled),
        "data-focus": booleanDataAttr(focused),
        "data-invalid": booleanDataAttr(invalid),
        dir: prop("dir"),
        role: "group",
      })
    },
    getDecrementTriggerBindings(props): NumberInputDecrementTriggerBindings {
      scope.ids.register("decrementTrigger", props)
      return normalize.button({
        ...parts.decrementTrigger,
        "aria-controls": domIds.input(scope),
        "aria-label": translations.decrementLabel,
        "data-disabled": booleanDataAttr(isDecrementDisabled),
        dir: prop("dir"),
        disabled: isDecrementDisabled,
        id: domIds.decrementTrigger(scope),
        onPointerDown(event) {
          if (isDecrementDisabled || !isLeftClick(event)) {
            return
          }
          send({
            hint: "decrement",
            pointerType: event.pointerType,
            type: "TRIGGER.PRESS_DOWN",
          })
          if (event.pointerType === "mouse") {
            event.preventDefault()
          }
          if (event.pointerType === "touch") {
            event.currentTarget?.focus({preventScroll: true})
          }
        },
        onPointerLeave() {
          if (isDecrementDisabled) {
            return
          }
          send({hint: "decrement", type: "TRIGGER.PRESS_UP"})
        },
        onPointerUp(event) {
          send({
            hint: "decrement",
            pointerType: event.pointerType,
            type: "TRIGGER.PRESS_UP",
          })
        },
        tabIndex: -1,
        type: "button",
      })
    },
    getErrorIndicatorBindings(): NumberInputErrorIndicatorBindings {
      return normalize.element({
        ...parts.errorIndicator,
        "aria-label": "Error",
        dir: prop("dir"),
        hidden: !prop("invalid"),
      })
    },
    getErrorTextBindings(
      props: IdRegistrationProps,
    ): NumberInputErrorTextBindings {
      scope.ids.register("errorText", props)
      return normalize.element({
        ...parts.errorText,
        "aria-live": "polite",
        dir: prop("dir"),
        hidden: !invalid,
        id: domIds.errorText(scope),
      })
    },
    getHintBindings(props: IdRegistrationProps): NumberInputHintBindings {
      scope.ids.register("hint", props)
      return normalize.element({
        ...parts.hint,
        "data-disabled": booleanDataAttr(disabled),
        dir: prop("dir"),
        hidden: !!invalid,
        id: domIds.hint(scope),
      })
    },
    getIncrementTriggerBindings(props): NumberInputIncrementTriggerBindings {
      scope.ids.register("incrementTrigger", props)
      return normalize.button({
        ...parts.incrementTrigger,
        "aria-controls": domIds.input(scope),
        "aria-label": translations.incrementLabel,
        "data-disabled": booleanDataAttr(isIncrementDisabled),
        dir: prop("dir"),
        disabled: isIncrementDisabled,
        id: domIds.incrementTrigger(scope),
        onPointerDown(event) {
          if (isIncrementDisabled || !isLeftClick(event)) {
            return
          }
          send({
            hint: "increment",
            pointerType: event.pointerType,
            type: "TRIGGER.PRESS_DOWN",
          })
          if (event.pointerType === "mouse") {
            event.preventDefault()
          }
          if (event.pointerType === "touch") {
            event.currentTarget?.focus({preventScroll: true})
          }
        },
        onPointerLeave(event) {
          send({
            hint: "increment",
            pointerType: event.pointerType,
            type: "TRIGGER.PRESS_UP",
          })
        },
        onPointerUp(event) {
          send({
            hint: "increment",
            pointerType: event.pointerType,
            type: "TRIGGER.PRESS_UP",
          })
        },
        tabIndex: -1,
        type: "button",
      })
    },
    getInputBindings(props): NumberInputInputBindings {
      scope.ids.register("input", props)
      return normalize.input({
        ...parts.input,
        "aria-invalid": booleanAriaAttr(invalid),
        "aria-labelledby": domIds.label(scope),
        "aria-roledescription": "numberfield",
        "aria-valuemax": prop("max"),
        "aria-valuemin": prop("min"),
        "aria-valuenow": Number.isNaN(computed("valueAsNumber"))
          ? undefined
          : computed("valueAsNumber"),
        "aria-valuetext": computed("valueText"),
        autoComplete: "off",
        autoCorrect: "off",
        "data-disabled": booleanDataAttr(disabled),
        "data-empty": booleanDataAttr(empty),
        "data-invalid": booleanDataAttr(invalid),
        defaultValue: computed("formattedValue"),
        dir: prop("dir"),
        disabled,
        form: prop("form"),
        id: domIds.input(scope),
        inputMode: prop("inputMode"),
        name: prop("name"),
        onBeforeInput(event) {
          try {
            const {selectionEnd, selectionStart, value} = event.currentTarget

            const nextValue =
              value.slice(0, selectionStart ?? undefined) +
              ((event as any).data ?? "") +
              value.slice(selectionEnd ?? undefined)
            const isValid = computed("parser").isValidPartialNumber(nextValue)

            if (!isValid) {
              event.preventDefault()
            }
          } catch {
            // noop
          }
        },
        onBlur() {
          send({type: "INPUT.BLUR"})
        },
        onFocus() {
          send({type: "INPUT.FOCUS"})
        },
        onInput(event) {
          send({hint: "set", target: event.currentTarget, type: "INPUT.CHANGE"})
        },
        onKeyDown(event) {
          if (event.defaultPrevented) {
            return
          }
          if (readOnly) {
            return
          }
          if (isComposingEvent(event)) {
            return
          }

          const step = getEventStep(event) * prop("step")

          const keyMap: EventKeyMap = {
            ArrowDown() {
              send({step, type: "INPUT.ARROW_DOWN"})
              event.preventDefault()
            },
            ArrowUp() {
              send({step, type: "INPUT.ARROW_UP"})
              event.preventDefault()
            },
            End() {
              if (isModifierKey(event)) {
                return
              }
              send({type: "INPUT.END"})
              event.preventDefault()
            },
            Enter() {
              send({type: "INPUT.ENTER"})
            },
            Home() {
              if (isModifierKey(event)) {
                return
              }
              send({type: "INPUT.HOME"})
              event.preventDefault()
            },
          }

          const exec = keyMap[event.key]
          exec?.(event)
        },
        pattern: prop("pattern"),
        readOnly,
        required: prop("required"),
        role: "spinbutton",
        spellCheck: "false",
        type: "text",
      })
    },
    getInputGroupBindings(): NumberInputInputGroupBindings {
      return normalize.element({
        ...parts.inputGroup,
        "data-disabled": booleanDataAttr(disabled),
        "data-focus": booleanDataAttr(focused),
        "data-invalid": booleanDataAttr(invalid),
        "data-readonly": booleanDataAttr(readOnly),
        dir: prop("dir"),
        onClick: (event) => {
          if (event.defaultPrevented || disabled) {
            return
          }
          send({type: "INPUT.FOCUS"})
        },
      })
    },
    getLabelBindings(props): NumberInputLabelBindings {
      scope.ids.register("label", props)
      return normalize.label({
        ...parts.label,
        "data-disabled": booleanDataAttr(disabled),
        "data-focus": booleanDataAttr(focused),
        "data-invalid": booleanDataAttr(invalid),
        dir: prop("dir"),
        htmlFor: domIds.input(scope),
        id: domIds.label(scope),
      })
    },
    getRootBindings(): NumberInputRootBindings {
      return normalize.element({
        ...parts.root,
        "data-disabled": booleanDataAttr(disabled),
        "data-focus": booleanDataAttr(focused),
        "data-invalid": booleanDataAttr(invalid),
        dir: prop("dir"),
      })
    },
    getUnitSelectBindings(): NumberInputUnitSelectBindings {
      return normalize.button({
        ...parts.unitSelect,
        "data-disabled": booleanDataAttr(disabled),
        "data-readonly": booleanDataAttr(readOnly),
        dir: prop("dir"),
        disabled: disabled || readOnly,
        type: "button",
      })
    },
    getValueTextBindings(): NumberInputValueTextBindings {
      return normalize.element({
        ...parts.valueText,
        "data-disabled": booleanDataAttr(disabled),
        "data-focus": booleanDataAttr(focused),
        "data-invalid": booleanDataAttr(invalid),
        dir: prop("dir"),
      })
    },
  }
}
