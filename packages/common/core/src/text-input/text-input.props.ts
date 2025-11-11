// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {createProps, createSplitProps} from "@qualcomm-ui/utils/object"

import type {TextInputApiProps} from "./text-input.types"

const textInputProps: (keyof TextInputApiProps)[] =
  createProps<TextInputApiProps>()(
    "defaultValue",
    "dir",
    "disabled",
    "getRootNode",
    "form",
    "ids",
    "invalid",
    "name",
    "onFocusChange",
    "onValueChange",
    "readOnly",
    "required",
    "value",
  )

export const splitTextInputProps: <Props extends TextInputApiProps>(
  props: Props,
) => [TextInputApiProps, Omit<Props, keyof TextInputApiProps>] =
  createSplitProps<TextInputApiProps>(textInputProps)
