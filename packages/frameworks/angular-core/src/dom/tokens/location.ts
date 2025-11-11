// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {inject, InjectionToken} from "@angular/core"

import {WINDOW} from "./window"

export const LOCATION = new InjectionToken<Location>(
  "An abstraction over window.location object",
  {
    factory: () => inject(WINDOW).location,
  },
)
