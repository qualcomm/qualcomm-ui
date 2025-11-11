import {
  PaginationContext,
  type PaginationContextProps,
} from "./pagination-context"
import {
  PaginationNextTrigger,
  type PaginationNextTriggerProps,
} from "./pagination-next-trigger"
import {
  PaginationPageButtons,
  type PaginationPageButtonsProps,
} from "./pagination-page-buttons"
import {
  PaginationPageItem,
  type PaginationPageItemProps,
} from "./pagination-page-item"
import {
  PaginationPageItems,
  type PaginationPageItemsProps,
} from "./pagination-page-items"
import {
  PaginationPageMetadata,
  type PaginationPageMetadataProps,
} from "./pagination-page-metadata"
import {
  PaginationPageSize,
  type PaginationPageSizeProps,
} from "./pagination-page-size"
import {
  PaginationPageSizeLabel,
  type PaginationPageSizeLabelProps,
} from "./pagination-page-size-label"
import {
  PaginationPrevTrigger,
  type PaginationPrevTriggerProps,
} from "./pagination-prev-trigger"
import {PaginationRoot, type PaginationRootProps} from "./pagination-root"

export * from "./qds-pagination-context"

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
