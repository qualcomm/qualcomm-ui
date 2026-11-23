// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {FilterDefinitions} from "@qualcomm-ui/core/filters"
import {createProps, splitProps} from "@qualcomm-ui/utils/object"

import type {FilterSetApiProps} from "./filter-set.types.js"

export const filterSetProps: (keyof FilterSetApiProps)[] =
  createProps<FilterSetApiProps>()(
    "applyMode",
    "defaultValue",
    "filters",
    "getFilterCollection",
    "getFilterLabel",
    "getFilterOptionCounts",
    "getFilterRange",
    "isEmptyValue",
    "onDraftValueChange",
    "onValueChange",
    "value",
  )

/**
 * Splits the filter set props from the rest, keeping the types of the filter
 * definitions.
 */
export function splitFilterSetProps<
  TDefs extends FilterDefinitions,
  Props extends FilterSetApiProps<TDefs>,
>(
  props: Props,
): [FilterSetApiProps<TDefs>, Omit<Props, keyof FilterSetApiProps>] {
  return splitProps(props, filterSetProps as (keyof Props)[]) as [
    FilterSetApiProps<TDefs>,
    Omit<Props, keyof FilterSetApiProps>,
  ]
}
