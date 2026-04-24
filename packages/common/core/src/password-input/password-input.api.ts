// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {isFocusVisible} from "@qualcomm-ui/dom/focus-visible"
import {
  ariaAttr,
  booleanAriaAttr,
  booleanDataAttr,
  mergeAriaIds,
} from "@qualcomm-ui/utils/attributes"
import type {
  IdRegistrationProps,
  Machine,
  PropNormalizer,
} from "@qualcomm-ui/utils/machine"

import {domIds} from "./internal"
import {passwordInputAnatomy} from "./password-input.anatomy"
import type {
  PasswordInputApi,
  PasswordInputClearTriggerBindings,
  PasswordInputErrorIndicatorBindings,
  PasswordInputErrorTextBindings,
  PasswordInputHintBindings,
  PasswordInputInputBindings,
  PasswordInputInputGroupBindings,
  PasswordInputLabelBindings,
  PasswordInputRootBindings,
  PasswordInputSchema,
  PasswordInputVisibilityTriggerBindings,
} from "./password-input.types"

const parts = passwordInputAnatomy.parts

export function createPasswordInputApi(
  machine: Machine<PasswordInputSchema>,
  normalize: PropNormalizer,
): PasswordInputApi {
  const {computed, context, prop, scope, send} = machine

  const disabled = computed("disabled")
  const focused = context.get("focused")
  const invalid = prop("invalid")
  const readOnly = prop("readOnly")
  const interactive = !(readOnly || disabled)

  const visible = context.get("visible")

  return {
    disabled,
    focusInput(): void {
      send({type: "INPUT.FOCUS"})
    },
    invalid,
    required: prop("required"),
    setValue(value: string) {
      send({type: "VALUE.SET", value})
    },
    setVisible(visible) {
      send({type: "VISIBILITY.SET", visible})
    },
    toggleVisible() {
      send({type: "VISIBILITY.SET", visible: !visible})
    },
    value: context.get("value"),
    visible,

    // group: prop getters
    getClearTriggerBindings(): PasswordInputClearTriggerBindings {
      return normalize.button({
        ...parts.clearTrigger,
        "aria-label": "Clear input",
        "data-disabled": booleanDataAttr(disabled),
        disabled,
        onClick: (event) => {
          if (!interactive || event.defaultPrevented) {
            return
          }
          send({type: "VALUE.SET", value: ""})
        },
        type: "button",
      })
    },

    getErrorIndicatorBindings(): PasswordInputErrorIndicatorBindings {
      return normalize.element({
        ...parts.errorIndicator,
        "aria-label": "Error",
        hidden: !prop("invalid"),
      })
    },

    getErrorTextBindings(
      props: IdRegistrationProps,
    ): PasswordInputErrorTextBindings {
      scope.ids.register("errorText", props)
      return normalize.element({
        ...parts.errorText,
        "aria-live": "polite",
        hidden: !invalid,
        id: domIds.errorText(scope),
      })
    },

    getHintBindings(props: IdRegistrationProps): PasswordInputHintBindings {
      scope.ids.register("hint", props)
      return normalize.element({
        ...parts.hint,
        "data-disabled": booleanDataAttr(disabled),
        hidden: !!invalid,
        id: domIds.hint(scope),
      })
    },

    getInputBindings(props: IdRegistrationProps): PasswordInputInputBindings {
      scope.ids.register("input", props)
      return normalize.input({
        ...parts.input,
        "aria-describedby": ariaAttr(domIds.hint(scope)),
        "aria-invalid": booleanAriaAttr(invalid),
        "aria-labelledby": mergeAriaIds(
          domIds.label(scope),
          invalid ? domIds.errorText(scope) : undefined,
        ),
        autoComplete: prop("autoComplete"),
        autoCorrect: "off",
        "data-empty": booleanDataAttr(!context.get("value")),
        "data-focus": booleanDataAttr(focused),
        "data-invalid": booleanDataAttr(invalid),
        "data-readonly": booleanDataAttr(readOnly),
        "data-state": visible ? "visible" : "hidden",
        defaultValue: context.get("value"),
        disabled,
        form: prop("form"),
        id: domIds.input(scope),
        name: prop("name"),
        onBlur: () => {
          send({
            focused: false,
            focusVisible: false,
            type: "FOCUSED.SET",
          })
        },
        onChange: (event) => {
          send({type: "VALUE.SET", value: event.target.value})
        },
        onFocus: () => {
          const focusVisible = isFocusVisible()
          send({focused: true, focusVisible, type: "FOCUSED.SET"})
        },
        readOnly,
        required: prop("required"),
        spellCheck: "false",
        type: visible ? "text" : "password",
      })
    },

    getInputGroupBindings(): PasswordInputInputGroupBindings {
      return normalize.element({
        ...parts.inputGroup,
        "data-disabled": booleanDataAttr(disabled),
        "data-focus": booleanDataAttr(focused),
        "data-invalid": booleanDataAttr(invalid),
        "data-readonly": booleanDataAttr(readOnly),
        onClick: (event) => {
          if (event.defaultPrevented || disabled) {
            return
          }
          send({type: "INPUT.FOCUS"})
        },
      })
    },

    getLabelBindings(props: IdRegistrationProps): PasswordInputLabelBindings {
      scope.ids.register("label", props)
      return normalize.label({
        ...parts.label,
        "data-disabled": booleanDataAttr(disabled),
        "data-focus": booleanDataAttr(focused),
        "data-invalid": booleanDataAttr(invalid),
        htmlFor: domIds.input(scope),
        id: domIds.label(scope),
      })
    },

    getRootBindings(): PasswordInputRootBindings {
      return normalize.element({
        ...parts.root,
        "data-disabled": booleanDataAttr(disabled),
        "data-focus": booleanDataAttr(focused),
        "data-invalid": booleanDataAttr(invalid),
        dir: prop("dir"),
      })
    },

    getVisibilityTriggerBindings(
      props: IdRegistrationProps,
    ): PasswordInputVisibilityTriggerBindings {
      scope.ids.register("visibilityTrigger", props)
      return normalize.button({
        ...parts.visibilityTrigger,
        "aria-controls": domIds.input(scope),
        "aria-expanded": booleanAriaAttr(visible),
        "aria-label":
          prop("translations")?.visibilityTrigger?.(visible) ||
          "Toggle visibility",
        "data-disabled": booleanDataAttr(disabled),
        "data-readonly": booleanDataAttr(readOnly),
        "data-state": visible ? "visible" : "hidden",
        disabled,
        id: domIds.visibilityTrigger(scope),
        onPointerDown(event) {
          if (event.defaultPrevented || !interactive) {
            return
          }
          send({type: "TRIGGER.CLICK"})
        },
        tabIndex: -1,
        type: "button",
      })
    },
  }
}
