// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {createProps, createSplitProps} from "@qualcomm-ui/utils/object"

import type {ComboboxApiProps} from "./combobox.types"

export const comboboxProps: (keyof ComboboxApiProps)[] =
  createProps<ComboboxApiProps>()(
    "allowCustomValue",
    "alwaysSubmitOnEnter",
    "autoFocus",
    "closeOnSelect",
    "collection",
    "composite",
    "defaultHighlightedValue",
    "defaultInputValue",
    "defaultOpen",
    "defaultValue",
    "dir",
    "disabled",
    "disableLayer",
    "form",
    "getRootNode",
    "highlightedValue",
    "ids",
    "inputBehavior",
    "inputValue",
    "invalid",
    "loopFocus",
    "multiple",
    "name",
    "onFocusOutside",
    "onHighlightChange",
    "onInputValueChange",
    "onInteractOutside",
    "onOpenChange",
    "onPointerDownOutside",
    "onSelect",
    "onValueChange",
    "open",
    "openOnChange",
    "openOnClick",
    "openOnKeyPress",
    "placeholder",
    "positioning",
    "readOnly",
    "required",
    "scrollToIndexFn",
    "selectionBehavior",
    "translations",
    "value",
  )

export const splitComboboxProps: <Props extends ComboboxApiProps>(
  props: Props,
) => [ComboboxApiProps, Omit<Props, keyof ComboboxApiProps>] =
  createSplitProps<ComboboxApiProps>(comboboxProps)
