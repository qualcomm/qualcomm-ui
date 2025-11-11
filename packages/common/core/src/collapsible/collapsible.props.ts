// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {createProps, createSplitProps} from "@qualcomm-ui/utils/object"

import type {CollapsibleApiProps} from "./collapsible.types"

export const collapsibleProps: (keyof CollapsibleApiProps)[] =
  createProps<CollapsibleApiProps>()(
    "defaultOpen",
    "dir",
    "disabled",
    "getRootNode",
    "onExitComplete",
    "onOpenChange",
    "open",
  )

export const splitCollapsibleProps: <Props extends CollapsibleApiProps>(
  props: Props,
) => [CollapsibleApiProps, Omit<Props, keyof CollapsibleApiProps>] =
  createSplitProps<CollapsibleApiProps>(collapsibleProps)
