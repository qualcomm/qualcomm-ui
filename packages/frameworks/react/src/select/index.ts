import {
  SelectClearTrigger,
  type SelectClearTriggerProps,
} from "./select-clear-trigger.js"
import {SelectContent, type SelectContentProps} from "./select-content.js"
import {SelectControl, type SelectControlProps} from "./select-control.js"
import {
  SelectErrorIndicator,
  type SelectErrorIndicatorProps,
} from "./select-error-indicator.js"
import {
  SelectErrorText,
  type SelectErrorTextProps,
} from "./select-error-text.js"
import {
  SelectHiddenSelect,
  type SelectHiddenSelectProps,
} from "./select-hidden-select.js"
import {SelectHint, type SelectHintProps} from "./select-hint.js"
import {SelectIcon, type SelectIconProps} from "./select-icon.js"
import {SelectIndicator, type SelectIndicatorProps} from "./select-indicator.js"
import {
  SelectItemCheckbox,
  type SelectItemCheckboxProps,
} from "./select-item-checkbox.js"
import {
  SelectItemGroupLabel,
  type SelectItemGroupLabelProps,
} from "./select-item-group-label.js"
import {
  SelectItemGroup,
  type SelectItemGroupProps,
} from "./select-item-group.js"
import {
  SelectItemIndicator,
  type SelectItemIndicatorProps,
} from "./select-item-indicator.js"
import {SelectItemText, type SelectItemTextProps} from "./select-item-text.js"
import {SelectItem, type SelectItemProps} from "./select-item.js"
import {SelectItems} from "./select-items.js"
import {SelectLabel, type SelectLabelProps} from "./select-label.js"
import {
  SelectPositioner,
  type SelectPositionerProps,
} from "./select-positioner.js"
import {SelectRoot, type SelectRootProps} from "./select-root.js"
import {
  SelectValueText,
  type SelectValueTextProps,
} from "./select-value-text.js"
import {Select as SimpleSelect} from "./select.js"

export * from "./qds-select-context.js"

export type {
  SelectClearTriggerProps,
  SelectContentProps,
  SelectControlProps,
  SelectErrorIndicatorProps,
  SelectErrorTextProps,
  SelectHiddenSelectProps,
  SelectHintProps,
  SelectIconProps,
  SelectIndicatorProps,
  SelectItemCheckboxProps,
  SelectItemGroupProps,
  SelectItemGroupLabelProps,
  SelectItemIndicatorProps,
  SelectItemTextProps,
  SelectItemProps,
  SelectLabelProps,
  SelectPositionerProps,
  SelectRootProps,
  SelectValueTextProps,
}

type SelectComponent = typeof SimpleSelect & {
  /**
   * Button that clears the selected value. Renders a `<button>` element by default.
   */
  ClearTrigger: typeof SelectClearTrigger
  /**
   * Container for the select options. Renders a `<div>` element by default.
   */
  Content: typeof SelectContent
  /**
   * The trigger that opens and closes the select menu. Renders a `<div>` element
   * by default.
   */
  Control: typeof SelectControl
  /**
   * Visual indicator displayed when the input is invalid. Renders a `<div>` element
   * by default.
   */
  ErrorIndicator: typeof SelectErrorIndicator
  /**
   * Error message displayed when the input is invalid. Renders a `<div>` element by
   * default.
   */
  ErrorText: typeof SelectErrorText
  /**
   * Hidden native select element for form submission. Renders a `<select>` element.
   */
  HiddenSelect: typeof SelectHiddenSelect
  /**
   * Helper text displayed below the input. Renders a `<div>` element by default.
   */
  Hint: typeof SelectHint
  Icon: typeof SelectIcon
  /**
   * Icon that indicates the open/close state of the select's associated panel.
   * Renders a `<div>` element by default.
   */
  Indicator: typeof SelectIndicator
  /**
   * Individual option within the select menu. Renders a `<div>` element by default.
   */
  Item: typeof SelectItem
  /**
   * Checkbox-style indicator for select items. Always visible, showing a checkbox
   * that fills when selected. Use with `selectionIndicator="checkbox"` on the
   * Select root.
   */
  ItemCheckbox: typeof SelectItemCheckbox
  /**
   * Visually separates a group of items. Renders a `<div>` element by default.
   *
   * @since 1.31.0
   */
  ItemGroup: typeof SelectItemGroup
  /**
   * Label for an item group. Renders a `<div>` element by default.
   *
   * @since 1.31.0
   */
  ItemGroupLabel: typeof SelectItemGroupLabel
  /**
   * Visual indicator showing the selected state of an item. Renders a `<span>`
   * element by default.
   */
  ItemIndicator: typeof SelectItemIndicator
  /**
   * Shortcut for rendering a list of select items. Uses the {@link collection} to
   * determine the label and value for each item.
   */
  Items: typeof SelectItems
  ItemText: typeof SelectItemText
  /**
   * Label text associated with the select. Renders a `<label>` element by default.
   */
  Label: typeof SelectLabel
  /**
   * Positions the select menu relative to the trigger. Renders a `<div>` element by
   * default.
   */
  Positioner: typeof SelectPositioner
  /**
   * Groups all parts of the select. Renders a `<div>` element by default.
   */
  Root: typeof SelectRoot
  /**
   * Displays the currently selected value(s). Renders a `<span>` element by default.
   */
  ValueText: typeof SelectValueText
}

export const Select: SelectComponent = SimpleSelect as SelectComponent

Select.ClearTrigger = SelectClearTrigger
Select.Content = SelectContent
Select.Control = SelectControl
Select.ErrorIndicator = SelectErrorIndicator
Select.ErrorText = SelectErrorText
Select.HiddenSelect = SelectHiddenSelect
Select.Hint = SelectHint
Select.Icon = SelectIcon
Select.Indicator = SelectIndicator
Select.Item = SelectItem
Select.ItemCheckbox = SelectItemCheckbox
Select.ItemGroup = SelectItemGroup
Select.ItemGroupLabel = SelectItemGroupLabel
Select.ItemIndicator = SelectItemIndicator
Select.Items = SelectItems
Select.ItemText = SelectItemText
Select.Label = SelectLabel
Select.Positioner = SelectPositioner
Select.Root = SelectRoot
Select.ValueText = SelectValueText
