// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {TreeApi} from "@qualcomm-ui/core/tree"
import {createGuardedContext} from "@qualcomm-ui/react-core/context"
import type {TreeNode} from "@qualcomm-ui/utils/collection"

export interface UseTreeContext<T extends TreeNode> extends TreeApi<T> {}

export const [TreeContextProvider, useTreeContextImpl] = createGuardedContext<
  UseTreeContext<TreeNode>
>({
  hookName: "useTreeContext",
  providerName: "<TreeContextProvider>",
  strict: true,
})

export function useTreeContext<T extends TreeNode = TreeNode>(): TreeApi<T> {
  return useTreeContextImpl()
}
