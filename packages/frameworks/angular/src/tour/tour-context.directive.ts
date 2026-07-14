// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Directive, inject} from "@angular/core"

import {ApiContextDirective} from "@qualcomm-ui/angular-core/machine"
import {TourContextService} from "@qualcomm-ui/angular-core/tour"
import type {TourApi} from "@qualcomm-ui/core/tour"

@Directive({
  selector: "[tourContext]",
  standalone: false,
})
export class TourContextDirective extends ApiContextDirective<TourApi> {
  constructor() {
    super(inject(TourContextService), "tourContext")
  }

  static ngTemplateContextGuard(
    _dir: TourContextDirective,
    _ctx: unknown,
  ): _ctx is {$implicit: TourApi} {
    return true
  }
}
