import type {ReactElement, ReactNode} from "react"

import type {CheckboxElementIds} from "@qualcomm-ui/core/checkbox"
import {useOptionalContentId} from "@qualcomm-ui/react-core/machine"
import {useControlledId} from "@qualcomm-ui/react-core/state"

import {CheckboxControl, type CheckboxControlProps} from "./checkbox-control"
import {
  CheckboxErrorText,
  type CheckboxErrorTextProps,
} from "./checkbox-error-text"
import {
  CheckboxHiddenInput,
  type CheckboxHiddenInputProps,
} from "./checkbox-hidden-input"
import {CheckboxHint, type CheckboxHintProps} from "./checkbox-hint"
import {
  CheckboxIndicator,
  type CheckboxIndicatorProps,
} from "./checkbox-indicator"
import {CheckboxLabel, type CheckboxLabelProps} from "./checkbox-label"
import {CheckboxRoot, type CheckboxRootProps} from "./checkbox-root"

export interface CheckboxProps extends CheckboxRootProps {
  /**
   * {@link https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-label aria-label}
   * attribute, forwarded to the hidden input element.
   */
  "aria-label"?: string | undefined

  /**
   * {@link https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-labelledby aria-labelledby}
   * attribute, forwarded to the hidden input element. If you provide a {@link
   * label}, omit this prop.
   */
  "aria-labelledby"?: string | undefined

  /**
   * The simple Checkbox doesn't support children.
   */
  children?: never

  /**
   * Props applied to the control element.
   * @inheritDoc
   */
  controlProps?: CheckboxControlProps

  /**
   * Optional error that describes the element when {@link invalid} is true.
   */
  errorText?: ReactNode

  /**
   * Props applied to the error text element.
   * @inheritDoc
   */
  errorTextProps?: CheckboxErrorTextProps

  /**
   * Props applied to the hidden input element.
   * @inheritDoc
   */
  hiddenInputProps?: CheckboxHiddenInputProps

  /**
   * Optional hint text that describes the element.
   */
  hint?: ReactNode

  /**
   * Props applied to the hint element.
   * @inheritDoc
   */
  hintProps?: CheckboxHintProps

  /**
   * Props applied to the indicator element.
   * @inheritDoc
   */
  indicatorProps?: CheckboxIndicatorProps

  /**
   * Optional label describing the element. Recommended. This element is
   * automatically associated with the component's input element for
   * accessibility.
   */
  label?: ReactNode

  /**
   * Props applied to the label element.
   * @inheritDoc
   */
  labelProps?: CheckboxLabelProps
}

export function Checkbox({
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  controlProps,
  errorText,
  errorTextProps,
  hiddenInputProps: hiddenInputPropsProp,
  hint,
  hintProps,
  indicatorProps,
  label,
  labelProps,
  ...props
}: CheckboxProps): ReactElement {
  const labelContent = label || labelProps?.children
  const errorTextContent = errorText || errorTextProps?.children
  const hintContent = hint || hintProps?.children

  const hiddenInputProps = {
    ...hiddenInputPropsProp,
  }

  if (ariaLabel !== undefined) {
    hiddenInputProps["aria-label"] = ariaLabel
  }
  if (ariaLabelledBy !== undefined) {
    hiddenInputProps["aria-labelledby"] = ariaLabelledBy
  }

  const ids: Partial<CheckboxElementIds> = {
    errorText: useOptionalContentId(errorTextContent, errorTextProps),
    hiddenInput: useControlledId(hiddenInputProps?.id),
    hint: useOptionalContentId(hintContent, hintProps),
    label: useOptionalContentId(labelContent, labelProps),
    root: useControlledId(props.id),
    ...props.ids,
  }

  return (
    <CheckboxRoot {...props} id={ids.root} ids={ids}>
      <CheckboxHiddenInput {...hiddenInputProps} id={ids.hiddenInput} />
      <CheckboxControl {...controlProps}>
        <CheckboxIndicator {...indicatorProps} />
      </CheckboxControl>
      {labelContent ? (
        <CheckboxLabel {...labelProps} id={ids.label}>
          {labelContent}
        </CheckboxLabel>
      ) : null}
      {hintContent ? (
        <CheckboxHint {...hintProps} id={ids.hint}>
          {hintContent}
        </CheckboxHint>
      ) : null}
      {errorTextContent ? (
        <CheckboxErrorText {...errorTextProps} id={ids.errorText}>
          {errorTextContent}
        </CheckboxErrorText>
      ) : null}
    </CheckboxRoot>
  )
}
