// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {ElementRef, inject, Injectable, InjectionToken} from "@angular/core"

export const PORTAL_CONTAINER = new InjectionToken<
  ElementRef<HTMLElement> | HTMLElement | null
>("PORTAL_CONTAINER", {
  factory: () => null,
})

@Injectable()
export class PortalContextService {
  readonly container = inject(PORTAL_CONTAINER, {optional: true})
}
