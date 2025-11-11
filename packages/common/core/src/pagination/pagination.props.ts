import {createProps, createSplitProps} from "@qualcomm-ui/utils/object"

import type {PaginationApiProps} from "./pagination.types"

const paginationProps: (keyof PaginationApiProps)[] =
  createProps<PaginationApiProps>()(
    "boundaryCount",
    "count",
    "defaultPage",
    "defaultPageSize",
    "nextPageAriaLabel",
    "onPageChange",
    "onPageSizeChange",
    "page",
    "pageAriaLabel",
    "pageSize",
    "prevPageAriaLabel",
    "siblingCount",
  )

export const splitProps: <Props extends PaginationApiProps>(
  props: Props,
) => [PaginationApiProps, Omit<Props, keyof PaginationApiProps>] =
  createSplitProps<PaginationApiProps>(paginationProps)
