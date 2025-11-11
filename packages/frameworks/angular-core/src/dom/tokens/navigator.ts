// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {inject, InjectionToken} from "@angular/core"

import {WINDOW} from "./window"

export const NAVIGATOR = new InjectionToken<Navigator>(
  "An abstraction over window.navigator object",
  {
    factory: () => inject(WINDOW).navigator,
  },
)
