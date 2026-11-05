// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {Context, Provider} from "react"

export type CreateContextReturn<T> = [
  Provider<T>,
  (requireContext?: boolean) => T,
  Context<T>,
]
