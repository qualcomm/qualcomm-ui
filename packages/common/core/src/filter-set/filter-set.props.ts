// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {createProps, createSplitProps} from "@qualcomm-ui/utils/object"

import type {FilterSetApiProps} from "./filter-set.types.js"

export const filterSetProps: (keyof FilterSetApiProps)[] =
  createProps<FilterSetApiProps>()(
    "applyMode",
    "defaultValue",
    "filters",
    "getFilterLabel",
    "getFilterOptionCounts",
    "getFilterOptionLabel",
    "getFilterOptions",
    "getFilterRange",
    "isEmptyValue",
    "onValueChange",
    "value",
  )

export const splitFilterSetProps: <Props extends FilterSetApiProps>(
  props: Props,
) => [FilterSetApiProps, Omit<Props, keyof FilterSetApiProps>] =
  createSplitProps<FilterSetApiProps>(filterSetProps)
