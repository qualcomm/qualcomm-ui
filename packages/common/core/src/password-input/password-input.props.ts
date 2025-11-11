// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {createProps, createSplitProps} from "@qualcomm-ui/utils/object"

import type {PasswordInputApiProps} from "./password-input.types"

const passwordInputProps: (keyof PasswordInputApiProps)[] =
  createProps<PasswordInputApiProps>()(
    "autoComplete",
    "defaultValue",
    "defaultVisible",
    "dir",
    "disabled",
    "getRootNode",
    "form",
    "ids",
    "invalid",
    "name",
    "onFocusChange",
    "onValueChange",
    "onVisibleChange",
    "readOnly",
    "required",
    "translations",
    "value",
    "visible",
  )

export const splitPasswordInputProps: <Props extends PasswordInputApiProps>(
  props: Props,
) => [PasswordInputApiProps, Omit<Props, keyof PasswordInputApiProps>] =
  createSplitProps<PasswordInputApiProps>(passwordInputProps)
