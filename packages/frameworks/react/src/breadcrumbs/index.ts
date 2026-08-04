import {
  BreadcrumbsItemIcon,
  type BreadcrumbsItemIconProps,
} from "./breadcrumbs-item-icon.js"
import {
  BreadcrumbsItemRoot,
  type BreadcrumbsItemRootProps,
} from "./breadcrumbs-item-root.js"
import {
  BreadcrumbsItemSeparator,
  type BreadcrumbsItemSeparatorProps,
} from "./breadcrumbs-item-separator.js"
import {
  BreadcrumbsItemTrigger,
  type BreadcrumbsItemTriggerProps,
} from "./breadcrumbs-item-trigger.js"
import {BreadcrumbsItem, type BreadcrumbsItemProps} from "./breadcrumbs-item.js"
import {BreadcrumbsList, type BreadcrumbsListProps} from "./breadcrumbs-list.js"
import {
  BreadcrumbsOverflowItem,
  type BreadcrumbsOverflowItemProps,
} from "./breadcrumbs-overflow-item.js"
import {
  BreadcrumbsOverflowTrigger,
  type BreadcrumbsOverflowTriggerProps,
} from "./breadcrumbs-overflow-trigger.js"
import {BreadcrumbsRoot, type BreadcrumbsRootProps} from "./breadcrumbs-root.js"

export * from "./qds-breadcrumbs-context.js"

export type {
  BreadcrumbsItemIconProps,
  BreadcrumbsItemRootProps,
  BreadcrumbsItemSeparatorProps,
  BreadcrumbsItemTriggerProps,
  BreadcrumbsItemProps,
  BreadcrumbsListProps,
  BreadcrumbsOverflowItemProps,
  BreadcrumbsOverflowTriggerProps,
  BreadcrumbsRootProps,
}

type BreadcrumbsComponent = {
  Item: typeof BreadcrumbsItem
  ItemIcon: typeof BreadcrumbsItemIcon
  ItemRoot: typeof BreadcrumbsItemRoot
  ItemSeparator: typeof BreadcrumbsItemSeparator
  ItemTrigger: typeof BreadcrumbsItemTrigger
  /**
   * The list of breadcrumbs. Renders an `<ol>` element by default.
   */
  List: typeof BreadcrumbsList
  /**
   * Renders an overflow item ("...") that opens a dropdown menu containing
   * collapsed breadcrumb items.
   */
  OverflowItem: typeof BreadcrumbsOverflowItem
  /**
   * Alias for `ItemRoot`. Use as the `<li>` wrapper when composing the
   * overflow item manually with the composite API.
   */
  OverflowItemRoot: typeof BreadcrumbsItemRoot
  OverflowTrigger: typeof BreadcrumbsOverflowTrigger
  /**
   * The root element of the breadcrumbs component. Renders a `<nav>` element by
   * default.
   */
  Root: typeof BreadcrumbsRoot
}

export const Breadcrumbs: BreadcrumbsComponent = {
  Item: BreadcrumbsItem,
  ItemIcon: BreadcrumbsItemIcon,
  ItemRoot: BreadcrumbsItemRoot,
  ItemSeparator: BreadcrumbsItemSeparator,
  ItemTrigger: BreadcrumbsItemTrigger,
  List: BreadcrumbsList,
  OverflowItem: BreadcrumbsOverflowItem,
  OverflowItemRoot: BreadcrumbsItemRoot,
  OverflowTrigger: BreadcrumbsOverflowTrigger,
  Root: BreadcrumbsRoot,
}
