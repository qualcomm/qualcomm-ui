// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {computed, Directive, inject, input} from "@angular/core"

import {
  provideQdsInputContext,
  QdsInputContextService,
} from "@qualcomm-ui/angular/input"
import type {LucideIconOrString} from "@qualcomm-ui/angular-core/lucide"
import {normalizeProps} from "@qualcomm-ui/angular-core/machine"
import {
  CoreSelectRootDirective,
  provideSelectContext,
} from "@qualcomm-ui/angular-core/select"
import type {SignalifyInput} from "@qualcomm-ui/angular-core/signals"
import {createQdsInputApi} from "@qualcomm-ui/qds-core/input"
import {
  createQdsSelectApi,
  type QdsSelectApi,
  type QdsSelectApiProps,
  type QdsSelectSize,
} from "@qualcomm-ui/qds-core/select"
import type {Explicit} from "@qualcomm-ui/utils/guard"

import {
  provideQdsSelectContext,
  QdsSelectContextService,
} from "./qds-select-context.service"

@Directive({
  providers: [
    provideSelectContext(),
    provideQdsSelectContext(),
    provideQdsInputContext(),
  ],
  selector: "[q-select-root]",
  standalone: false,
})
export class SelectRootDirective
  extends CoreSelectRootDirective
  implements SignalifyInput<QdsSelectApiProps>
{
  /**
   * {@link https://lucide.dev lucide icon}, positioned at the start of the trigger element.
   */
  readonly icon = input<LucideIconOrString>()

  /**
   * The size of the select and its elements. Governs properties like font size,
   * item padding, and icon sizes.
   *
   * @default 'md'
   */
  readonly size = input<QdsSelectSize>("md")

  protected readonly qdsSelectService = inject(QdsSelectContextService)
  protected readonly qdsInputService = inject(QdsInputContextService)

  override ngOnInit() {
    this.trackBindings.extendWith(
      computed(() => this.qdsSelectService.context().getRootBindings()),
    )

    this.qdsSelectService.init(
      computed<QdsSelectApi>(() =>
        createQdsSelectApi(
          {
            size: this.size(),
          } satisfies Explicit<QdsSelectApiProps>,
          normalizeProps,
        ),
      ),
    )

    this.qdsInputService.init(
      computed(() =>
        createQdsInputApi(
          {
            size: this.size(),
            startIcon: this.icon(),
          },
          normalizeProps,
        ),
      ),
    )

    super.ngOnInit()
  }
}
