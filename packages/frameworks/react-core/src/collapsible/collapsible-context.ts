// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {CollapsibleApi} from "@qualcomm-ui/core/collapsible"
import {createGuardedContext} from "@qualcomm-ui/react-core/context"

export interface CollapsibleContextValue extends CollapsibleApi {
  /**
   * Whether content should be unmounted according to the render strategy.
   */
  isUnmounted?: boolean
}

export const [CollapsibleContextProvider, useCollapsibleContext] =
  createGuardedContext<CollapsibleContextValue>({
    hookName: "useCollapsibleContext",
    providerName: "<CollapsibleContextProvider>",
    strict: true,
  })
