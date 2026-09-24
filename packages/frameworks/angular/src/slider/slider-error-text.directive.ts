// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Component, computed, input} from "@angular/core"
import {LucideCircleAlert} from "@lucide/angular"

import type {LucideIconOrString} from "@qualcomm-ui/angular-core/lucide"
import {CoreSliderErrorTextDirective} from "@qualcomm-ui/angular-core/slider"

import {useQdsSliderContext} from "./qds-slider-context.service"

@Component({
  selector: "[q-slider-error-text]",
  standalone: false,
  template: `
    <svg [qIcon]="icon()!" />
    <ng-content />
  `,
})
export class SliderErrorTextDirective extends CoreSliderErrorTextDirective {
  /**
   * Error indicator icon.
   *
   * @default LucideCircleAlert
   */
  readonly icon = input<LucideIconOrString>(LucideCircleAlert)

  protected readonly qdsSliderContext = useQdsSliderContext()

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.qdsSliderContext().getErrorTextBindings()),
    )
  }
}
