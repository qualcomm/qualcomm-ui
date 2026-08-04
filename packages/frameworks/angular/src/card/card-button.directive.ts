// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Component, computed, inject, input} from "@angular/core"

import type {LucideIconOrString} from "@qualcomm-ui/angular-core/lucide"
import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"
import {useButtonApi} from "@qualcomm-ui/angular/button"
import {
  END_ICON_CONTEXT_TOKEN,
  type IconTokenContext,
  START_ICON_CONTEXT_TOKEN,
} from "@qualcomm-ui/angular/icon"
import {QuiPreloadDirective} from "@qualcomm-ui/angular/transitions"
import {
  type QdsCardButtonVariant,
  translateCardButtonProps,
} from "@qualcomm-ui/qds-core/card"

import {useQdsCardContext} from "./qds-card-context.service"

@Component({
  hostDirectives: [QuiPreloadDirective],
  providers: [
    {
      provide: START_ICON_CONTEXT_TOKEN,
      useFactory: (): IconTokenContext => {
        const button = inject(CardButtonDirective)
        return {
          getBindings: computed(() =>
            button.buttonApi().getStartIconBindings(),
          ),
        }
      },
    },
    {
      provide: END_ICON_CONTEXT_TOKEN,
      useFactory: (): IconTokenContext => {
        const button = inject(CardButtonDirective)
        return {
          getBindings: computed(() => button.buttonApi().getEndIconBindings()),
        }
      },
    },
  ],
  selector: "[q-card-button]",
  standalone: false,
  template: `
    <ng-content select="[q-start-icon]">
      @if (startIcon()) {
        <svg q-start-icon [icon]="startIcon()!"></svg>
      }
    </ng-content>

    <ng-content />

    <ng-content select="[q-end-icon]">
      @if (endIcon()) {
        <svg q-end-icon [icon]="endIcon()!"></svg>
      }
    </ng-content>
  `,
})
export class CardButtonDirective {
  /**
   * {@link https://lucide.dev/icons lucide-angular} icon, positioned after the label.
   *
   * @remarks
   * To customize the element, provide it using the directive instead:
   * ```angular-html
   * <svg q-end-icon icon="..."></svg>
   * ```
   */
  readonly endIcon = input<LucideIconOrString>()

  /**
   * {@link https://lucide.dev/icons lucide-angular} icon, positioned before the label.
   *
   * @remarks
   * To customize the element, provide it using the directive instead:
   * ```angular-html
   * <svg q-start-icon icon="..."></svg>
   * ```
   */
  readonly startIcon = input<LucideIconOrString>()

  /**
   * The visual variant of the card button. Maps to underlying QDS button
   * emphasis and variant props.
   *
   * @default 'primary'
   */
  readonly variant = input<QdsCardButtonVariant>()

  protected readonly qdsCardContext = useQdsCardContext()

  readonly buttonApi = useButtonApi({
    emphasis: computed(
      () => translateCardButtonProps({variant: this.variant()}).emphasis,
    ),
    variant: computed(
      () => translateCardButtonProps({variant: this.variant()}).variant,
    ),
  })

  protected readonly trackBindings = useTrackBindings(() =>
    this.buttonApi().getRootBindings(),
  )

  constructor() {
    this.trackBindings.extendWith(() =>
      this.qdsCardContext().getButtonBindings(),
    )

    this.trackBindings()
  }
}
