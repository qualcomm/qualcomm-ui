// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {computed, Directive, inject, input} from "@angular/core"

import {normalizeProps} from "@qualcomm-ui/angular-core/machine"
import type {SignalifyInput} from "@qualcomm-ui/angular-core/signals"
import {
  CoreSwitchRootDirective,
  provideSwitchContext,
} from "@qualcomm-ui/angular-core/switch"
import {
  createQdsSwitchApi,
  type QdsSwitchApiProps,
  type QdsSwitchSize,
} from "@qualcomm-ui/qds-core/switch"

import {
  provideQdsSwitchContext,
  QdsSwitchContextService,
} from "./qds-switch-context.service"

@Directive({
  providers: [provideSwitchContext(), provideQdsSwitchContext()],
  selector: "[q-switch-root]",
  standalone: false,
})
export class SwitchRootDirective
  extends CoreSwitchRootDirective
  implements SignalifyInput<QdsSwitchApiProps>
{
  /**
   * Size of the component and its label.
   *
   * @default "md"
   */
  readonly size = input<QdsSwitchSize | undefined>()

  readonly qdsSwitchService = inject(QdsSwitchContextService)

  override ngOnInit() {
    super.ngOnInit()

    this.qdsSwitchService.init(
      computed(() => createQdsSwitchApi({size: this.size()}, normalizeProps)),
    )

    this.trackBindings.extendWith(
      computed(() => this.qdsSwitchService.context().getRootBindings()),
    )
  }
}
