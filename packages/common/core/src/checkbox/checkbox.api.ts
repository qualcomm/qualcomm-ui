// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {isFocusVisible} from "@qualcomm-ui/dom/focus-visible"
import {
  getEventTarget,
  isSafari,
  visuallyHiddenStyle,
} from "@qualcomm-ui/dom/query"
import {
  booleanAriaAttr,
  booleanDataAttr,
  mergeAriaIds,
} from "@qualcomm-ui/utils/attributes"
import type {
  IdRegistrationProps,
  Machine,
  PropNormalizer,
} from "@qualcomm-ui/utils/machine"

import {checkboxAnatomy} from "./checkbox.anatomy"
import type {
  CheckboxApi,
  CheckboxControlBindings,
  CheckboxDataBindings,
  CheckboxErrorTextBindings,
  CheckboxHiddenInputBindings,
  CheckboxHintBindings,
  CheckboxIndicatorBindings,
  CheckboxLabelBindings,
  CheckboxRootBindings,
  CheckboxSchema,
} from "./checkbox.types"
import {domEls, domIds} from "./internal"

const parts = checkboxAnatomy.parts

export function createCheckboxApi(
  machine: Machine<CheckboxSchema>,
  normalize: PropNormalizer,
): CheckboxApi {
  const {computed, context, prop, scope, send} = machine
  const disabled = computed("disabled")
  const readOnly = prop("readOnly")
  const invalid = prop("invalid")

  const focused = !disabled && context.get("focused")
  const focusVisible = !disabled && context.get("focusVisible")

  const checked = context.get("checked")
  const indeterminate = computed("indeterminate")

  const commonAttrs: CheckboxDataBindings = {
    "data-active": booleanDataAttr(context.get("active")),
    "data-disabled": booleanDataAttr(disabled),
    "data-focus": booleanDataAttr(focused),
    "data-focus-visible": booleanDataAttr(focusVisible),
    "data-hover": booleanDataAttr(context.get("hovered")),
    "data-invalid": booleanDataAttr(invalid),
    "data-readonly": booleanDataAttr(readOnly),
    "data-state": checked
      ? "checked"
      : indeterminate
        ? "indeterminate"
        : "unchecked",
  }

  return {
    checked,
    disabled,
    focused,
    indeterminate,
    invalid,
    setChecked(checked: boolean) {
      send({checked, isTrusted: false, type: "CHECKED.SET"})
    },
    toggleChecked() {
      send({isTrusted: false, type: "CHECKED.TOGGLE"})
    },

    // group: element attr getters
    getControlBindings(props: IdRegistrationProps): CheckboxControlBindings {
      scope.ids.register("control", props)
      return normalize.element({
        ...parts.control,
        ...commonAttrs,
        "aria-hidden": "true",
        id: domIds.control(scope),
      })
    },
    getErrorTextBindings(
      props: IdRegistrationProps,
    ): CheckboxErrorTextBindings {
      scope.ids.register("errorText", props)
      return normalize.element({
        ...parts.errorText,
        ...commonAttrs,
        "aria-live": "polite",
        hidden: !invalid,
        id: domIds.errorText(scope),
      })
    },
    getHiddenInputBindings(
      props: IdRegistrationProps,
    ): CheckboxHiddenInputBindings {
      scope.ids.register("hiddenInput", props)
      return normalize.input({
        ...parts.hiddenInput,
        ...commonAttrs,
        "aria-invalid": booleanAriaAttr(invalid),
        "aria-labelledby": mergeAriaIds(
          domIds.label(scope),
          invalid ? domIds.errorText(scope) : undefined,
        ),
        defaultChecked: checked,
        disabled,
        form: prop("form"),
        id: domIds.hiddenInput(scope),
        name: prop("name"),
        onBlur() {
          send({
            context: {focused: false, focusVisible: false},
            type: "CONTEXT.SET",
          })
        },
        onClick(event) {
          if (readOnly) {
            event.preventDefault()
          }
          if (event.defaultPrevented) {
            return
          }
          const checked = event.currentTarget.checked
          send({checked, isTrusted: true, type: "CHECKED.SET"})
        },
        onFocus() {
          const focusVisible = isFocusVisible()
          send({context: {focused: true, focusVisible}, type: "CONTEXT.SET"})
        },
        required: prop("required"),
        style: visuallyHiddenStyle,
        type: "checkbox",
        value: prop("value"),
      })
    },
    getHintBindings(props: IdRegistrationProps): CheckboxHintBindings {
      scope.ids.register("hint", props)
      return normalize.element({
        ...parts.hint,
        ...commonAttrs,
        hidden: !!invalid,
        id: domIds.hint(scope),
      })
    },
    getIndicatorBindings(): CheckboxIndicatorBindings {
      return normalize.element({
        ...parts.indicator,
        ...commonAttrs,
        hidden: !indeterminate && !checked,
      })
    },
    getLabelBindings(props: IdRegistrationProps): CheckboxLabelBindings {
      scope.ids.register("label", props)
      return normalize.element({
        ...parts.label,
        ...commonAttrs,
        id: domIds.label(scope),
      })
    },
    getRootBindings(props: IdRegistrationProps): CheckboxRootBindings {
      scope.ids.register("root", props)
      return normalize.label({
        ...parts.root,
        ...commonAttrs,
        dir: prop("dir"),
        htmlFor: domIds.hiddenInput(scope),
        id: domIds.root(scope),
        onClick(event) {
          const target = getEventTarget<Element>(event)
          if (target === domEls.hiddenInput(scope)) {
            event.stopPropagation()
          }
          /**
           * Safari has historically had inconsistent behavior with programmatically
           * focusing hidden or visually obscured form elements
           */
          if (isSafari()) {
            domEls.hiddenInput(scope)?.focus()
          }
        },
        onPointerLeave() {
          if (disabled) {
            return
          }
          send({context: {hovered: false}, type: "CONTEXT.SET"})
        },
        onPointerMove() {
          if (disabled) {
            return
          }
          send({context: {hovered: true}, type: "CONTEXT.SET"})
        },
      })
    },
  }
}
