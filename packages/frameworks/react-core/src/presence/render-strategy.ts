// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {RenderStrategyApiProps} from "@qualcomm-ui/core/presence"
import {createGuardedContext} from "@qualcomm-ui/react-core/context"

export const [RenderStrategyPropsProvider, useRenderStrategyPropsContext] =
  createGuardedContext<RenderStrategyApiProps>({
    hookName: "useRenderStrategyContext",
    name: "RenderStrategyContext",
    providerName: "<RenderStrategyApiPropsProvider />",
    strict: true,
  })
