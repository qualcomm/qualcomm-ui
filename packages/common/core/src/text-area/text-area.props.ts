// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {createProps, createSplitProps} from "@qualcomm-ui/utils/object"

import type {TextAreaApiProps} from "./text-area.types.js"

const textAreaProps: (keyof TextAreaApiProps)[] =
  createProps<TextAreaApiProps>()(
    "defaultValue",
    "dir",
    "disabled",
    "getRootNode",
    "form",
    "ids",
    "invalid",
    "maxLength",
    "name",
    "onFocusChange",
    "onValueChange",
    "readOnly",
    "required",
    "value",
  )

export const splitTextAreaProps: <Props extends TextAreaApiProps>(
  props: Props,
) => [TextAreaApiProps, Omit<Props, keyof TextAreaApiProps>] =
  createSplitProps<TextAreaApiProps>(textAreaProps)
