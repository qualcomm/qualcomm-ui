// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {createProps, createSplitProps} from "@qualcomm-ui/utils/object"

import type {DialogApiProps} from "./dialog.types"

export const dialogProps: (keyof DialogApiProps)[] =
  createProps<DialogApiProps>()(
    "aria-label",
    "closeOnEscape",
    "closeOnInteractOutside",
    "defaultOpen",
    "dir",
    "finalFocusEl",
    "getRootNode",
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
    "preventScroll",
    "restoreFocus",
    "role",
    "trapFocus",
  )

export const splitDialogProps: <Props extends DialogApiProps>(
  props: Props,
) => [DialogApiProps, Omit<Props, keyof DialogApiProps>] =
  createSplitProps<DialogApiProps>(dialogProps)
