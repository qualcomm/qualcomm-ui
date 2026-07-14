// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {computed, Directive} from "@angular/core"

import {CoreTourHeadingDirective} from "@qualcomm-ui/angular-core/tour"

import {useQdsTourContext} from "./qds-tour-context.service"

@Directive({selector: "[q-tour-heading]", standalone: false})
export class TourHeadingDirective extends CoreTourHeadingDirective {
  protected readonly qdsContext = useQdsTourContext()

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.qdsContext().getHeadingBindings()),
    )
  }
}
