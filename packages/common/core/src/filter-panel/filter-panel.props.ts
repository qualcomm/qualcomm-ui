// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {createProps, createSplitProps} from "@qualcomm-ui/utils/object"

import type {FilterPanelApiProps} from "./filter-panel.types.js"

export const filterPanelProps: (keyof FilterPanelApiProps)[] =
  createProps<FilterPanelApiProps>()(
    "applyMode",
    "defaultValue",
    "getFilterLabel",
    "getFilterOptionLabel",
    "isEmptyValue",
    "onValueChange",
    "value",
  )

export const splitFilterPanelProps: <Props extends FilterPanelApiProps>(
  props: Props,
) => [FilterPanelApiProps, Omit<Props, keyof FilterPanelApiProps>] =
  createSplitProps<FilterPanelApiProps>(filterPanelProps)
