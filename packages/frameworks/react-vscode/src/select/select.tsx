import type {ReactElement, ReactNode} from "react"

import {useOptionalContentId} from "@qualcomm-ui/react-core/machine"
import {Portal, type PortalProps} from "@qualcomm-ui/react-core/portal"
import {useControlledId} from "@qualcomm-ui/react-core/state"

import {Icon} from "../icon"

import {SelectContent, type SelectContentProps} from "./select-content"
import {SelectControl, type SelectControlProps} from "./select-control"
import {SelectErrorText, type SelectErrorTextProps} from "./select-error-text"
import {
  SelectHiddenSelect,
  type SelectHiddenSelectProps,
} from "./select-hidden-select"
import {SelectHint, type SelectHintProps} from "./select-hint"
import {SelectLabel, type SelectLabelProps} from "./select-label"
import {SelectPositioner, type SelectPositionerProps} from "./select-positioner"
import {SelectRoot, type SelectRootProps} from "./select-root"
import {SelectValueText, type SelectValueTextProps} from "./select-value-text"

export interface SelectProps extends SelectRootProps {
  /**
   * {@link https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-label aria-label}
   * attribute, forwarded to the hidden select element.
   */
  "aria-label"?: string

  /**
   * {@link https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-labelledby aria-labelledby}
   * attribute, forwarded to the hidden select element. If you provide a {@link
   * label}, omit this prop.
   */
  "aria-labelledby"?: string

  /**
   * Props applied to the content element.
   */
  contentProps?: SelectContentProps

  /**
   * Props applied to the control element.
   */
  controlProps?: SelectControlProps

  /**
   * Optional error text describing the element when invalid.
   */
  errorText?: ReactNode

  /**
   * Props applied to the error text element.
   */
  errorTextProps?: SelectErrorTextProps

  /**
   * Optional hint describing the element.
   */
  hint?: ReactNode

  /**
   * Props applied to the hint element.
   */
  hintProps?: SelectHintProps

  /**
   * Optional label for the select.
   */
  label?: ReactNode

  /**
   * Props applied to the label element.
   */
  labelProps?: SelectLabelProps

  /**
   * Props applied to the portal element.
   */
  portalProps?: PortalProps

  /**
   * Props applied to the positioner element.
   */
  positionerProps?: SelectPositionerProps

  /**
   * Props applied to the hidden select element.
   */
  selectProps?: SelectHiddenSelectProps

  /**
   * Props applied to the value text element.
   */
  valueTextProps?: SelectValueTextProps
}

export function Select({
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  children,
  contentProps,
  controlProps,
  errorText,
  errorTextProps,
  hint,
  hintProps,
  label,
  labelProps,
  portalProps,
  positionerProps,
  selectProps: selectPropsProp,
  valueTextProps,
  ...props
}: SelectProps): ReactElement {
  const labelContent = label || labelProps?.children
  const hintContent = hint || hintProps?.children
  const errorTextContent = errorText || errorTextProps?.children

  const selectProps: SelectHiddenSelectProps = {...selectPropsProp}
  if (ariaLabel !== undefined) {
    selectProps["aria-label"] = ariaLabel
  }
  if (ariaLabelledBy !== undefined) {
    selectProps["aria-labelledby"] = ariaLabelledBy
  }

  const ids = {
    errorText: useOptionalContentId(errorTextContent, errorTextProps),
    hiddenSelect: useControlledId(selectProps?.id),
    hint: useOptionalContentId(hintContent, hintProps),
    label: useOptionalContentId(labelContent, labelProps),
    ...props.ids,
  }

  return (
    <SelectRoot {...props} ids={ids}>
      {labelContent ? (
        <SelectLabel {...labelProps} id={ids.label}>
          {labelContent}
        </SelectLabel>
      ) : null}
      <SelectControl {...controlProps}>
        <SelectValueText {...valueTextProps} />
        <Icon
          className="vs-select__control__icon"
          icon="chevron-down"
          size={12}
        />
      </SelectControl>
      <SelectHiddenSelect {...selectProps} id={ids.hiddenSelect} />
      <Portal {...portalProps}>
        <SelectPositioner {...positionerProps}>
          <SelectContent {...contentProps}>{children}</SelectContent>
        </SelectPositioner>
      </Portal>
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
    </SelectRoot>
  )
}
