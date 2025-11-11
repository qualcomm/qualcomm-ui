// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {createProps, createSplitProps} from "@qualcomm-ui/utils/object"

import type {SelectApiProps} from "./select.types"

const selectProps: (keyof SelectApiProps)[] = createProps<SelectApiProps>()(
  "closeOnSelect",
  "collection",
  "defaultHighlightedValue",
  "defaultOpen",
  "defaultValue",
  "deselectable",
  "dir",
  "disabled",
  "form",
  "getRootNode",
  "highlightedValue",
  "id",
  "ids",
  "invalid",
  "loopFocus",
  "multiple",
  "name",
  "onFocusOutside",
  "onHighlightChange",
  "onInteractOutside",
  "onOpenChange",
  "onPointerDownOutside",
  "onSelect",
  "onValueChange",
  "open",
  "placeholder",
  "positioning",
  "readOnly",
  "required",
  "scrollToIndexFn",
  "value",
)

export const splitSelectProps: <Props extends SelectApiProps>(
  props: Props,
) => [SelectApiProps, Omit<Props, keyof SelectApiProps>] =
  createSplitProps<SelectApiProps>(selectProps)
