import {
  CoreTabsContext,
  type CoreTabsContextProps,
  CoreTabsIndicator,
  type CoreTabsIndicatorProps,
  CoreTabsList,
  type CoreTabsListProps,
  CoreTabsPanel,
  type CoreTabsPanelProps,
  CoreTabsRoot,
  type CoreTabsRootProps,
  CoreTabsTab,
  CoreTabsTabButton,
  type CoreTabsTabButtonProps,
  CoreTabsTabDismissButton,
  type CoreTabsTabDismissButtonProps,
  type CoreTabsTabProps,
} from "./core-tabs"

export * from "./tab-prop-context"
export * from "./tabs-context"

export type {
  CoreTabsRootProps,
  CoreTabsListProps,
  CoreTabsTabButtonProps,
  CoreTabsPanelProps,
  CoreTabsTabDismissButtonProps,
  CoreTabsTabProps,
  CoreTabsIndicatorProps,
  CoreTabsContextProps,
}

type CoreTabsComponent = {
  Context: typeof CoreTabsContext
  Indicator: typeof CoreTabsIndicator
  List: typeof CoreTabsList
  Panel: typeof CoreTabsPanel
  Root: typeof CoreTabsRoot
  Tab: typeof CoreTabsTab
  TabButton: typeof CoreTabsTabButton
  TabDismissButton: typeof CoreTabsTabDismissButton
}

export const CoreTabs: CoreTabsComponent = {
  Context: CoreTabsContext,
  Indicator: CoreTabsIndicator,
  List: CoreTabsList,
  Panel: CoreTabsPanel,
  Root: CoreTabsRoot,
  Tab: CoreTabsTab,
  TabButton: CoreTabsTabButton,
  TabDismissButton: CoreTabsTabDismissButton,
}
