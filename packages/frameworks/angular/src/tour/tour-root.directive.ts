// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {computed, Directive, inject, type OnInit} from "@angular/core"

import {normalizeProps} from "@qualcomm-ui/angular-core/machine"
import {
  CoreTourRootDirective,
  provideTourContext,
} from "@qualcomm-ui/angular-core/tour"
import {createQdsTourApi} from "@qualcomm-ui/qds-core/tour"

import {
  provideQdsTourContext,
  QdsTourContextService,
} from "./qds-tour-context.service"

@Directive({
  providers: [provideTourContext(), provideQdsTourContext()],
  selector: "[q-tour-root]",
  standalone: false,
})
export class TourRootDirective extends CoreTourRootDirective implements OnInit {
  protected readonly qdsTourContext = inject(QdsTourContextService)

  override ngOnInit() {
    super.ngOnInit()
    this.qdsTourContext.init(computed(() => createQdsTourApi(normalizeProps)))
  }
}
