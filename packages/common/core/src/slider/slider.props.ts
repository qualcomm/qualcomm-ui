// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {createProps, createSplitProps} from "@qualcomm-ui/utils/object"

import type {SliderApiProps} from "./slider.types"

export const sliderProps: (keyof SliderApiProps)[] =
  createProps<SliderApiProps>()(
    "aria-label",
    "aria-labelledby",
    "defaultValue",
    "dir",
    "disabled",
    "form",
    "getAriaValueText",
    "invalid",
    "max",
    "min",
    "minStepsBetweenThumbs",
    "name",
    "onFocusChange",
    "onValueChange",
    "onValueChangeEnd",
    "orientation",
    "origin",
    "readOnly",
    "step",
    "thumbAlignment",
    "thumbSize",
    "value",
  )

export const splitSliderProps: <Props extends SliderApiProps>(
  props: Props,
) => [SliderApiProps, Omit<Props, keyof SliderApiProps>] =
  createSplitProps<SliderApiProps>(sliderProps)
