import {
  CoreSideNavContext,
  type CoreSideNavContextProps,
  CoreSideNavHeader,
  CoreSideNavHeaderAction,
  type CoreSideNavHeaderActionProps,
  CoreSideNavHeaderLogo,
  type CoreSideNavHeaderLogoProps,
  type CoreSideNavHeaderProps,
  CoreSideNavHeaderTitle,
  type CoreSideNavHeaderTitleProps,
  CoreSideNavRoot,
  type CoreSideNavRootProps,
  CoreSideNavTrigger,
  type CoreSideNavTriggerProps,
} from "./core-side-nav"

export * from "./side-nav-context"

export type {
  CoreSideNavRootProps,
  CoreSideNavTriggerProps,
  CoreSideNavContextProps,
  CoreSideNavHeaderProps,
  CoreSideNavHeaderLogoProps,
  CoreSideNavHeaderTitleProps,
  CoreSideNavHeaderActionProps,
}

type CoreSideNavComponent = {
  Context: typeof CoreSideNavContext
  Header: typeof CoreSideNavHeader
  HeaderAction: typeof CoreSideNavHeaderAction
  HeaderLogo: typeof CoreSideNavHeaderLogo
  HeaderTitle: typeof CoreSideNavHeaderTitle
  Root: typeof CoreSideNavRoot
  Trigger: typeof CoreSideNavTrigger
}

export const CoreSideNav: CoreSideNavComponent = {
  Context: CoreSideNavContext,
  Header: CoreSideNavHeader,
  HeaderAction: CoreSideNavHeaderAction,
  HeaderLogo: CoreSideNavHeaderLogo,
  HeaderTitle: CoreSideNavHeaderTitle,
  Root: CoreSideNavRoot,
  Trigger: CoreSideNavTrigger,
}
