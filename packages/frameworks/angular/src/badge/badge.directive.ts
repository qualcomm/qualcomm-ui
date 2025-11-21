// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  booleanAttribute,
  Component,
  computed,
  input,
  type OnInit,
} from "@angular/core"

import {
  normalizeProps,
  useTrackBindings,
} from "@qualcomm-ui/angular-core/machine"
import type {SignalifyInput} from "@qualcomm-ui/angular-core/signals"
import {
  createQdsTextBadgeApi,
  type QdsBadgeBasicSize,
  type QdsBadgeCategoryEmphasis,
  type QdsBadgeSemanticEmphasis,
  type QdsTextBadgeProps,
  type QdsTextBadgeVariant,
} from "@qualcomm-ui/qds-core/badge"
import type {Booleanish} from "@qualcomm-ui/utils/coercion"

@Component({
  selector: "[q-badge]",
  template: `
    <ng-content />
  `,
})
export class BadgeDirective
  implements OnInit, SignalifyInput<QdsTextBadgeProps>
{
  /**
   * Governs the size of the badge.
   * @default 'md'
   */
  readonly size = input<QdsBadgeBasicSize>()

  /**
   * The badge disabled state.
   */
  readonly disabled = input<boolean | undefined, Booleanish>(undefined, {
    transform: booleanAttribute,
  })

  /**
   * Governs the color of the text badge.
   * @default 'neutral'
   */
  readonly emphasis = input<
    QdsBadgeSemanticEmphasis | QdsBadgeCategoryEmphasis
  >()

  /**
   * Governs the style of the badge.
   * @default 'default'
   */
  readonly variant = input<QdsTextBadgeVariant>()

  protected readonly api = computed(() => {
    return createQdsTextBadgeApi(
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
