// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {inject, InjectionToken} from "@angular/core"

import {WINDOW} from "./window"

export const LOCAL_STORAGE = new InjectionToken<Storage>(
  "An abstraction over window.localStorage object",
  {
    factory: () => inject(WINDOW).localStorage,
  },
)
