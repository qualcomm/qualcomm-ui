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
import {textAreaAnatomy} from "./text-area.anatomy"
import type {
  TextAreaApi,
  TextAreaCounterBindings,
  TextAreaErrorTextBindings,
  TextAreaHintBindings,
  TextAreaInputBindings,
  TextAreaLabelBindings,
  TextAreaRootBindings,
  TextAreaSchema,
} from "./text-area.types"

const parts = textAreaAnatomy.parts

export function createTextAreaApi(
  machine: Machine<TextAreaSchema>,
  normalize: PropNormalizer,
): TextAreaApi {
  const {computed, context, prop, scope, send} = machine

  const disabled = computed("disabled")
  const readOnly = prop("readOnly")
  const focused = context.get("focused")
  const invalid = prop("invalid")

  return {
    disabled,
    focusInput(): void {
      send({type: "INPUT.FOCUS"})
    },
    invalid,
    maxLength: prop("maxLength"),
    required: prop("required"),
    setValue(value: string) {
      send({type: "VALUE.SET", value})
    },
    value: context.get("value"),

    // group: prop getters
    getCounterBindings(props: IdRegistrationProps): TextAreaCounterBindings {
      scope.ids.register("counter", props)
      return normalize.element({
        ...parts.counter,
        "data-disabled": booleanDataAttr(disabled),
        "data-focus": booleanDataAttr(focused),
        "data-invalid": booleanDataAttr(invalid),
        "data-max": prop("maxLength"),
        dir: prop("dir"),
        id: domIds.counter(scope),
      })
    },
    getErrorTextBindings(
      props: IdRegistrationProps,
    ): TextAreaErrorTextBindings {
      scope.ids.register("errorText", props)
      return normalize.element({
        ...parts.errorText,
        "aria-live": "polite",
        dir: prop("dir"),
        hidden: !invalid,
        id: domIds.errorText(scope),
      })
    },
    getHintBindings(props: IdRegistrationProps): TextAreaHintBindings {
      scope.ids.register("hint", props)
      return normalize.element({
        ...parts.hint,
        "data-disabled": booleanDataAttr(disabled),
        dir: prop("dir"),
        hidden: !!invalid,
        id: domIds.hint(scope),
      })
    },
    /**
     * TODO
     * we probably want autoCorrect / spellCheck to be toggles (what about
     * autoComplete?)
     */
    getInputBindings(props: IdRegistrationProps): TextAreaInputBindings {
      scope.ids.register("input", props)
      return normalize.textarea({
        ...parts.input,
        "aria-describedby": ariaAttr(domIds.hint(scope)),
        "aria-invalid": booleanAriaAttr(invalid),
        "aria-labelledby": mergeAriaIds(
          domIds.label(scope),
          invalid ? domIds.errorText(scope) : undefined,
        ),
        autoComplete: "off",
        autoCorrect: "off",
        "data-disabled": booleanDataAttr(disabled),
        "data-empty": booleanDataAttr(!context.get("value")),
        "data-focus": booleanDataAttr(focused),
        "data-invalid": booleanDataAttr(invalid),
        "data-readonly": booleanDataAttr(readOnly),
        defaultValue: context.get("value"),
        dir: prop("dir"),
        disabled,
        form: prop("form"),
        id: domIds.input(scope),
        maxLength: prop("maxLength"),
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
        onClick: (event) => {
          if (event.defaultPrevented || disabled) {
            return
          }
          send({type: "INPUT.FOCUS"})
        },
        onFocus: () => {
          const focusVisible = isFocusVisible()
          send({focused: true, focusVisible, type: "FOCUSED.SET"})
        },
        readOnly,
        required: prop("required"),
        spellCheck: "false",
      })
    },
    getLabelBindings(props: IdRegistrationProps): TextAreaLabelBindings {
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
    getRootBindings(): TextAreaRootBindings {
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
