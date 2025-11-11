import {TabButton, type TabButtonProps} from "./tab-button"
import {
  TabDismissButton,
  type TabDismissButtonProps,
} from "./tab-dismiss-button"
import {TabRoot, type TabRootProps} from "./tab-root"

export type {TabButtonProps, TabDismissButtonProps, TabRootProps}

type TabComponent = {
  /**
   * Button that activates its associated tab panel. Renders a `<button>` element by
   * default.
   */
  Button: typeof TabButton
  /**
   * Button that dismisses a tab. Renders a `<button>` element by default.
   */
  DismissButton: typeof TabDismissButton
  /**
   * Groups all parts of a single tab. Renders a `<div>` element by default.
   */
  Root: typeof TabRoot
}

export const Tab: TabComponent = {
  Button: TabButton,
  DismissButton: TabDismissButton,
  Root: TabRoot,
}
