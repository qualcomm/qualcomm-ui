// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {computed, Directive, inject, input} from "@angular/core"

import {normalizeProps} from "@qualcomm-ui/angular-core/machine"
import {
  CoreSliderRootDirective,
  provideSliderContext,
} from "@qualcomm-ui/angular-core/slider"
import {
  createQdsSliderApi,
  type QdsSliderSize,
  type QdsSliderVariant,
} from "@qualcomm-ui/qds-core/slider"

import {
  provideQdsSliderContext,
  QdsSliderContextService,
} from "./qds-slider-context.service"

@Directive({
  providers: [provideSliderContext(), provideQdsSliderContext()],
  selector: "[q-slider-root]",
  standalone: false,
})
export class SliderRootDirective extends CoreSliderRootDirective {
  /**
   * The size of the slider.
   */
  readonly size = input<QdsSliderSize>()

  /**
   * The variant of the slider.
   */
  readonly variant = input<QdsSliderVariant>()

  readonly qdsSliderService = inject(QdsSliderContextService)

  override ngOnInit() {
    super.ngOnInit()

    this.qdsSliderService.init(
      computed(() =>
        createQdsSliderApi(
          {size: this.size(), variant: this.variant()},
          normalizeProps,
        ),
      ),
    )

    this.trackBindings.extendWith(
      computed(() => this.qdsSliderService.context().getRootBindings()),
    )
  }
}
