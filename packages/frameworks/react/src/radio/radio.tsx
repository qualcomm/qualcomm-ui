// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

import {RadioControl, type RadioControlProps} from "./radio-control.js"
import {
  RadioHiddenInput,
  type RadioHiddenInputProps,
} from "./radio-hidden-input.js"
import {RadioHint, type RadioHintProps} from "./radio-hint.js"
import {RadioLabel, type RadioLabelProps} from "./radio-label.js"
import {RadioRoot, type RadioRootProps} from "./radio-root.js"

export interface RadioProps extends RadioRootProps {
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
   * The simple Radio doesn't support children.
   */
  children?: never

  /**
   * Props applied to the control element.
   * @inheritDoc
   */
  controlProps?: RadioControlProps

  /**
   * Props applied to the hidden input element.
   * @inheritDoc
   */
  hiddenInputProps?: RadioHiddenInputProps

  /**
   * Optional hint text that describes the element.
   */
  hint?: ReactNode

  /**
   * Props applied to the hint element.
   * @inheritDoc
   */
  hintProps?: RadioHintProps

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
  labelProps?: RadioLabelProps
}

export function Radio({
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  controlProps,
  hiddenInputProps: hiddenInputPropsProp,
  hint,
  hintProps,
  label,
  labelProps,
  ...props
}: RadioProps): ReactElement {
  const labelContent = label || labelProps?.children
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

  return (
    <RadioRoot {...props}>
      <RadioHiddenInput {...hiddenInputProps} />
      <RadioControl {...controlProps} />
      {labelContent ? (
        <RadioLabel {...labelProps}>{labelContent}</RadioLabel>
      ) : null}
      {hintContent ? <RadioHint {...hintProps}>{hintContent}</RadioHint> : null}
    </RadioRoot>
  )
}
