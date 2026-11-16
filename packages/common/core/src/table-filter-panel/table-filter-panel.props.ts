// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {createProps, createSplitProps} from "@qualcomm-ui/utils/object"

import type {TableFilterPanelApiProps} from "./table-filter-panel.types.js"

export const tableFilterPanelProps: (keyof TableFilterPanelApiProps)[] =
  createProps<TableFilterPanelApiProps>()("applyMode", "table")

export const splitTableFilterPanelProps: <
  Props extends TableFilterPanelApiProps,
>(
  props: Props,
) => [TableFilterPanelApiProps, Omit<Props, keyof TableFilterPanelApiProps>] =
  createSplitProps<TableFilterPanelApiProps>(tableFilterPanelProps)
