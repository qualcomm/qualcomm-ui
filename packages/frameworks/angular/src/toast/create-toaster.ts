// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  createToastStore,
  type ToasterCreateOptions,
  type ToastOptions,
  type ToastStore,
} from "@qualcomm-ui/core/toast"

export interface ToasterInstance extends ToastStore<string> {}

export interface ToastCreateOptions extends ToastOptions<string> {}

export function createToaster(options: ToasterCreateOptions): ToasterInstance {
  return createToastStore<string>(options)
}
