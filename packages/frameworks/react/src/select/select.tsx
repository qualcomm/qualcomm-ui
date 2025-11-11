// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

import {useOptionalContentId} from "@qualcomm-ui/react-core/machine"
import {Portal, type PortalProps} from "@qualcomm-ui/react-core/portal"
import {useControlledId} from "@qualcomm-ui/react-core/state"

import {
  SelectClearTrigger,
  type SelectClearTriggerProps,
} from "./select-clear-trigger"
import {SelectContent, type SelectContentProps} from "./select-content"
import {SelectControl, type SelectControlProps} from "./select-control"
import {
  SelectErrorIndicator,
  type SelectErrorIndicatorProps,
} from "./select-error-indicator"
import {SelectErrorText, type SelectErrorTextProps} from "./select-error-text"
import {
  SelectHiddenSelect,
  type SelectHiddenSelectProps,
} from "./select-hidden-select"
import {SelectHint, type SelectHintProps} from "./select-hint"
import {SelectIndicator, type SelectIndicatorProps} from "./select-indicator"
import {SelectItems} from "./select-items"
import {SelectLabel, type SelectLabelProps} from "./select-label"
import {SelectPositioner, type SelectPositionerProps} from "./select-positioner"
import {SelectRoot, type SelectRootProps} from "./select-root"
import {SelectValueText, type SelectValueTextProps} from "./select-value-text"

export interface SelectProps extends SelectRootProps {
  /**
   * When `true`, renders a clear button that resets the input value on click.
   * The button only appears when the input has a value.
   *
   * @default true
   */
  clearable?: boolean

  /**
   * Props applied to the clear trigger element.
   *
   * @inheritDoc
   */
  clearTriggerProps?: SelectClearTriggerProps

  /**
   * Props applied to the content element.
   *
   * @inheritDoc
   */
  contentProps?: SelectContentProps

  /**
   * Props applied to the trigger element.
   *
   * @inheritDoc
   */
  controlProps?: SelectControlProps

  /**
   * Props applied to the error indicator element.
   *
   * @inheritDoc
   */
  errorIndicatorProps?: SelectErrorIndicatorProps

  /**
   * Optional error that describes the element when {@link invalid} is true.
   */
  errorText?: ReactNode

  /**
   * Props applied to the error text element.
   *
   * @inheritDoc
   */
  errorTextProps?: SelectErrorTextProps

  /**
   * Optional hint describing the element. This element is automatically
   * associated with the component's input element for accessibility.
   */
  hint?: ReactNode

  /**
   * Props applied to the label element.
   *
   * @inheritDoc
   */
  hintProps?: SelectHintProps

  /**
   * Props applied to the indicator element.
   *
   * @inheritDoc
   */
  indicatorProps?: SelectIndicatorProps

  /**
   * Optional label describing the element. Recommended. This element is
   * automatically associated with the component's input element for
   * accessibility.
   */
  label?: ReactNode

  /**
   * Props applied to the label element.
   *
   * @inheritDoc
   */
  labelProps?: SelectLabelProps

  /**
   * Props applied to the portal element.
   *
   * @inheritDoc
   */
  portalProps?: PortalProps

  /**
   * Props applied to the positioner element.
   *
   * @inheritDoc
   */
  positionerProps?: SelectPositionerProps

  /**
   * Props applied to the select element.
   *
   * @inheritDoc
   */
  selectProps?: SelectHiddenSelectProps

  /**
   * Props applied to the value text element.
   *
   * @inheritDoc
   */
  valueTextProps?: SelectValueTextProps
}

export function Select({
  clearable = true,
  clearTriggerProps,
  contentProps,
  controlProps,
  errorIndicatorProps,
  errorText,
  errorTextProps,
  hint,
  hintProps,
  indicatorProps,
  label,
  labelProps,
  portalProps,
  positionerProps,
  selectProps,
  valueTextProps,
  ...props
}: SelectProps): ReactElement {
  const labelContent = label || labelProps?.children
  const hintContent = hint || hintProps?.children
  const errorTextContent = errorText || errorTextProps?.children

  const ids = {
    clearTrigger: useOptionalContentId(clearable, clearTriggerProps),
    content: useControlledId(contentProps?.id),
    control: useControlledId(controlProps?.id),
    errorText: useOptionalContentId(errorTextContent, errorTextProps),
    hiddenSelect: useControlledId(selectProps?.id),
    hint: useOptionalContentId(hintContent, hintProps),
    label: useOptionalContentId(labelContent, labelProps),
    positioner: useControlledId(positionerProps?.id),
    root: useControlledId(props.id),
    ...props.ids,
  }

  return (
    <SelectRoot {...props} id={ids.root} ids={ids}>
      <SelectLabel {...labelProps} id={ids.label}>
        {labelContent}
      </SelectLabel>
      <SelectControl {...controlProps} id={ids.control}>
        <SelectValueText {...valueTextProps} />
        {clearable ? (
          <SelectClearTrigger {...clearTriggerProps} id={ids.clearTrigger} />
        ) : null}
        <SelectErrorIndicator {...errorIndicatorProps} />
        <SelectIndicator {...indicatorProps} />
      </SelectControl>

      {hintContent ? (
        <SelectHint {...hintProps} id={ids.hint}>
          {hintContent}
        </SelectHint>
      ) : null}

      {errorTextContent ? (
        <SelectErrorText {...errorTextProps} id={ids.errorText}>
          {errorTextContent}
        </SelectErrorText>
      ) : null}

      <SelectHiddenSelect {...selectProps} id={ids.hiddenSelect} />

      <Portal {...portalProps}>
        <SelectPositioner {...positionerProps} id={ids.positioner}>
          <SelectContent {...contentProps} id={ids.content}>
            <SelectItems />
          </SelectContent>
        </SelectPositioner>
      </Portal>
    </SelectRoot>
  )
}
