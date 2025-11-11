import {Combobox as SimpleCombobox} from "./combobox"
import {
  ComboboxClearTrigger,
  type ComboboxClearTriggerProps,
} from "./combobox-clear-trigger"
import {ComboboxContent, type ComboboxContentProps} from "./combobox-content"
import {ComboboxContext, type ComboboxContextProps} from "./combobox-context"
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
import {ComboboxItem, type ComboboxItemProps} from "./combobox-item"
import {
  ComboboxItemIndicator,
  type ComboboxItemIndicatorProps,
} from "./combobox-item-indicator"
import {
  ComboboxItemText,
  type ComboboxItemTextProps,
} from "./combobox-item-text"
import {ComboboxItems, type ComboboxItemsProps} from "./combobox-items"
import {ComboboxLabel, type ComboboxLabelProps} from "./combobox-label"
import {
  ComboboxPositioner,
  type ComboboxPositionerProps,
} from "./combobox-positioner"
import {ComboboxRoot, type ComboboxRootProps} from "./combobox-root"
import {ComboboxTrigger, type ComboboxTriggerProps} from "./combobox-trigger"
import {
  ComboboxVirtualContent,
  type ComboboxVirtualContentProps,
} from "./combobox-virtual-content"

export * from "./qds-combobox-context"

export type {
  ComboboxClearTriggerProps,
  ComboboxContentProps,
  ComboboxContextProps,
  ComboboxControlProps,
  ComboboxEmptyProps,
  ComboboxErrorIndicatorProps,
  ComboboxErrorTextProps,
  ComboboxHintProps,
  ComboboxInputProps,
  ComboboxItemIndicatorProps,
  ComboboxItemTextProps,
  ComboboxItemProps,
  ComboboxItemsProps,
  ComboboxLabelProps,
  ComboboxPositionerProps,
  ComboboxRootProps,
  ComboboxTriggerProps,
  ComboboxVirtualContentProps,
}

type ComboboxComponent = typeof SimpleCombobox & {
  /**
   * Button that clears the input value. Renders a `<button>` element by default.
   */
  ClearTrigger: typeof ComboboxClearTrigger
  /**
   * Container for the combobox options. Renders a `<div>` element by default.
   */
  Content: typeof ComboboxContent
  Context: typeof ComboboxContext
  /**
   * Container for the input element and associated controls. Renders a `<div>`
   * element by default.
   */
  Control: typeof ComboboxControl
  /**
   * Message displayed when no options match the filter. Renders a `<div>` element by
   * default.
   */
  Empty: typeof ComboboxEmpty
  /**
   * Visual indicator displayed when the input is invalid. Renders a `<div>` element
   * by default.
   */
  ErrorIndicator: typeof ComboboxErrorIndicator
  /**
   * Error message displayed when the input is invalid. Renders a `<div>` element by
   * default.
   */
  ErrorText: typeof ComboboxErrorText
  /**
   * Helper text displayed below the input. Renders a `<div>` element by default.
   */
  Hint: typeof ComboboxHint
  /**
   * Text input element for filtering and selecting items. Renders an `<input>`
   * element by default.
   */
  Input: typeof ComboboxInput
  /**
   * Individual option within the combobox menu. Renders a `<div>` element by
   * default.
   */
  Item: typeof ComboboxItem
  /**
   * Visual indicator showing the selected state of an item. Renders a `<span>`
   * element by default.
   */
  ItemIndicator: typeof ComboboxItemIndicator
  /**
   * Shortcut for rendering a list of select items. Uses the {@link collection} to
   * determine the label and value for each item.
   */
  Items: typeof ComboboxItems
  /**
   * Text content of a combobox item. Renders a `<span>` element by default.
   */
  ItemText: typeof ComboboxItemText
  /**
   * Label text associated with the combobox. Renders a `<label>` element by default.
   */
  Label: typeof ComboboxLabel
  /**
   * Positions the combobox menu relative to the control. Renders a `<div>` element
   * by default.
   */
  Positioner: typeof ComboboxPositioner
  /**
   * Groups all parts of the combobox. Renders a `<div>` element by default.
   */
  Root: typeof ComboboxRoot
  /**
   * Icon that indicates the open/close state of the combobox's associated panel.
   * Renders a `<button>` element by default.
   */
  Trigger: typeof ComboboxTrigger
  /**
   * Virtual scrolling container for efficiently rendering large lists of combobox
   * options. Renders a `<div>` element by default.
   */
  VirtualContent: typeof ComboboxVirtualContent
}

export const Combobox: ComboboxComponent = SimpleCombobox as ComboboxComponent

Combobox.ClearTrigger = ComboboxClearTrigger
Combobox.Content = ComboboxContent
Combobox.Context = ComboboxContext
Combobox.Control = ComboboxControl
Combobox.Empty = ComboboxEmpty
Combobox.ErrorIndicator = ComboboxErrorIndicator
Combobox.ErrorText = ComboboxErrorText
Combobox.Hint = ComboboxHint
Combobox.Input = ComboboxInput
Combobox.ItemIndicator = ComboboxItemIndicator
Combobox.ItemText = ComboboxItemText
Combobox.Item = ComboboxItem
Combobox.Items = ComboboxItems
Combobox.Label = ComboboxLabel
Combobox.Positioner = ComboboxPositioner
Combobox.Root = ComboboxRoot
Combobox.Trigger = ComboboxTrigger
Combobox.VirtualContent = ComboboxVirtualContent
