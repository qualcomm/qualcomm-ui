// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

import {useOptionalContentId} from "@qualcomm-ui/react-core/machine"
import {Portal, type PortalProps} from "@qualcomm-ui/react-core/portal"
import {useControlledId} from "@qualcomm-ui/react-core/state"
import type {CollectionItem} from "@qualcomm-ui/utils/collection"

import {
  ComboboxClearTrigger,
  type ComboboxClearTriggerProps,
} from "./combobox-clear-trigger"
import {ComboboxContent, type ComboboxContentProps} from "./combobox-content"
import {ComboboxControl, type ComboboxControlProps} from "./combobox-control"
import {ComboboxEmpty, type ComboboxEmptyProps} from "./combobox-empty"
import {
  ComboboxErrorIndicator,
  type ComboboxErrorIndicatorProps,
} from "./combobox-error-indicator"
import {
  ComboboxErrorText,
  type ComboboxErrorTextProps,
} from "./combobox-error-text"
import {ComboboxHint, type ComboboxHintProps} from "./combobox-hint"
import {ComboboxInput, type ComboboxInputProps} from "./combobox-input"
import {type ComboboxItemRenderProp, ComboboxItems} from "./combobox-items"
import {ComboboxLabel, type ComboboxLabelProps} from "./combobox-label"
import {
  ComboboxPositioner,
  type ComboboxPositionerProps,
} from "./combobox-positioner"
import {ComboboxRoot, type ComboboxRootProps} from "./combobox-root"
import {ComboboxTrigger, type ComboboxTriggerProps} from "./combobox-trigger"
import {ComboboxVirtualContent} from "./combobox-virtual-content"

export interface ComboboxProps<T extends CollectionItem>
  extends ComboboxRootProps<T> {
  /**
   * Props applied to the clear trigger element. To prevent this element from
   * rendering, pass `{hidden: true}`
   *
   * @inheritDoc
   */
  clearTriggerProps?: ComboboxClearTriggerProps

  /**
   * Props applied to the content element.
   *
   * @inheritDoc
   */
  contentProps?: ComboboxContentProps

  /**
   * Props applied to the control element.
   *
   * @inheritDoc
   */
  controlProps?: ComboboxControlProps

  /**
   * Label to render when the list is empty.
   *
   * @default "No results found"
   */
  emptyMessage?: ReactNode

  /**
   * Props applied to the component that renders the empty message.
   */
  emptyProps?: ComboboxEmptyProps

  /**
   * Props applied to the error indicator element.
   *
   * @inheritDoc
   */
  errorIndicatorProps?: ComboboxErrorIndicatorProps

  /**
   * Optional error that describes the element when {@link invalid} is true.
   */
  errorText?: string

  /**
   * Props applied to the error text element.
   *
   * @inheritDoc
   */
  errorTextProps?: ComboboxErrorTextProps

  /**
   * Set to `true` to highlight option text matches during filtering.
   */
  highlightMatchingText?: boolean

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
  hintProps?: ComboboxHintProps

  /**
   * Props applied to the select element.
   *
   * @inheritDoc
   */
  inputProps?: ComboboxInputProps

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
  labelProps?: ComboboxLabelProps

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
  positionerProps?: ComboboxPositionerProps

  /**
   * Customize the rendering of the combobox list items.
   */
  renderItem?: ComboboxItemRenderProp<T>

  /**
   * Props applied to the trigger element.
   *
   * @inheritDoc
   */
  triggerProps?: ComboboxTriggerProps

  /**
   * When `true`, the list items will be virtually rendered. Useful for large lists.
   */
  virtual?: boolean
}

export function Combobox<T extends CollectionItem = CollectionItem>({
  clearTriggerProps,
  contentProps,
  controlProps,
  emptyMessage,
  emptyProps,
  errorIndicatorProps,
  errorText,
  errorTextProps,
  highlightMatchingText,
  hint,
  hintProps,
  inputProps,
  label,
  labelProps,
  portalProps,
  positionerProps,
  renderItem,
  triggerProps,
  virtual,
  ...props
}: ComboboxProps<T>): ReactElement {
  const emptyContent =
    emptyMessage || emptyProps?.children || "No results found"
  const labelContent = label || labelProps?.children
  const hintContent = hint || hintProps?.children
  const errorTextContent = errorText || errorTextProps?.children

  const ids = {
    clearTrigger: useOptionalContentId(
      !clearTriggerProps?.hidden,
      clearTriggerProps,
    ),
    content: useControlledId(contentProps?.id),
    control: useControlledId(controlProps?.id),
    errorText: useOptionalContentId(errorTextContent, errorTextProps),
    hint: useOptionalContentId(hintContent, hintProps),
    input: useControlledId(inputProps?.id),
    label: useOptionalContentId(labelContent, labelProps),
    positioner: useControlledId(positionerProps?.id),
    root: useControlledId(props.id),
    ...props.ids,
  }

  return (
    <ComboboxRoot {...props} ids={ids}>
      {labelContent ? (
        <ComboboxLabel {...labelProps} id={ids.label}>
          {labelContent}
        </ComboboxLabel>
      ) : null}
      <ComboboxControl {...controlProps} id={ids.control}>
        <ComboboxInput {...inputProps} id={ids.input} />
        <ComboboxClearTrigger {...clearTriggerProps} id={ids.clearTrigger} />
        <ComboboxErrorIndicator {...errorIndicatorProps} />
        <ComboboxTrigger {...triggerProps} id={ids.trigger} />
      </ComboboxControl>
      <Portal {...portalProps}>
        <ComboboxPositioner {...positionerProps} id={ids.positioner}>
          {virtual ? (
            <ComboboxVirtualContent
              {...contentProps}
              highlightMatchingText={highlightMatchingText}
              id={ids.content}
              renderItem={renderItem}
            >
              <ComboboxEmpty {...emptyProps}>{emptyContent}</ComboboxEmpty>
            </ComboboxVirtualContent>
          ) : (
            <ComboboxContent {...contentProps} id={ids.content}>
              <ComboboxEmpty {...emptyProps}>{emptyContent}</ComboboxEmpty>
              <ComboboxItems
                highlightMatchingText={highlightMatchingText}
                renderItem={renderItem}
              />
            </ComboboxContent>
          )}
        </ComboboxPositioner>
      </Portal>

      {errorTextContent ? (
        <ComboboxErrorText {...errorTextProps} id={ids.errorText}>
          {errorTextContent}
        </ComboboxErrorText>
      ) : null}

      {hintContent ? (
        <ComboboxHint {...hintProps} id={ids.hint}>
          {hintContent}
        </ComboboxHint>
      ) : null}
    </ComboboxRoot>
  )
}
