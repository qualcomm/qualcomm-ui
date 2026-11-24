// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  createQdsFilterControlApi,
  type QdsFilterControlApi,
} from "@qualcomm-ui/qds-core/filter-control"
import {createGuardedContext} from "@qualcomm-ui/react-core/context"
import {normalizeProps} from "@qualcomm-ui/react-core/machine"

/**
 * Sizes and styles filter controls. `FilterPanel` provides it from its own
 * size. Outside a panel, controls use the `sm` size unless a provider sets one.
 */
export const [QdsFilterControlContextProvider, useQdsFilterControlContext] =
  createGuardedContext<QdsFilterControlApi>({
    defaultValue: createQdsFilterControlApi({size: "sm"}, normalizeProps),
    hookName: "useQdsFilterControlContext",
    providerName: "<QdsFilterControlContextProvider>",
    strict: false,
  })
