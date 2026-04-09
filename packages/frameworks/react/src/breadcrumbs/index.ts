import {BreadcrumbsItem, type BreadcrumbsItemProps} from "./breadcrumbs-item"
import {
  BreadcrumbsItemIcon,
  type BreadcrumbsItemIconProps,
} from "./breadcrumbs-item-icon"
import {
  BreadcrumbsItemRoot,
  type BreadcrumbsItemRootProps,
} from "./breadcrumbs-item-root"
import {
  BreadcrumbsItemSeparator,
  type BreadcrumbsItemSeparatorProps,
} from "./breadcrumbs-item-separator"
import {
  BreadcrumbsItemTrigger,
  type BreadcrumbsItemTriggerProps,
} from "./breadcrumbs-item-trigger"
import {BreadcrumbsList, type BreadcrumbsListProps} from "./breadcrumbs-list"
import {
  BreadcrumbsOverflowItem,
  type BreadcrumbsOverflowItemProps,
} from "./breadcrumbs-overflow-item"
import {
  BreadcrumbsOverflowTrigger,
  type BreadcrumbsOverflowTriggerProps,
} from "./breadcrumbs-overflow-trigger"
import {BreadcrumbsRoot, type BreadcrumbsRootProps} from "./breadcrumbs-root"

export * from "./qds-breadcrumbs-context"

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
