// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {InjectionToken, type Signal} from "@angular/core"

import type {Dict} from "@qualcomm-ui/utils/object"

export interface IconTokenContext {
  getBindings: Signal<Dict>
}

export const START_ICON_CONTEXT_TOKEN = new InjectionToken<IconTokenContext>(
  "START_ICON_TOKEN",
)

export const END_ICON_CONTEXT_TOKEN = new InjectionToken<IconTokenContext>(
  "END_ICON_TOKEN",
)
