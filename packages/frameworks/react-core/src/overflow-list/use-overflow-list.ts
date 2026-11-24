// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  createOverflowListApi,
  type OverflowListApi,
  type OverflowListApiProps,
  overflowListMachine,
} from "@qualcomm-ui/core/overflow-list"
import {normalizeProps, useMachine} from "@qualcomm-ui/react-core/machine"

export function useOverflowList(props: OverflowListApiProps): OverflowListApi {
  const machine = useMachine(overflowListMachine, props)
  return createOverflowListApi(machine, normalizeProps)
}
