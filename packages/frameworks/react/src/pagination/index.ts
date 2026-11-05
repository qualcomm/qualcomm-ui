import {
  PaginationContext,
  type PaginationContextProps,
} from "./pagination-context.js"
import {
  PaginationNextTrigger,
  type PaginationNextTriggerProps,
} from "./pagination-next-trigger.js"
import {
  PaginationPageButtons,
  type PaginationPageButtonsProps,
} from "./pagination-page-buttons.js"
import {
  PaginationPageItem,
  type PaginationPageItemProps,
} from "./pagination-page-item.js"
import {
  PaginationPageItems,
  type PaginationPageItemsProps,
} from "./pagination-page-items.js"
import {
  PaginationPageMetadata,
  type PaginationPageMetadataProps,
} from "./pagination-page-metadata.js"
import {
  PaginationPageSizeLabel,
  type PaginationPageSizeLabelProps,
} from "./pagination-page-size-label.js"
import {
  PaginationPageSize,
  type PaginationPageSizeProps,
} from "./pagination-page-size.js"
import {
  PaginationPrevTrigger,
  type PaginationPrevTriggerProps,
} from "./pagination-prev-trigger.js"
import {PaginationRoot, type PaginationRootProps} from "./pagination-root.js"

export * from "./qds-pagination-context.js"

export type {
  PaginationContextProps,
  PaginationNextTriggerProps,
  PaginationPageButtonsProps,
  PaginationPageItemProps,
  PaginationPageItemsProps,
  PaginationPageMetadataProps,
  PaginationPageSizeLabelProps,
  PaginationPageSizeProps,
  PaginationPrevTriggerProps,
  PaginationRootProps,
}

type PaginationComponent = {
  Context: typeof PaginationContext
  NextTrigger: typeof PaginationNextTrigger
  /**
   * A shortcut for rendering the pagination page buttons. This is equivalent to:
   *
   * @example
   * ```tsx
   * <ActionGroup>
   *   <Pagination.PrevTrigger />
   *   <Pagination.PageItems />
   *   <Pagination.NextTrigger />
   * </ActionGroup>
   * ```
   */
  PageButtons: typeof PaginationPageButtons
  PageItem: typeof PaginationPageItem
  PageItems: typeof PaginationPageItems
  PageMetadata: typeof PaginationPageMetadata
  PageSize: typeof PaginationPageSize
  PageSizeLabel: typeof PaginationPageSizeLabel
  PrevTrigger: typeof PaginationPrevTrigger
  Root: typeof PaginationRoot
}

export const Pagination: PaginationComponent = {
  Context: PaginationContext,
  NextTrigger: PaginationNextTrigger,
  PageButtons: PaginationPageButtons,
  PageItem: PaginationPageItem,
  PageItems: PaginationPageItems,
  PageMetadata: PaginationPageMetadata,
  PageSize: PaginationPageSize,
  PageSizeLabel: PaginationPageSizeLabel,
  PrevTrigger: PaginationPrevTrigger,
  Root: PaginationRoot,
}
