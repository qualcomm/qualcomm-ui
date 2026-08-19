import {
  ListItemAccessory,
  type ListItemAccessoryProps,
} from "./list-item-accessory.js"
import {
  ListItemControl,
  type ListItemControlProps,
} from "./list-item-control.js"
import {
  ListItemDescription,
  type ListItemDescriptionProps,
} from "./list-item-description.js"
import {ListItemLabel, type ListItemLabelProps} from "./list-item-label.js"
import {ListItemRoot, type ListItemRootProps} from "./list-item-root.js"
import {
  ListItemSecondaryText,
  type ListItemSecondaryTextProps,
} from "./list-item-secondary-text.js"
import {
  ListItemStartIcon,
  type ListItemStartIconProps,
} from "./list-item-start-icon.js"
import {ListItem as SimpleListItem, type ListItemProps} from "./list-item.js"

export * from "./qds-list-item-context.js"
export type {
  ListItemAccessoryProps,
  ListItemControlProps,
  ListItemDescriptionProps,
  ListItemLabelProps,
  ListItemProps,
  ListItemRootProps,
  ListItemSecondaryTextProps,
  ListItemStartIconProps,
}

/**
 * @alpha
 */
type ListItemComponent = typeof SimpleListItem & {
  /**
   * Content displayed at the end of a list item. Renders a `<div>` element by
   * default.
   */
  Accessory: typeof ListItemAccessory
  /**
   * A leading control, such as a checkbox or radio button. Renders a `<div>`
   * element by default.
   */
  Control: typeof ListItemControl
  /**
   * Supplementary text for a list item. Renders a `<div>` element by default.
   */
  Description: typeof ListItemDescription
  /**
   * The primary text of a list item. Renders a `<div>` element by default.
   */
  Label: typeof ListItemLabel
  /**
   * Groups the parts of a list item. Renders an `<li>` element by default.
   */
  Root: typeof ListItemRoot
  /**
   * Secondary text displayed after the label and description. Renders a `<div>`
   * element by default.
   */
  SecondaryText: typeof ListItemSecondaryText
  /**
   * An icon displayed before the text of a list item.
   */
  StartIcon: typeof ListItemStartIcon
}

export const ListItem: ListItemComponent = SimpleListItem as ListItemComponent

ListItem.Accessory = ListItemAccessory
ListItem.Control = ListItemControl
ListItem.Description = ListItemDescription
ListItem.Label = ListItemLabel
ListItem.Root = ListItemRoot
ListItem.SecondaryText = ListItemSecondaryText
ListItem.StartIcon = ListItemStartIcon
