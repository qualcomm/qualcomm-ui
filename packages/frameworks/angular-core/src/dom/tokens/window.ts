// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {DOCUMENT} from "@angular/common"
import {inject, InjectionToken} from "@angular/core"

export const WINDOW = new InjectionToken<Window>(
  "An abstraction over global window object",
  {
    factory: () => {
      const {defaultView} = inject(DOCUMENT)

      if (!defaultView) {
        throw new Error("Window is not available")
      }

      return defaultView
    },
  },
)
