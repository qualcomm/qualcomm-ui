// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {SliderApi, ThumbProps} from "@qualcomm-ui/core/slider"
import {createGuardedContext} from "@qualcomm-ui/react-core/context"

export const [SliderContextProvider, useSliderContext] =
  createGuardedContext<SliderApi>({
    hookName: "useSliderContext",
    providerName: "<SliderContextProvider>",
    strict: true,
  })

export const [SliderThumbContextProvider, useSliderThumbContext] =
  createGuardedContext<ThumbProps>({
    hookName: "useSliderThumbContext",
    providerName: "<SliderThumbContextProvider>",
    strict: true,
  })
