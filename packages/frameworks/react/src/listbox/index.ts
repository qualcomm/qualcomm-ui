import type {FunctionComponent} from "react"

import {ListboxContent, type ListboxContentProps} from "./listbox-content.js"
import {ListboxInput, type ListboxInputProps} from "./listbox-input.js"
import {
  ListboxItemAccessory,
  type ListboxItemAccessoryProps,
} from "./listbox-item-accessory.js"
import {
  ListboxItemControl,
  type ListboxItemControlProps,
} from "./listbox-item-control.js"
import {
  ListboxItemDescription,
  type ListboxItemDescriptionProps,
} from "./listbox-item-description.js"
import {
  ListboxItemLabel,
  type ListboxItemLabelProps,
} from "./listbox-item-label.js"
import {
  ListboxItemSecondaryText,
  type ListboxItemSecondaryTextProps,
} from "./listbox-item-secondary-text.js"
import {
  ListboxItemStartIcon,
  type ListboxItemStartIconProps,
} from "./listbox-item-start-icon.js"
import {ListboxItem, type ListboxItemProps} from "./listbox-item.js"
import {ListboxLabel, type ListboxLabelProps} from "./listbox-label.js"
import {ListboxRoot, type ListboxRootProps} from "./listbox-root.js"

export * from "./qds-listbox-context.js"
export type {
  ListboxItemProps,
  ListboxItemControlProps,
  ListboxContentProps,
  ListboxItemLabelProps,
  ListboxItemSecondaryTextProps,
  ListboxInputProps,
  ListboxItemStartIconProps,
  ListboxItemAccessoryProps,
  ListboxItemDescriptionProps,
  ListboxLabelProps,
  ListboxRootProps,
}

interface ListboxComponent {
  /**
   * Container for the listbox options. Renders a `<div>` element by default.
   */
  Content: FunctionComponent<ListboxContentProps>
  Input: FunctionComponent<ListboxInputProps>
  /**
   * An interactive option in the listbox. Renders a `<li>` element by default.
   */
  Item: FunctionComponent<ListboxItemProps>
  ItemAccessory: FunctionComponent<ListboxItemAccessoryProps>
  /**
   * A selection indicator for a listbox item. Renders a `<div>` element by default.
   */
  ItemControl: FunctionComponent<ListboxItemControlProps>
  ItemDescription: FunctionComponent<ListboxItemDescriptionProps>
  /**
   * The primary text of a listbox option. Renders a `<span>` element by default.
   */
  ItemLabel: FunctionComponent<ListboxItemLabelProps>
  ItemSecondaryText: FunctionComponent<ListboxItemSecondaryTextProps>
  ItemStartIcon: FunctionComponent<ListboxItemStartIconProps>
  /**
   * Accessible label for the listbox. Renders a `<div>` element by default.
   */
  Label: FunctionComponent<ListboxLabelProps>
  /**
   * Groups all parts of the listbox. Renders a `<div>` element by default.
   */
  Root: FunctionComponent<ListboxRootProps>
}

/**
 * @since 1.28.0
 * @alpha
 */
export const Listbox: ListboxComponent = {
  Content: ListboxContent,
  Input: ListboxInput,
  Item: ListboxItem,
  ItemAccessory: ListboxItemAccessory,
  ItemControl: ListboxItemControl,
  ItemDescription: ListboxItemDescription,
  ItemLabel: ListboxItemLabel,
  ItemSecondaryText: ListboxItemSecondaryText,
  ItemStartIcon: ListboxItemStartIcon,
  Label: ListboxLabel,
  Root: ListboxRoot,
}
