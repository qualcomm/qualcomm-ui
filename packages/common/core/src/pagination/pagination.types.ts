import type {BooleanDataAttr, IdParam} from "@qualcomm-ui/utils/attributes"
import type {RequiredBy} from "@qualcomm-ui/utils/guard"
import type {
  ElementCleanup,
  EventDetails,
  JSX,
  MachineSchema,
} from "@qualcomm-ui/utils/machine"

export type PageItem =
  | {
      active?: boolean
      label: string
      page: number
      type: "page"
    }
  | {
      type: "separator"
    }

export type PageChangeReason = "input" | "reset" | "rows-per-page-changed"

/**
 * Defines the available placeholders for pagination metadata templates.
 */
export interface PageMetadata {
  /**
   * The total number of data items across all pages.
   */
  count: number

  /**
   * The currently active page number.
   */
  page: number

  /**
   * The total number of pages available.
   */
  pageCount: number

  /**
   * The 1-based index of the current page's last item.
   */
  pageEnd: number

  /**
   * The 1-based index of the current page's first item.
   */
  pageStart: number
}

export interface PaginationApiProps {
  /**
   * Number of always visible pages at the beginning and end.
   *
   * @default 1
   */
  boundaryCount?: number | undefined

  /**
   * The total number of data items.
   *
   * @default 1
   */
  count: number

  /**
   * The default active page.
   *
   * @default 1
   */
  defaultPage?: number | undefined

  /**
   * The default number of data items to show per page.
   *
   * @default 1
   */
  defaultPageSize?: number | undefined

  /**
   * aria-label for the next-page button
   *
   * @default 'Go to next page'
   */
  nextPageAriaLabel?: string | undefined

  /**
   * Callback fired when the page value changes.
   */
  onPageChange?: (page: number) => void

  /**
   * Callback fired when the rowsPerPage value changes.
   */
  onPageSizeChange?: (
    /**
     * The next value.
     */
    pageSize: number,
  ) => void

  /**
   * The current page (controlled).
   */
  page?: number | undefined

  /**
   * Override the default aria-label for each page button.
   *
   * @default (page: number) => `Go to page ${page}`
   */
  pageAriaLabel?: ((page: number) => string) | undefined

  /**
   * The number of rows to show per page.
   *
   * @default 1
   */
  pageSize?: number | undefined

  /**
   * aria-label for the prev-page button
   *
   * @default 'Go to previous page'
   */
  prevPageAriaLabel?: string | undefined

  /**
   * Number of always visible pages before and after the current page.
   *
   * @default 1
   */
  siblingCount?: number | undefined
}

interface Computed {
  pageCount: number
  pageEnd: number
  /** visible page items */
  pageItems: PageItem[]
  pageMetadata: PageMetadata
  pageStart: number
}

interface Context {
  page: number
  pageSize: number
}

interface Ids {
  pageSizeLabel: string | undefined
}

export interface PaginationSchema extends MachineSchema {
  actions: Record<
    | "goToFirstPage"
    | "goToLastPage"
    | "goToNextPage"
    | "goToPage"
    | "goToPrevPage"
    | "setPageIfNeeded"
    | "setPageSize",
    () => void
  >
  computed: Computed
  context: Context
  events:
    | {
        type:
          | "GO_TO_FIRST_PAGE"
          | "GO_TO_LAST_PAGE"
          | "GO_TO_NEXT_PAGE"
          | "GO_TO_PREV_PAGE"
      }
    | {type: "SET_PAGE_IF_NEEDED"}
    | {
        page: number
        type: "GO_TO_PAGE"
      }
    | {pageSize: number; type: "SET_PAGE_SIZE"}
  guards: Record<
    "canGoToNextPage" | "canGoToPage" | "canGoToPrevPage",
    () => boolean | undefined
  >
  ids: Ids
  props: RequiredBy<
    PaginationApiProps,
    | "boundaryCount"
    | "defaultPage"
    | "defaultPageSize"
    | "nextPageAriaLabel"
    | "pageAriaLabel"
    | "prevPageAriaLabel"
    | "siblingCount"
    | "count"
  >
}

interface PaginationScope {
  "data-scope": "pagination"
}

export interface PaginationNextTriggerBindings extends PaginationScope {
  "aria-label": string
  "data-disabled": BooleanDataAttr
  "data-part": "next-trigger"
  disabled?: boolean
  onClick: JSX.MouseEventHandler
}

export type PaginationPageItemBindings =
  | {
      "aria-current": "page" | undefined
      "aria-label": string
      "data-active": BooleanDataAttr
      "data-page": number
      "data-part": "page-item"
      "data-scope": "pagination"
      "data-type": "page"
      onClick: JSX.MouseEventHandler
    }
  | {
      "data-part": "page-item"
      "data-scope": "pagination"
      "data-type": "separator"
      disabled: true
      role: "separator"
    }

export interface PaginationPageItemsBindings extends PaginationScope {
  "data-part": "page-items"
}

export interface PaginationPageMetadataBindings extends PaginationScope {
  "data-part": "page-metadata"
}

export interface PaginationPageSizeBindings extends PaginationScope {
  "data-part": "page-size"
}

export interface PaginationPageSizeLabelBindings extends PaginationScope {
  "data-part": "page-size-label"
  id: string
}

export interface PaginationPrevTriggerBindings extends PaginationScope {
  "aria-label": string
  "data-disabled": BooleanDataAttr
  "data-part": "prev-trigger"
  disabled?: boolean
  onClick: JSX.MouseEventHandler
}

export interface PaginationRootBindings extends PaginationScope {
  "data-part": "root"
}

export interface PaginationApi extends Computed {
  defaultPageSize?: number
  goToFirstPage: (details: EventDetails) => void
  goToLastPage: (details: EventDetails) => void
  goToNextPage: (details: EventDetails) => void
  goToPage: (page: number) => void
  goToPrevPage: (param: EventDetails) => void
  page: number
  pageSize: number
  pageSizeLabelId?: string
  setPageSize: (pageSize: number) => void

  // group: bindings
  getNextTriggerBindings(): PaginationNextTriggerBindings
  getPageItemBindings(item: PageItem): PaginationPageItemBindings
  getPageItemsBindings(): PaginationPageItemsBindings
  getPageMetadataBindings(): PaginationPageMetadataBindings
  getPageSizeBindings(): PaginationPageSizeBindings
  getPageSizeLabelBindings(
    props: IdParam & ElementCleanup,
  ): PaginationPageSizeLabelBindings
  getPrevTriggerBindings(): PaginationPrevTriggerBindings
  getRootBindings(): PaginationRootBindings
}
