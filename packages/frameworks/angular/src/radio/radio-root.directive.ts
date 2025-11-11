// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {computed, Directive, inject, input} from "@angular/core"

import {normalizeProps} from "@qualcomm-ui/angular-core/machine"
import {
  CoreRadioRootDirective,
  provideRadioItemContext,
} from "@qualcomm-ui/angular-core/radio"
import type {SignalifyInput} from "@qualcomm-ui/angular-core/signals"
import {
  createQdsRadioApi,
  type QdsRadioApiProps,
  type QdsRadioSize,
} from "@qualcomm-ui/qds-core/radio"

import {
  provideQdsRadioContext,
  QdsRadioContextService,
  useQdsRadioContext,
} from "./qds-radio-context.service"

@Directive({
  providers: [provideRadioItemContext(), provideQdsRadioContext()],
  selector: "[q-radio-root]",
  standalone: false,
})
export class RadioRootDirective
  extends CoreRadioRootDirective
  implements SignalifyInput<QdsRadioApiProps>
{
  /**
   * The size of the radio and its elements. Governs properties like label font
   * size, control size, and indicator size.
   * @default 'md'
   */
  readonly size = input<QdsRadioSize | undefined>()

  readonly parentQdsRadioContext = useQdsRadioContext({
    optional: true,
    skipSelf: true,
  })
  readonly qdsRadioService = inject(QdsRadioContextService, {self: true})

  override ngOnInit() {
    super.ngOnInit()

    this.qdsRadioService.init(
      computed(() =>
        createQdsRadioApi(
          {size: this.size() || this.parentQdsRadioContext?.()?.size},
          normalizeProps,
        ),
      ),
    )

    this.trackBindings.extendWith(
      computed(() => this.qdsRadioService.context().getItemBindings()),
    )
  }
}
