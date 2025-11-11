// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {createProps, createSplitProps} from "@qualcomm-ui/utils/object"

import type {RadioApiProps} from "./radio.types"

export const radioProps: (keyof RadioApiProps)[] = createProps<RadioApiProps>()(
  "defaultValue",
  "dir",
  "disabled",
  "form",
  "getRootNode",
  "invalid",
  "name",
  "onValueChange",
  "orientation",
  "readOnly",
  "required",
  "value",
)

export const splitRadioProps: <Props extends RadioApiProps>(
  props: Props,
) => [RadioApiProps, Omit<Props, keyof RadioApiProps>] =
  createSplitProps<RadioApiProps>(radioProps)
