// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {createProps, createSplitProps} from "@qualcomm-ui/utils/object"

import type {PopoverApiProps} from "./popover.types"

const popoverProps: (keyof PopoverApiProps)[] = createProps<PopoverApiProps>()(
  "autoFocus",
  "closeOnEscape",
  "closeOnInteractOutside",
  "defaultOpen",
  "dir",
  "getRootNode",
  "ids",
  "initialFocusEl",
  "modal",
  "onEscapeKeyDown",
  "onFocusOutside",
  "onInteractOutside",
  "onOpenChange",
  "onPointerDownOutside",
  "onRequestDismiss",
  "open",
  "persistentElements",
  "portalled",
  "positioning",
  "restoreFocus",
)

export const splitPopoverProps: <Props extends PopoverApiProps>(
  props: Props,
) => [PopoverApiProps, Omit<Props, keyof PopoverApiProps>] =
  createSplitProps<PopoverApiProps>(popoverProps)
