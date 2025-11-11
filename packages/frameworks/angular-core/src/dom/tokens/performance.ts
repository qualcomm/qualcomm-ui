// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {inject, InjectionToken} from "@angular/core"

import {WINDOW} from "./window"

export const PERFORMANCE = new InjectionToken<Performance>(
  "An abstraction over window.performance object",
  {
    factory: () => inject(WINDOW).performance,
  },
)
