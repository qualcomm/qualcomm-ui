// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {computed, Directive, inject, input, type OnInit} from "@angular/core"

import {
  provideQdsInputContext,
  type QdsAngularInputApiProps,
  QdsInputContextService,
} from "@qualcomm-ui/angular/input"
import {INPUT_FORM_CONTROL_CONTEXT} from "@qualcomm-ui/angular-core/input"
import type {LucideIcon} from "@qualcomm-ui/angular-core/lucide"
import {normalizeProps} from "@qualcomm-ui/angular-core/machine"
import {
  CorePasswordInputRootDirective,
  providePasswordInputContext,
} from "@qualcomm-ui/angular-core/password-input"
import type {SignalifyInput} from "@qualcomm-ui/angular-core/signals"
import {createQdsInputApi, type QdsInputSize} from "@qualcomm-ui/qds-core/input"

@Directive({
  providers: [
    provideQdsInputContext(),
    providePasswordInputContext(),
    {
      provide: INPUT_FORM_CONTROL_CONTEXT,
      useFactory: () => {
        const passwordInputComponent = inject(PasswordInputRootDirective, {
          self: true,
        })
        return passwordInputComponent.formControlContext
      },
    },
  ],
  selector: "[q-password-input-root]",
  standalone: false,
})
export class PasswordInputRootDirective
  extends CorePasswordInputRootDirective
  implements SignalifyInput<Omit<QdsAngularInputApiProps, "endIcon">>, OnInit
{
  /**
   * The size of the input field and its elements. Governs properties like font
   * size, item padding, and icon sizes.
   *
   * @default 'md'
   */
  readonly size = input<QdsInputSize>()

  /**
   * {@link https://lucide.dev lucide-angular} icon, positioned at the start of
   * the input field.
   *
   * @remarks
   * To customize the element, provide it using the directive instead:
   *
   * ```angular-html
   * <div q-password-input-input-group>
   *   <div q-input-start-icon [icon]="..."></div>
   * </div>
   * ```
   */
  readonly startIcon = input<LucideIcon | string | undefined>()

  protected readonly qdsInputService = inject(QdsInputContextService)

  constructor() {
    super()
    this.trackBindings.extendWith(() =>
      this.qdsInputService.context().getRootBindings(),
    )
  }

  override ngOnInit() {
    super.ngOnInit()

    this.qdsInputService.init(
      computed(() =>
        createQdsInputApi(
          {size: this.size(), startIcon: this.startIcon()},
          normalizeProps,
        ),
      ),
    )
  }
}
