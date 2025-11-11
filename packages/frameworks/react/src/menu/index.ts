import {MenuButton, type MenuButtonProps} from "./menu-button"
import {
  MenuCheckboxItem,
  type MenuCheckboxItemProps,
} from "./menu-checkbox-item"
import {
  MenuCheckboxItemControl,
  type MenuCheckboxItemControlProps,
} from "./menu-checkbox-item-control"
import {MenuContent, type MenuContentProps} from "./menu-content"
import {
  MenuContextTrigger,
  type MenuContextTriggerProps,
} from "./menu-context-trigger"
import {MenuIconButton, type MenuIconButtonProps} from "./menu-icon-button"
import {
  MenuInlineIconButton,
  type MenuInlineIconButtonProps,
} from "./menu-inline-icon-button"
import {MenuItem, type MenuItemProps} from "./menu-item"
import {
  MenuItemAccessory,
  type MenuItemAccessoryProps,
} from "./menu-item-accessory"
import {MenuItemCommand, type MenuItemCommandProps} from "./menu-item-command"
import {
  MenuItemDescription,
  type MenuItemDescriptionProps,
} from "./menu-item-description"
import {MenuItemGroup, type MenuItemGroupProps} from "./menu-item-group"
import {
  MenuItemGroupLabel,
  type MenuItemGroupLabelProps,
} from "./menu-item-group-label"
import {
  MenuItemIndicator,
  type MenuItemIndicatorProps,
} from "./menu-item-indicator"
import {MenuItemLabel, type MenuItemLabelProps} from "./menu-item-label"
import {
  MenuItemStartIcon,
  type MenuItemStartIconProps,
} from "./menu-item-start-icon"
import {MenuPositioner, type MenuPositionerProps} from "./menu-positioner"
import {MenuRadioItem, type MenuRadioItemProps} from "./menu-radio-item"
import {
  MenuRadioItemControl,
  type MenuRadioItemControlProps,
} from "./menu-radio-item-control"
import {
  MenuRadioItemGroup,
  type MenuRadioItemGroupProps,
} from "./menu-radio-item-group"
import {MenuRoot, type MenuRootProps} from "./menu-root"
import {MenuSeparator, type MenuSeparatorProps} from "./menu-separator"
import {MenuTrigger, type MenuTriggerProps} from "./menu-trigger"
import {MenuTriggerItem, type MenuTriggerItemProps} from "./menu-trigger-item"

export * from "./qds-menu-context"

export type {
  MenuButtonProps,
  MenuCheckboxItemControlProps,
  MenuCheckboxItemProps,
  MenuContentProps,
  MenuContextTriggerProps,
  MenuIconButtonProps,
  MenuInlineIconButtonProps,
  MenuItemAccessoryProps,
  MenuItemCommandProps,
  MenuItemDescriptionProps,
  MenuItemGroupLabelProps,
  MenuItemGroupProps,
  MenuItemIndicatorProps,
  MenuItemLabelProps,
  MenuItemStartIconProps,
  MenuItemProps,
  MenuPositionerProps,
  MenuRadioItemControlProps,
  MenuRadioItemGroupProps,
  MenuRadioItemProps,
  MenuRootProps,
  MenuSeparatorProps,
  MenuTriggerItemProps,
  MenuTriggerProps,
}

type MenuComponent = {
  Button: typeof MenuButton
  CheckboxItem: typeof MenuCheckboxItem
  CheckboxItemControl: typeof MenuCheckboxItemControl
  Content: typeof MenuContent
  ContextTrigger: typeof MenuContextTrigger
  IconButton: typeof MenuIconButton
  InlineIconButton: typeof MenuInlineIconButton
  Item: typeof MenuItem
  ItemAccessory: typeof MenuItemAccessory
  ItemCommand: typeof MenuItemCommand
  ItemDescription: typeof MenuItemDescription
  ItemGroup: typeof MenuItemGroup
  ItemGroupLabel: typeof MenuItemGroupLabel
  ItemIndicator: typeof MenuItemIndicator
  ItemLabel: typeof MenuItemLabel
  ItemStartIcon: typeof MenuItemStartIcon
  Positioner: typeof MenuPositioner
  RadioItem: typeof MenuRadioItem
  RadioItemControl: typeof MenuRadioItemControl
  RadioItemGroup: typeof MenuRadioItemGroup
  Root: typeof MenuRoot
  Separator: typeof MenuSeparator
  Trigger: typeof MenuTrigger
  TriggerItem: typeof MenuTriggerItem
}

export const Menu: MenuComponent = {
  Button: MenuButton,
  CheckboxItem: MenuCheckboxItem,
  CheckboxItemControl: MenuCheckboxItemControl,
  Content: MenuContent,
  ContextTrigger: MenuContextTrigger,
  IconButton: MenuIconButton,
  InlineIconButton: MenuInlineIconButton,
  Item: MenuItem,
  ItemAccessory: MenuItemAccessory,
  ItemCommand: MenuItemCommand,
  ItemDescription: MenuItemDescription,
  ItemGroup: MenuItemGroup,
  ItemGroupLabel: MenuItemGroupLabel,
  ItemIndicator: MenuItemIndicator,
  ItemLabel: MenuItemLabel,
  ItemStartIcon: MenuItemStartIcon,
  Positioner: MenuPositioner,
  RadioItem: MenuRadioItem,
  RadioItemControl: MenuRadioItemControl,
  RadioItemGroup: MenuRadioItemGroup,
  Root: MenuRoot,
  Separator: MenuSeparator,
  Trigger: MenuTrigger,
  TriggerItem: MenuTriggerItem,
}
