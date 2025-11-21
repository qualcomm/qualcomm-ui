// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  booleanAttribute,
  Component,
  computed,
  input,
  type OnInit,
} from "@angular/core"

import {IconDirective} from "@qualcomm-ui/angular/icon"
import {
  type LucideIconOrString,
  provideIcons,
} from "@qualcomm-ui/angular-core/lucide"
import {
  normalizeProps,
  QBindDirective,
  useTrackBindings,
} from "@qualcomm-ui/angular-core/machine"
import type {SignalifyInput} from "@qualcomm-ui/angular-core/signals"
import {
  createQdsIconBadgeApi,
  type QdsBadgeCategoryEmphasis,
  type QdsBadgeExtendedSize,
  type QdsBadgeSemanticEmphasis,
  type QdsIconBadgeProps,
  type QdsIconBadgeVariant,
} from "@qualcomm-ui/qds-core/badge"
import type {Booleanish} from "@qualcomm-ui/utils/coercion"

@Component({
  imports: [IconDirective, QBindDirective],
  providers: [provideIcons({})],
  selector: "[q-icon-badge]",
  template: `
    <ng-content>
      @if (icon()) {
        <svg [q-bind]="api().getIconBindings()" [qIcon]="icon()!"></svg>
      }
    </ng-content>
  `,
})
export class IconBadgeDirective
  implements OnInit, SignalifyInput<QdsIconBadgeProps>
{
  /**
   * Governs the size of the badge.
   * @default 'md'
   */
  readonly size = input<QdsBadgeExtendedSize>()

  /**
   * The badge disabled state.
   */
  readonly disabled = input<boolean | undefined, Booleanish>(undefined, {
    transform: booleanAttribute,
  })

  /**
   * Governs the color of the icon badge.
   * @default 'neutral'
   */
  readonly emphasis = input<
    QdsBadgeSemanticEmphasis | QdsBadgeCategoryEmphasis
  >()

  /**
   * Governs the style of the icon badge.
   * @default 'default'
   */
  readonly variant = input<QdsIconBadgeVariant>()

  /**
   * {@link https://lucide.dev/icons lucide-angular} icon to display in the icon badge.
   */
  readonly icon = input<LucideIconOrString>()

  protected readonly api = computed(() => {
    return createQdsIconBadgeApi(
      {
        disabled: this.disabled(),
        emphasis: this.emphasis(),
        size: this.size(),
        variant: this.variant(),
      },
      normalizeProps,
    )
  })

  protected readonly trackBindings = useTrackBindings(() =>
    this.api().getRootBindings(),
  )

  ngOnInit() {
    this.trackBindings()
  }
}
