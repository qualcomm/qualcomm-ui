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
  TextInputScopeAttribute,
} from "./text-input.types"

const commonBindings: TextInputScopeAttribute = {
  "data-scope": "text-input",
}

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
        ...commonBindings,
        "aria-label": "Clear input",
        "data-disabled": booleanDataAttr(disabled),
        "data-part": "clear-trigger",
        dir: prop("dir"),
        disabled,
        onClick: (event) => {
          if (!interactive || event.defaultPrevented) {
            return
          }
          send({type: "VALUE.SET", value: ""})
          send({type: "INPUT.FOCUS"})
        },
      })
    },

    getErrorIndicatorBindings(): TextInputErrorIndicatorBindings {
      return normalize.element({
        ...commonBindings,
        "aria-label": "Error",
        "data-part": "error-indicator",
        dir: prop("dir"),
        hidden: !prop("invalid"),
      })
    },

    getErrorTextBindings(
      props: IdRegistrationProps,
    ): TextInputErrorTextBindings {
      scope.ids.register("errorText", props)
      return normalize.element({
        ...commonBindings,
        "aria-live": "polite",
        "data-part": "error-text",
        dir: prop("dir"),
        hidden: !invalid,
        id: domIds.errorText(scope),
      })
    },

    getHintBindings(props: IdRegistrationProps): TextInputHintBindings {
      scope.ids.register("hint", props)
      return normalize.element({
        ...commonBindings,
        "data-disabled": booleanDataAttr(disabled),
        "data-part": "hint",
        dir: prop("dir"),
        id: domIds.hint(scope),
      })
    },

    getInputBindings(props: IdRegistrationProps): TextInputInputBindings {
      scope.ids.register("input", props)
      return normalize.input({
        ...commonBindings,
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
        "data-part": "input",
        "data-readonly": booleanDataAttr(readOnly),
        dir: prop("dir"),
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
        value: context.get("value"),
      })
    },
    getInputGroupBindings(): TextInputInputGroupBindings {
      return normalize.element({
        ...commonBindings,
        "data-disabled": booleanDataAttr(disabled),
        "data-focus": booleanDataAttr(focused),
        "data-invalid": booleanDataAttr(invalid),
        "data-part": "input-group",
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
    getLabelBindings(props: IdRegistrationProps): TextInputLabelBindings {
      scope.ids.register("label", props)
      return normalize.label({
        ...commonBindings,
        "data-disabled": booleanDataAttr(disabled),
        "data-focus": booleanDataAttr(focused),
        "data-invalid": booleanDataAttr(invalid),
        "data-part": "label",
        dir: prop("dir"),
        htmlFor: domIds.input(scope),
        id: domIds.label(scope),
      })
    },

    getRootBindings(): TextInputRootBindings {
      return normalize.element({
        ...commonBindings,
        "data-disabled": booleanDataAttr(disabled),
        "data-focus": booleanDataAttr(focused),
        "data-invalid": booleanDataAttr(invalid),
        "data-part": "root",
        dir: prop("dir"),
      })
    },
  }
}
