// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

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
