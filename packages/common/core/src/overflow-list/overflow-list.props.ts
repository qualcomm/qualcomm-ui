// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {createProps, createSplitProps} from "@qualcomm-ui/utils/object"

import type {OverflowListApiProps} from "./overflow-list.types.js"

export const overflowListProps: (keyof OverflowListApiProps)[] =
  createProps<OverflowListApiProps>()(
    "count",
    "defaultExpanded",
    "dir",
    "expanded",
    "getRootNode",
    "ids",
    "maxRows",
    "onExpandedChange",
    "reservedWidth",
  )

export const splitOverflowListProps: <Props extends OverflowListApiProps>(
  props: Props,
) => [OverflowListApiProps, Omit<Props, keyof OverflowListApiProps>] =
  createSplitProps<OverflowListApiProps>(overflowListProps)
