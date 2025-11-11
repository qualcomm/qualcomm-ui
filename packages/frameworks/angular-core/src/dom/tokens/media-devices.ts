// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {inject, InjectionToken} from "@angular/core"

import {NAVIGATOR} from "./navigator"

export const MEDIA_DEVICES = new InjectionToken<MediaDevices>(
  "An abstraction over window.navigator.mediaDevices object",
  {
    factory: () => inject(NAVIGATOR).mediaDevices,
  },
)
