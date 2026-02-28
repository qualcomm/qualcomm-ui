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
import {
  createQdsFieldGroupApi,
  type QdsFieldGroupOrientation,
  type QdsFieldGroupSize,
} from "@qualcomm-ui/qds-core/field-group"
import type {Booleanish} from "@qualcomm-ui/utils/coercion"

import {
  provideQdsFieldGroupContext,
  QdsFieldGroupContextService,
} from "./qds-field-group-context.service"

/**
 * Root container for the field group. Use with a `<fieldset>` element.
 */
@Directive({
  providers: [provideQdsFieldGroupContext()],
  selector: "[q-field-group-root]",
  standalone: false,
})
export class FieldGroupRootDirective implements OnInit {
  /**
   * Adds padding at the start of the items container.
   * @default false
   */
  readonly indented = input<boolean | undefined, Booleanish>(undefined, {
    transform: booleanAttribute,
  })

  /**
   * Marks the group as invalid.
   * @default false
   */
  readonly invalid = input<boolean | undefined, Booleanish>(undefined, {
    transform: booleanAttribute,
  })

  /**
   * Layout direction for items.
   * @default 'vertical'
   */
  readonly orientation = input<QdsFieldGroupOrientation | undefined>()

  /**
   * The size of the group items.
   * @default 'md'
   */
  readonly size = input<QdsFieldGroupSize | undefined>()

  private readonly qdsFieldGroupService = inject(QdsFieldGroupContextService)

  private readonly qdsApi = computed(() =>
    createQdsFieldGroupApi(
      {
        indented: this.indented(),
        invalid: this.invalid(),
        orientation: this.orientation(),
        size: this.size(),
      },
      normalizeProps,
    ),
  )

  protected readonly trackBindings = useTrackBindings(() =>
    this.qdsApi().getRootBindings(),
  )

  ngOnInit() {
    this.qdsFieldGroupService.init(this.qdsApi)
    this.trackBindings()
  }
}
