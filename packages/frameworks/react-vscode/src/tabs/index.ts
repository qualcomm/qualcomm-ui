import {TabButton, type TabButtonProps} from "./tab-button"
import {
  TabDismissButton,
  type TabDismissButtonProps,
} from "./tab-dismiss-button"
import {TabRoot, type TabRootProps} from "./tab-root"
import {TabsContext, type TabsContextProps} from "./tabs-context"
import {TabsIndicator, type TabsIndicatorProps} from "./tabs-indicator"
import {TabsList, type TabsListProps} from "./tabs-list"
import {TabsPanel, type TabsPanelProps} from "./tabs-panel"
import {TabsRoot, type TabsRootProps} from "./tabs-root"

export type {
  TabButtonProps,
  TabDismissButtonProps,
  TabRootProps,
  TabsContextProps,
  TabsIndicatorProps,
  TabsListProps,
  TabsPanelProps,
  TabsRootProps,
}

type TabComponent = {
  Button: typeof TabButton
  DismissButton: typeof TabDismissButton
  Root: typeof TabRoot
}

export const Tab: TabComponent = {
  Button: TabButton,
  DismissButton: TabDismissButton,
  Root: TabRoot,
}

type TabsComponent = {
  Context: typeof TabsContext
  Indicator: typeof TabsIndicator
  List: typeof TabsList
  Panel: typeof TabsPanel
  Root: typeof TabsRoot
}

export const Tabs: TabsComponent = {
  Context: TabsContext,
  Indicator: TabsIndicator,
  List: TabsList,
  Panel: TabsPanel,
  Root: TabsRoot,
}
