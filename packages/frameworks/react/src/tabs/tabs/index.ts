import {TabsContext, type TabsContextProps} from "./tabs-context"
import {TabsIndicator, type TabsIndicatorProps} from "./tabs-indicator"
import {TabsList, type TabsListProps} from "./tabs-list"
import {TabsPanel, type TabsPanelProps} from "./tabs-panel"
import {TabsRoot, type TabsRootProps} from "./tabs-root"

export type {
  TabsContextProps,
  TabsIndicatorProps,
  TabsListProps,
  TabsPanelProps,
  TabsRootProps,
}

type TabsComponent = {
  Context: typeof TabsContext
  /**
   * Visual indicator that highlights the active tab. Renders a `<div>` element by
   * default. You only need to render a single `<Tabs.Indicator>` component per tab
   * list.
   *
   * @example
   * ```tsx
   * <Tabs.Root>
   *   <Tabs.List>
   *     <Tabs.Indicator />
   *     <Tab.Root value="tab-1">
   *       <Tab.Button>Tab 1</Tab.Button>
   *     </Tab.Root>
   *   </Tabs.List>
   * </Tabs.Root>
   * ```
   */
  Indicator: typeof TabsIndicator
  /**
   * Container for the tab buttons. Renders a `<div>` element by default.
   */
  List: typeof TabsList
  /**
   * Content area associated with a tab. Renders a `<div>` element by default.
   */
  Panel: typeof TabsPanel
  /**
   * Groups all parts of the tabs. Renders a `<div>` element by default.
   */
  Root: typeof TabsRoot
}

export const Tabs: TabsComponent = {
  Context: TabsContext,
  Indicator: TabsIndicator,
  List: TabsList,
  Panel: TabsPanel,
  Root: TabsRoot,
}
