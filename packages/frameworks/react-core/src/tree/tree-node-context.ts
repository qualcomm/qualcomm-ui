// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {NodeProps, NodeState} from "@qualcomm-ui/core/tree"
import {createGuardedContext} from "@qualcomm-ui/react-core/context"

export const [TreeNodeStateContextProvider, useTreeNodeStateContext] =
  createGuardedContext<NodeState>({
    hookName: "useTreeNodeContext",
    providerName: "<TreeNodeContextProvider>",
    strict: true,
  })

export const [TreeNodePropsContextProvider, useTreeNodePropsContext] =
  createGuardedContext<NodeProps>({
    hookName: "useTreeNodeContext",
    providerName: "<TreeNodeContextProvider>",
    strict: true,
  })
