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

import {domIds} from "./internal/index.js"
import {textInputAnatomy} from "./text-input.anatomy.js"
import type {
  TextInputApi,
  TextInputClearTriggerBindings,
  TextInputErrorIndicatorBindings,
  TextInputErrorTextBindings,
  TextInputHintBindings,
  TextInputInputBindings,
  TextInputInputGroupBindings,
  TextInputLabelBindings,
  TextInputRootBindings,
  TextInputSchema,
} from "./text-input.types.js"

const parts = textInputAnatomy.parts

export function createTextInputApi(
  machine: Machine<TextInputSchema>,
  normalize: PropNormalizer,
): TextInputApi {
  const {computed, context, prop, scope, send} = machine

  const disabled = computed("disabled")
  const readOnly = prop("readOnly")
  const focused = context.get("focused")
  const invalid = prop("invalid")
  const interactive = !(readOnly || disabled)

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
    value: context.get("value"),

    // group: prop getters
    getClearTriggerBindings(): TextInputClearTriggerBindings {
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
          send({type: "INPUT.FOCUS"})
        },
        type: "button",
      })
    },

    getErrorIndicatorBindings(): TextInputErrorIndicatorBindings {
      return normalize.element({
        ...parts.errorIndicator,
        "aria-label": "Error",
        hidden: !prop("invalid"),
      })
    },

    getErrorTextBindings(
      props: IdRegistrationProps,
    ): TextInputErrorTextBindings {
      scope.ids.register("errorText", props)
      return normalize.element({
        ...parts.errorText,
        "aria-live": "polite",
        hidden: !invalid,
        id: domIds.errorText(scope),
      })
    },

    getHintBindings(props: IdRegistrationProps): TextInputHintBindings {
      scope.ids.register("hint", props)
      return normalize.element({
        ...parts.hint,
        "data-disabled": booleanDataAttr(disabled),
        hidden: !!invalid,
        id: domIds.hint(scope),
      })
    },

    getInputBindings(props: IdRegistrationProps): TextInputInputBindings {
      scope.ids.register("input", props)
      return normalize.input({
        ...parts.input,
        "aria-describedby": ariaAttr(domIds.hint(scope)),
        "aria-invalid": booleanAriaAttr(invalid),
        "aria-labelledby": mergeAriaIds(
          domIds.label(scope),
          invalid ? domIds.errorText(scope) : undefined,
        ),
        autoComplete: "off",
        autoCorrect: "off",
        "data-empty": booleanDataAttr(!context.get("value")),
        "data-focus": booleanDataAttr(focused),
        "data-invalid": booleanDataAttr(invalid),
        "data-readonly": booleanDataAttr(readOnly),
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
        type: "text",
      })
    },
    getInputGroupBindings(): TextInputInputGroupBindings {
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
    getLabelBindings(props: IdRegistrationProps): TextInputLabelBindings {
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

    getRootBindings(): TextInputRootBindings {
      return normalize.element({
        ...parts.root,
        "data-disabled": booleanDataAttr(disabled),
        "data-focus": booleanDataAttr(focused),
        "data-invalid": booleanDataAttr(invalid),
        dir: prop("dir"),
      })
    },
  }
}
