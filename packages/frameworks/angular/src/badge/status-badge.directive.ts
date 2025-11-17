// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  booleanAttribute,
  computed,
  Directive,
  input,
  type OnInit,
} from "@angular/core"

import {
  normalizeProps,
  useTrackBindings,
} from "@qualcomm-ui/angular-core/machine"
import type {SignalifyInput} from "@qualcomm-ui/angular-core/signals"
import {
  createQdsStatusBadgeApi,
  type QdsBadgeExtraSize,
  type QdsBadgeSemanticEmphasis,
  type QdsStatusBadgeProps,
  type QdsStatusBadgeVariant,
} from "@qualcomm-ui/qds-core/badge"
import type {Booleanish} from "@qualcomm-ui/utils/coercion"

@Directive({
  selector: "[q-status-badge]",
})
export class StatusBadgeDirective
  implements OnInit, SignalifyInput<QdsStatusBadgeProps>
{
  /**
   * Governs the size of the badge.
   * @default 'md'
   */
  readonly size = input<QdsBadgeExtraSize>()

  /**
   * The badge disabled state.
   */
  readonly disabled = input<boolean | undefined, Booleanish>(undefined, {
    transform: booleanAttribute,
  })

  /**
   * Governs the color of the status badge.
   * @default 'neutral'
   */
  readonly emphasis = input<QdsBadgeSemanticEmphasis>()

  /**
   * Governs the style of the status badge.
   * @default 'filled'
   */
  readonly variant = input<QdsStatusBadgeVariant>()

  protected readonly api = computed(() => {
    return createQdsStatusBadgeApi(
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
