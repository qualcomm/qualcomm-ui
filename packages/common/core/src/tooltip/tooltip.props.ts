// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {createProps, createSplitProps} from "@qualcomm-ui/utils/object"

import type {TooltipApiProps} from "./tooltip.types"

export const tooltipProps: (keyof TooltipApiProps)[] =
  createProps<TooltipApiProps>()(
    "dir",
    "positioning",
    "open",
    "disabled",
    "closeOnClick",
    "closeOnEscape",
    "onOpenChange",
  )

export const splitTooltipProps: <Props extends TooltipApiProps>(
  props: Props,
) => [TooltipApiProps, Omit<Props, keyof TooltipApiProps>] =
  createSplitProps<TooltipApiProps>(tooltipProps)
