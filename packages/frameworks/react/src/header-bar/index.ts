import {
  HeaderBarActionBar,
  type HeaderBarActionBarProps,
} from "./header-bar-action-bar.js"
import {
  HeaderBarActionButton,
  type HeaderBarActionButtonProps,
} from "./header-bar-action-button.js"
import {
  HeaderBarActionIconButton,
  type HeaderBarActionIconButtonProps,
} from "./header-bar-action-icon-button.js"
import {
  HeaderBarAppTitle,
  type HeaderBarAppTitleProps,
} from "./header-bar-app-title.js"
import {
  HeaderBarDivider,
  type HeaderBarDividerProps,
} from "./header-bar-divider.js"
import {HeaderBarLogo, type HeaderBarLogoProps} from "./header-bar-logo.js"
import {
  HeaderBarMenuItem,
  type HeaderBarMenuItemProps,
} from "./header-bar-menu-item.js"
import {
  HeaderBarNavItem,
  type HeaderBarNavItemProps,
} from "./header-bar-nav-item.js"
import {HeaderBarNav, type HeaderBarNavProps} from "./header-bar-nav.js"
import {HeaderBarRoot, type HeaderBarRootProps} from "./header-bar-root.js"
import {
  HeaderBarWindowControls,
  type HeaderBarWindowControlsProps,
} from "./header-bar-window-controls.js"

export * from "./qds-header-bar-context.js"

export type {
  HeaderBarActionBarProps,
  HeaderBarActionButtonProps,
  HeaderBarActionIconButtonProps,
  HeaderBarAppTitleProps,
  HeaderBarDividerProps,
  HeaderBarLogoProps,
  HeaderBarMenuItemProps,
  HeaderBarNavItemProps,
  HeaderBarNavProps,
  HeaderBarRootProps,
  HeaderBarWindowControlsProps,
}

type HeaderBarComponent = {
  ActionBar: typeof HeaderBarActionBar
  ActionButton: typeof HeaderBarActionButton
  ActionIconButton: typeof HeaderBarActionIconButton
  AppTitle: typeof HeaderBarAppTitle
  Divider: typeof HeaderBarDivider
  Logo: typeof HeaderBarLogo
  MenuItem: typeof HeaderBarMenuItem
  Nav: typeof HeaderBarNav
  NavItem: typeof HeaderBarNavItem
  Root: typeof HeaderBarRoot
  WindowControls: typeof HeaderBarWindowControls
}

export const HeaderBar: HeaderBarComponent = {
  ActionBar: HeaderBarActionBar,
  ActionButton: HeaderBarActionButton,
  ActionIconButton: HeaderBarActionIconButton,
  AppTitle: HeaderBarAppTitle,
  Divider: HeaderBarDivider,
  Logo: HeaderBarLogo,
  MenuItem: HeaderBarMenuItem,
  Nav: HeaderBarNav,
  NavItem: HeaderBarNavItem,
  Root: HeaderBarRoot,
  WindowControls: HeaderBarWindowControls,
}
