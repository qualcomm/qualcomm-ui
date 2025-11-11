// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {computed, Directive, inject, input, type OnInit} from "@angular/core"

import {
  provideQdsInputContext,
  type QdsAngularInputApiProps,
  QdsInputContextService,
} from "@qualcomm-ui/angular/input"
import type {LucideIcon} from "@qualcomm-ui/angular-core/lucide"
import {
  mergeProps,
  normalizeProps,
  useTrackBindings,
} from "@qualcomm-ui/angular-core/machine"
import type {SignalifyInput} from "@qualcomm-ui/angular-core/signals"
import {
  CoreTextInputRootDirective,
  provideTextInputContext,
} from "@qualcomm-ui/angular-core/text-input"
import {createQdsInputApi, type QdsInputSize} from "@qualcomm-ui/qds-core/input"

/**
 * Groups all parts of the text input.
 */
@Directive({
  providers: [provideTextInputContext(), provideQdsInputContext()],
  selector: "[q-text-input-root]",
  standalone: false,
})
export class TextInputRootDirective
  extends CoreTextInputRootDirective
  implements SignalifyInput<QdsAngularInputApiProps>, OnInit
{
  /**
   * {@link https://lucide.dev lucide-angular} icon, positioned after
   * the input.
   *
   * @remarks
   * To customize the element, provide it using the directive instead:
   *
   * ```angular-html
   * <div q-text-input-input-group>
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
   * <div q-text-input-input-group>
   *   <div q-input-start-icon [icon]="..."></div>
   * </div>
   * ```
   */
  readonly startIcon = input<LucideIcon | string | undefined>()

  protected readonly qdsInputService = inject(QdsInputContextService)

  protected override readonly trackBindings = useTrackBindings(() =>
    mergeProps(
      this.textInputService.context().getRootBindings(),
      this.qdsInputService.context().getRootBindings(),
    ),
  )

  override ngOnInit() {
    super.ngOnInit()

    const inputApi = computed(() =>
      createQdsInputApi(
        {
          endIcon: this.endIcon(),
          size: this.size(),
          startIcon: this.startIcon(),
        },
        normalizeProps,
      ),
    )

    this.qdsInputService.init(inputApi)
    this.trackBindings()
  }
}
