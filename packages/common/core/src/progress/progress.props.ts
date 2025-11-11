// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {createProps, createSplitProps} from "@qualcomm-ui/utils/object"

import type {ProgressApiProps} from "./progress.types"

export const progressProps: (keyof ProgressApiProps)[] =
  createProps<ProgressApiProps>()(
    "defaultValue",
    "dir",
    "ids",
    "invalid",
    "max",
    "min",
    "onValueChange",
    "value",
  )

export const splitProgressProps: <Props extends ProgressApiProps>(
  props: Props,
) => [ProgressApiProps, Omit<Props, keyof ProgressApiProps>] =
  createSplitProps<ProgressApiProps>(progressProps)
