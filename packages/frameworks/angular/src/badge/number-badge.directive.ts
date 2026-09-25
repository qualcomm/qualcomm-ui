// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  booleanAttribute,
  Component,
  computed,
  inject,
  input,
  numberAttribute,
  type OnInit,
} from "@angular/core"

import {
  normalizeProps,
  useTrackBindings,
} from "@qualcomm-ui/angular-core/machine"
import type {SignalifyInput} from "@qualcomm-ui/angular-core/signals"
import {
  createQdsNumberBadgeApi,
  type QdsNumberBadgeEmphasis,
  type QdsNumberBadgeProps,
  type QdsNumberBadgeSize,
} from "@qualcomm-ui/qds-core/badge"
import type {Booleanish} from "@qualcomm-ui/utils/coercion"
import {compact} from "@qualcomm-ui/utils/object"

import {BADGE_CONTEXT_TOKEN} from "./badge.tokens"

@Component({
  selector: "[q-number-badge]",
  template: `
    <span>
      <ng-content>{{ displayValue() }}</ng-content>
    </span>
  `,
})
export class NumberBadgeDirective
  implements OnInit, SignalifyInput<QdsNumberBadgeProps>
{
  /**
   * The badge disabled state.
   */
  readonly disabled = input<boolean | undefined, Booleanish>(undefined, {
    transform: booleanAttribute,
  })

  /**
   * Governs the color and style of the number badge.
   * @default 'neutral'
   */
  readonly emphasis = input<QdsNumberBadgeEmphasis>()

  /**
   * Maximum value to display for the number badge.
   * @default 99
   */
  readonly max = input<number | undefined, string | number>(undefined, {
    transform: numberAttribute,
  })

  /**
   * Governs the size of the badge.
   * @default 'md'
   */
  readonly size = input<QdsNumberBadgeSize>()

  /**
   * The numeric value to display for the number badge.
   */
  readonly value = input<number | undefined, string | number>(undefined, {
    transform: numberAttribute,
  })

  protected readonly badgeContext = inject(BADGE_CONTEXT_TOKEN, {
    optional: true,
  })

  protected readonly api = computed(() => {
    return createQdsNumberBadgeApi(
      {
        ...this.badgeContext?.numberBadge(),
        ...compact({
          disabled: this.disabled(),
          emphasis: this.emphasis(),
          max: this.max(),
          size: this.size(),
          value: this.value(),
        }),
      },
      normalizeProps,
    )
  })

  protected readonly displayValue = computed(() => this.api().displayValue)

  protected readonly trackBindings = useTrackBindings(() =>
    this.api().getRootBindings(),
  )

  ngOnInit() {
    this.trackBindings()
  }
}
