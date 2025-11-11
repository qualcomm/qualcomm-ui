// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {createProps, createSplitProps} from "@qualcomm-ui/utils/object"

import type {SwitchApiProps} from "./switch.types"

export const switchProps: (keyof SwitchApiProps)[] =
  createProps<SwitchApiProps>()(
    "checked",
    "defaultChecked",
    "dir",
    "disabled",
    "getRootNode",
    "form",
    "ids",
    "invalid",
    "name",
    "onCheckedChange",
    "onFocusChange",
    "readOnly",
    "required",
    "value",
  )

export const splitSwitchProps: <Props extends SwitchApiProps>(
  props: Props,
) => [SwitchApiProps, Omit<Props, keyof SwitchApiProps>] =
  createSplitProps<SwitchApiProps>(switchProps)
