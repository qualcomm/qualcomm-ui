import {
  HeaderBarActionBar,
  type HeaderBarActionBarProps,
} from "./header-bar-action-bar"
import {
  HeaderBarActionButton,
  type HeaderBarActionButtonProps,
} from "./header-bar-action-button"
import {
  HeaderBarActionIconButton,
  type HeaderBarActionIconButtonProps,
} from "./header-bar-action-icon-button"
import {
  HeaderBarAppTitle,
  type HeaderBarAppTitleProps,
} from "./header-bar-app-title"
import {
  HeaderBarDivider,
  type HeaderBarDividerProps,
} from "./header-bar-divider"
import {HeaderBarLogo, type HeaderBarLogoProps} from "./header-bar-logo"
import {
  HeaderBarMenuItem,
  type HeaderBarMenuItemProps,
} from "./header-bar-menu-item"
import {HeaderBarNav, type HeaderBarNavProps} from "./header-bar-nav"
import {
  HeaderBarNavItem,
  type HeaderBarNavItemProps,
} from "./header-bar-nav-item"
import {HeaderBarRoot, type HeaderBarRootProps} from "./header-bar-root"
import {
  HeaderBarWindowControls,
  type HeaderBarWindowControlsProps,
} from "./header-bar-window-controls"

export * from "./qds-header-bar-context"

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
