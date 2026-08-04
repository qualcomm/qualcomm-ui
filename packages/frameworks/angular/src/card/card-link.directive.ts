// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Component, computed, inject, input} from "@angular/core"

import type {LucideIconOrString} from "@qualcomm-ui/angular-core/lucide"
import {
  normalizeProps,
  useTrackBindings,
} from "@qualcomm-ui/angular-core/machine"
import {
  END_ICON_CONTEXT_TOKEN,
  type IconTokenContext,
  START_ICON_CONTEXT_TOKEN,
} from "@qualcomm-ui/angular/icon"
import {QuiPreloadDirective} from "@qualcomm-ui/angular/transitions"
import {
  type QdsCardLinkVariant,
  translateCardLinkProps,
} from "@qualcomm-ui/qds-core/card"
import {createQdsLinkApi} from "@qualcomm-ui/qds-core/link"

import {useQdsCardContext} from "./qds-card-context.service"

@Component({
  hostDirectives: [QuiPreloadDirective],
  providers: [
    {
      provide: START_ICON_CONTEXT_TOKEN,
      useFactory: (): IconTokenContext => {
        const link = inject(CardLinkDirective)
        return {
          getBindings: computed(() => link.qdsLinkApi().getStartIconBindings()),
        }
      },
    },
    {
      provide: END_ICON_CONTEXT_TOKEN,
      useFactory: (): IconTokenContext => {
        const link = inject(CardLinkDirective)
        return {
          getBindings: computed(() => link.qdsLinkApi().getEndIconBindings()),
        }
      },
    },
  ],
  selector: "[q-card-link]",
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
export class CardLinkDirective {
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
   * The visual variant of the card link. Maps to underlying QDS link emphasis.
   *
   * @default 'primary'
   */
  readonly variant = input<QdsCardLinkVariant>()

  protected readonly qdsCardContext = useQdsCardContext()

  readonly qdsLinkApi = computed(() =>
    createQdsLinkApi(
      {
        emphasis: translateCardLinkProps({variant: this.variant()}).emphasis,
      },
      normalizeProps,
    ),
  )

  protected readonly trackBindings = useTrackBindings(() =>
    this.qdsLinkApi().getRootBindings(),
  )

  constructor() {
    this.trackBindings.extendWith(() => this.qdsCardContext().getLinkBindings())

    this.trackBindings()
  }
}
