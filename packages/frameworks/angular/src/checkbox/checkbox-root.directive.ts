// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {computed, Directive, inject, input} from "@angular/core"

import {
  CoreCheckboxRootDirective,
  provideCheckboxContext,
} from "@qualcomm-ui/angular-core/checkbox"
import {normalizeProps} from "@qualcomm-ui/angular-core/machine"
import type {SignalifyInput} from "@qualcomm-ui/angular-core/signals"
import {
  createQdsCheckboxApi,
  type QdsCheckboxApiProps,
  type QdsCheckboxSize,
} from "@qualcomm-ui/qds-core/checkbox"

import {
  provideQdsCheckboxContext,
  QdsCheckboxContextService,
} from "./qds-checkbox-context.service"

/**
 * Groups all parts of the checkbox.
 */
@Directive({
  providers: [provideCheckboxContext(), provideQdsCheckboxContext()],
  selector: "[q-checkbox-root]",
  standalone: false,
})
export class CheckboxRootDirective
  extends CoreCheckboxRootDirective
  implements SignalifyInput<QdsCheckboxApiProps>
{
  /**
   * The size of the checkbox and its elements. Governs properties like label font
   * size, control size, and indicator size.
   * @default 'md'
   */
  readonly size = input<QdsCheckboxSize | undefined>()

  readonly qdsCheckboxService = inject(QdsCheckboxContextService)

  override ngOnInit() {
    super.ngOnInit()

    this.qdsCheckboxService.init(
      computed(() => createQdsCheckboxApi({size: this.size()}, normalizeProps)),
    )

    this.trackBindings.extendWith(
      computed(() => this.qdsCheckboxService.context().getRootBindings()),
    )
  }
}
