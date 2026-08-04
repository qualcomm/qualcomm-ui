import type {FunctionComponent} from "react"

import {MenuButton, type MenuButtonProps} from "./menu-button.js"
import {
  MenuCheckboxItemControl,
  type MenuCheckboxItemControlProps,
} from "./menu-checkbox-item-control.js"
import {
  MenuCheckboxItem,
  type MenuCheckboxItemProps,
} from "./menu-checkbox-item.js"
import {MenuContent, type MenuContentProps} from "./menu-content.js"
import {
  MenuContextTrigger,
  type MenuContextTriggerProps,
} from "./menu-context-trigger.js"
import {MenuIconButton, type MenuIconButtonProps} from "./menu-icon-button.js"
import {
  MenuInlineIconButton,
  type MenuInlineIconButtonProps,
} from "./menu-inline-icon-button.js"
import {
  MenuItemAccessory,
  type MenuItemAccessoryProps,
} from "./menu-item-accessory.js"
import {
  MenuItemCommand,
  type MenuItemCommandProps,
} from "./menu-item-command.js"
import {
  MenuItemDescription,
  type MenuItemDescriptionProps,
} from "./menu-item-description.js"
import {
  MenuItemGroupLabel,
  type MenuItemGroupLabelProps,
} from "./menu-item-group-label.js"
import {MenuItemGroup, type MenuItemGroupProps} from "./menu-item-group.js"
import {
  MenuItemIndicator,
  type MenuItemIndicatorProps,
} from "./menu-item-indicator.js"
import {MenuItemLabel, type MenuItemLabelProps} from "./menu-item-label.js"
import {
  MenuItemStartIcon,
  type MenuItemStartIconProps,
} from "./menu-item-start-icon.js"
import {MenuItem, type MenuItemProps} from "./menu-item.js"
import {MenuPositioner, type MenuPositionerProps} from "./menu-positioner.js"
import {
  MenuRadioItemControl,
  type MenuRadioItemControlProps,
} from "./menu-radio-item-control.js"
import {
  MenuRadioItemGroup,
  type MenuRadioItemGroupProps,
} from "./menu-radio-item-group.js"
import {MenuRadioItem, type MenuRadioItemProps} from "./menu-radio-item.js"
import {MenuRoot, type MenuRootProps} from "./menu-root.js"
import {MenuSeparator, type MenuSeparatorProps} from "./menu-separator.js"
import {
  MenuSplitButton,
  type MenuSplitButtonProps,
} from "./menu-split-button.js"
import {
  MenuTriggerItem,
  type MenuTriggerItemProps,
} from "./menu-trigger-item.js"
import {MenuTrigger, type MenuTriggerProps} from "./menu-trigger.js"

export * from "./qds-menu-context.js"
export type {
  MenuIconButtonProps,
  MenuItemCommandProps,
  MenuInlineIconButtonProps,
  MenuRadioItemControlProps,
  MenuRadioItemProps,
  MenuButtonProps,
  MenuTriggerItemProps,
  MenuTriggerProps,
  MenuItemProps,
  MenuContentProps,
  MenuRootProps,
  MenuItemLabelProps,
  MenuItemDescriptionProps,
  MenuItemGroupProps,
  MenuRadioItemGroupProps,
  MenuCheckboxItemControlProps,
  MenuPositionerProps,
  MenuItemIndicatorProps,
  MenuItemGroupLabelProps,
  MenuContextTriggerProps,
  MenuSeparatorProps,
  MenuSplitButtonProps,
  MenuItemAccessoryProps,
  MenuCheckboxItemProps,
  MenuItemStartIconProps,
}

interface MenuComponent {
  Button: FunctionComponent<MenuButtonProps>
  CheckboxItem: FunctionComponent<MenuCheckboxItemProps>
  CheckboxItemControl: FunctionComponent<MenuCheckboxItemControlProps>
  Content: FunctionComponent<MenuContentProps>
  ContextTrigger: FunctionComponent<MenuContextTriggerProps>
  IconButton: FunctionComponent<MenuIconButtonProps>
  InlineIconButton: FunctionComponent<MenuInlineIconButtonProps>
  Item: FunctionComponent<MenuItemProps>
  ItemAccessory: FunctionComponent<MenuItemAccessoryProps>
  ItemCommand: FunctionComponent<MenuItemCommandProps>
  ItemDescription: FunctionComponent<MenuItemDescriptionProps>
  ItemGroup: FunctionComponent<MenuItemGroupProps>
  ItemGroupLabel: FunctionComponent<MenuItemGroupLabelProps>
  ItemIndicator: FunctionComponent<MenuItemIndicatorProps>
  ItemLabel: FunctionComponent<MenuItemLabelProps>
  ItemStartIcon: FunctionComponent<MenuItemStartIconProps>
  /**
   * A container that positions the menu relative to its anchor element. Renders a
   * `<div>` element by default.
   */
  Positioner: FunctionComponent<MenuPositionerProps>
  RadioItem: FunctionComponent<MenuRadioItemProps>
  RadioItemControl: FunctionComponent<MenuRadioItemControlProps>
  RadioItemGroup: FunctionComponent<MenuRadioItemGroupProps>
  Root: FunctionComponent<MenuRootProps>
  Separator: FunctionComponent<MenuSeparatorProps>
  /**
   * @since 1.24.0
   */
  SplitButton: FunctionComponent<MenuSplitButtonProps>
  /**
   * Enhances a child element to open the menu when clicked. Requires a single child
   * element.
   *
   * @example
   * ```tsx
   * <Menu.Trigger>
   *   <button>Open</button>
   * </Menu.Trigger>
   * ```
   */
  Trigger: FunctionComponent<MenuTriggerProps>
  /**
   * A menu item that triggers a submenu on hover or click. Renders a `<button>`
   * element by default.
   */
  TriggerItem: FunctionComponent<MenuTriggerItemProps>
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
  /**
   * @since 1.24.0
   */
  SplitButton: MenuSplitButton,
  Trigger: MenuTrigger,
  TriggerItem: MenuTriggerItem,
}
