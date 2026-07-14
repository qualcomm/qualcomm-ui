// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {createProps, createSplitProps} from "@qualcomm-ui/utils/object"

import type {TourApiProps} from "./tour.types.js"

const tourProps: (keyof TourApiProps)[] = createProps<TourApiProps>()(
  "closeOnEscape",
  "closeOnInteractOutside",
  "dir",
  "getRootNode",
  "ids",
  "keyboardNavigation",
  "onFocusOutside",
  "onInteractOutside",
  "onPointerDownOutside",
  "onStatusChange",
  "onStepChange",
  "onStepsChange",
  "preventInteraction",
  "spotlightOffset",
  "spotlightRadius",
  "stepId",
  "steps",
  "translations",
)

export const splitTourProps: <Props extends TourApiProps>(
  props: Props,
) => [TourApiProps, Omit<Props, keyof TourApiProps>] =
  createSplitProps<TourApiProps>(tourProps)
