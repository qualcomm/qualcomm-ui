// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {createProps, createSplitProps} from "@qualcomm-ui/utils/object"

import type {TagApiProps} from "./tag.types"

export const toggleProps: (keyof TagApiProps)[] = createProps<TagApiProps>()(
  "defaultSelected",
  "dir",
  "disabled",
  "onDismiss",
  "onSelectedChange",
  "selected",
  "variant",
)

export const splitTagProps: <Props extends TagApiProps>(
  props: Props,
) => [TagApiProps, Omit<Props, keyof TagApiProps>] =
  createSplitProps<TagApiProps>(toggleProps)
