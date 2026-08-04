// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {createProps, createSplitProps} from "@qualcomm-ui/utils/object"

import type {ToggleApiProps} from "./toggle.types.js"

export const toggleProps: (keyof ToggleApiProps)[] =
  createProps<ToggleApiProps>()(
    "defaultPressed",
    "dir",
    "disabled",
    "onPressedChange",
    "pressed",
  )

export const splitToggleProps: <Props extends ToggleApiProps>(
  props: Props,
) => [ToggleApiProps, Omit<Props, keyof ToggleApiProps>] =
  createSplitProps<ToggleApiProps>(toggleProps)
