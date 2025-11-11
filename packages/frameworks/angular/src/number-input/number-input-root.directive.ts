// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {computed, Directive, inject, input, type OnInit} from "@angular/core"

import {
  provideQdsInputContext,
  type QdsAngularInputApiProps,
  QdsInputContextService,
} from "@qualcomm-ui/angular/input"
import type {LucideIcon} from "@qualcomm-ui/angular-core/lucide"
import {normalizeProps} from "@qualcomm-ui/angular-core/machine"
import {
  CoreNumberInputRootDirective,
  provideNumberInputContext,
} from "@qualcomm-ui/angular-core/number-input"
import type {SignalifyInput} from "@qualcomm-ui/angular-core/signals"
import {createQdsInputApi, type QdsInputSize} from "@qualcomm-ui/qds-core/input"
import {
  createQdsNumberInputApi,
  type QdsNumberInputApiProps,
} from "@qualcomm-ui/qds-core/number-input"

import {
  provideQdsNumberInputContext,
  QdsNumberInputContextService,
} from "./qds-number-input-context.service"

@Directive({
  providers: [
    provideNumberInputContext(),
    provideQdsInputContext(),
    provideQdsNumberInputContext(),
  ],
  selector: "[q-number-input-root]",
  standalone: false,
})
export class NumberInputRootDirective
  extends CoreNumberInputRootDirective
  implements
    SignalifyInput<QdsNumberInputApiProps>,
    SignalifyInput<QdsAngularInputApiProps>,
    OnInit
{
  /**
   * {@link https://lucide.dev lucide-angular} icon, positioned after
   * the input.
   *
   * @remarks
   * To customize the element, provide it using the directive instead:
   *
   * ```angular-html
   * <div q-number-input-input-group>
   *   <div q-input-end-icon [icon]="..."></div>
   * </div>
   * ```
   */
  readonly endIcon = input<LucideIcon | string | undefined>()

  /**
   * The size of the input field and its elements. Governs properties like font
   * size, item padding, and icon sizes.
   *
   * @default 'md'
   */
  readonly size = input<QdsInputSize>()

  /**
   * {@link https://lucide.dev lucide-angular} icon, positioned before
   * the input.
   *
   * @remarks
   * To customize the element, provide it using the directive instead:
   *
   * ```angular-html
   * <div q-number-input-input-group>
   *   <div q-input-start-icon [icon]="..."></div>
   * </div>
   * ```
   */
  readonly startIcon = input<LucideIcon | string | undefined>()

  readonly qdsInputService = inject(QdsInputContextService)
  readonly qdsNumberInputService = inject(QdsNumberInputContextService)

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.qdsInputService.context().getRootBindings()),
    )
  }

  override ngOnInit() {
    super.ngOnInit()

    this.qdsInputService.init(
      computed(() =>
        createQdsInputApi(
          {
            endIcon: this.endIcon(),
            size: this.size(),
            startIcon: this.startIcon(),
          },
          normalizeProps,
        ),
      ),
    )

    this.qdsNumberInputService.init(
      computed(() =>
        createQdsNumberInputApi({size: this.size()}, normalizeProps),
      ),
    )
  }
}
