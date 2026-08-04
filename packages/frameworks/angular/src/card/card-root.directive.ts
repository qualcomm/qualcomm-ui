// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  booleanAttribute,
  computed,
  Directive,
  inject,
  input,
  type OnInit,
} from "@angular/core"

import {
  normalizeProps,
  useTrackBindings,
} from "@qualcomm-ui/angular-core/machine"
import type {SignalifyInput} from "@qualcomm-ui/angular-core/signals"
import {
  createQdsCardApi,
  type QdsCardAlignment,
  type QdsCardApiProps,
  type QdsCardSize,
  type QdsCardVariant,
} from "@qualcomm-ui/qds-core/card"
import type {Booleanish} from "@qualcomm-ui/utils/coercion"
import type {Direction} from "@qualcomm-ui/utils/direction"

import {
  provideQdsCardContext,
  QdsCardContextService,
} from "./qds-card-context.service"

@Directive({
  providers: [provideQdsCardContext()],
  selector: "[q-card]",
  standalone: false,
})
export class CardRootDirective
  implements OnInit, SignalifyInput<QdsCardApiProps>
{
  /**
   * The horizontal alignment of card content and footer.
   *
   * @default 'start'
   */
  readonly alignment = input<QdsCardAlignment>()

  /**
   * The document's text/writing direction.
   *
   * @default 'ltr'
   */
  readonly dir = input<Direction | undefined>(undefined)

  /**
   * When `true`, the card renders as an interactive element with hover and
   * active states.
   */
  readonly interactive = input<boolean | undefined, Booleanish>(undefined, {
    transform: booleanAttribute,
  })

  /**
   * The size of the card and its elements. Governs padding, spacing, and
   * typography.
   *
   * @default 'sm'
   */
  readonly size = input<QdsCardSize>()

  /**
   * The visual style of the card.
   *
   * @default 'outline'
   */
  readonly variant = input<QdsCardVariant>()

  readonly qdsCardService = inject(QdsCardContextService)

  protected readonly api = computed(() =>
    createQdsCardApi(
      {
        alignment: this.alignment(),
        dir: this.dir(),
        interactive: this.interactive(),
        size: this.size(),
        variant: this.variant(),
      },
      normalizeProps,
    ),
  )

  protected readonly trackBindings = useTrackBindings(() =>
    this.api().getRootBindings(),
  )

  ngOnInit() {
    this.qdsCardService.init(this.api)

    this.trackBindings()
  }
}
