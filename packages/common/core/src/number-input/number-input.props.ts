// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {createProps, createSplitProps} from "@qualcomm-ui/utils/object"

import type {NumberInputApiProps} from "./number-input.types"

export const numberInputProps: (keyof NumberInputApiProps)[] =
  createProps<NumberInputApiProps>()(
    "allowMouseWheel",
    "allowOverflow",
    "clampValueOnBlur",
    "defaultValue",
    "dir",
    "disabled",
    "focusInputOnChange",
    "form",
    "formatOptions",
    "getRootNode",
    "ids",
    "inputMode",
    "invalid",
    "locale",
    "max",
    "min",
    "name",
    "onFocusChange",
    "onValueChange",
    "onValueInvalid",
    "pattern",
    "readOnly",
    "required",
    "spinOnPress",
    "step",
    "translations",
    "value",
  )

export const splitNumberInputProps: <Props extends NumberInputApiProps>(
  props: Props,
) => [NumberInputApiProps, Omit<Props, keyof NumberInputApiProps>] =
  createSplitProps<NumberInputApiProps>(numberInputProps)
