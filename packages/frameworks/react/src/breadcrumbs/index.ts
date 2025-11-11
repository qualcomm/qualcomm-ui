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
import {BreadcrumbsRoot, type BreadcrumbsRootProps} from "./breadcrumbs-root"

export * from "./qds-breadcrumbs-context"

export type {
  BreadcrumbsItemIconProps,
  BreadcrumbsItemRootProps,
  BreadcrumbsItemSeparatorProps,
  BreadcrumbsItemTriggerProps,
  BreadcrumbsItemProps,
  BreadcrumbsListProps,
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
  Root: BreadcrumbsRoot,
}
