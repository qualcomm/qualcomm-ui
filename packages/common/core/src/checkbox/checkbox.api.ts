import {isFocusVisible} from "@qualcomm-ui/dom/focus-visible"
import {getEventTarget, isSafari, visuallyHiddenStyle} from "@qualcomm-ui/dom/query"
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

import type {
  CheckboxApi,
  CheckboxControlBindings,
  CheckboxDataBindings,
  CheckboxErrorTextBindings,
  CheckboxHiddenInputBindings,
  CheckboxIndicatorBindings,
  CheckboxLabelBindings,
  CheckboxRootBindings,
  CheckboxSchema,
  CheckboxScopeAttribute,
} from "./checkbox.types"
import {domEls, domIds} from "./internal"

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

  const commonAttrs: CheckboxDataBindings & CheckboxScopeAttribute = {
    "data-active": booleanDataAttr(context.get("active")),
    "data-disabled": booleanDataAttr(disabled),
    "data-focus": booleanDataAttr(focused),
    "data-focus-visible": booleanDataAttr(focusVisible),
    "data-hover": booleanDataAttr(context.get("hovered")),
    "data-invalid": booleanDataAttr(invalid),
    "data-readonly": booleanDataAttr(readOnly),
    "data-scope": "checkbox",
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
        ...commonAttrs,
        "aria-hidden": "true",
        "data-part": "control",
        dir: prop("dir"),
        id: domIds.control(scope),
      })
    },
    getErrorTextBindings(
      props: IdRegistrationProps,
    ): CheckboxErrorTextBindings {
      scope.ids.register("errorText", props)
      return normalize.element({
        ...commonAttrs,
        "aria-live": "polite",
        "data-part": "error-text",
        dir: prop("dir"),
        hidden: !invalid,
        id: domIds.errorText(scope),
      })
    },
    getHiddenInputBindings(
      props: IdRegistrationProps,
    ): CheckboxHiddenInputBindings {
      scope.ids.register("hiddenInput", props)
      return normalize.input({
        ...commonAttrs,
        "aria-invalid": booleanAriaAttr(invalid),
        "aria-labelledby": mergeAriaIds(
          domIds.label(scope),
          invalid ? domIds.errorText(scope) : undefined,
        ),
        "data-part": "hidden-input",
        defaultChecked: checked,
        dir: prop("dir"),
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
    getIndicatorBindings(): CheckboxIndicatorBindings {
      return normalize.element({
        ...commonAttrs,
        "data-part": "indicator",
        dir: prop("dir"),
        hidden: !indeterminate && !checked,
      })
    },
    getLabelBindings(props: IdRegistrationProps): CheckboxLabelBindings {
      scope.ids.register("label", props)
      return normalize.element({
        ...commonAttrs,
        "data-part": "label",
        dir: prop("dir"),
        id: domIds.label(scope),
      })
    },
    getRootBindings(props: IdRegistrationProps): CheckboxRootBindings {
      scope.ids.register("root", props)
      return normalize.label({
        ...commonAttrs,
        "data-part": "root",
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
