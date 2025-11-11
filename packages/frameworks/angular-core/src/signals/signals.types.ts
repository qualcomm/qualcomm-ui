// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {Signal} from "@angular/core"

export type MaybeSignal<T> = T | Signal<T>
