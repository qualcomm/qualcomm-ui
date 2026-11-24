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

import {CoreCollapsibleRootDirective} from "@qualcomm-ui/angular-core/collapsible"
import {useId} from "@qualcomm-ui/angular-core/common"
import {
  FilterContextService,
  useFilterSetContext,
} from "@qualcomm-ui/angular-core/filter-set"
import {createFilterState, type FilterState} from "@qualcomm-ui/core/filter-set"
import type {
  FilterDefinition,
  IdentifiedFilterDefinition,
} from "@qualcomm-ui/core/filters"
import type {Booleanish} from "@qualcomm-ui/utils/coercion"

import {useFilterPanelContext} from "./filter-panel-context.service"

/**
 * Provides one filter's state to its parts, and expands and collapses its
 * content. Expanded by default. Hidden when `filter` is missing.
 */
@Directive()
export class CoreFilterPanelFilterRootDirective<
  TDef extends FilterDefinition = FilterDefinition,
>
  extends CoreCollapsibleRootDirective
  implements OnInit
{
  /**
   * The initial open state of the filter when rendered. Use when you don't need
   * to control the open state of the filter.
   *
   * @default true
   */
  override readonly defaultOpen = input<boolean | undefined, Booleanish>(true, {
    transform: booleanAttribute,
  })

  /**
   * The filter's definition, from the filter set's `filters`.
   *
   * @inheritDoc
   */
  readonly filter = input.required<IdentifiedFilterDefinition<TDef>>()

  protected readonly filterSetContext = useFilterSetContext()

  protected readonly filterPanelContext = useFilterPanelContext()

  protected readonly filterContextService = inject(FilterContextService)

  /**
   * Names the filter's control through `aria-labelledby`. The filter label part
   * renders with this id.
   */
  protected readonly labelId = useId(this, undefined)

  protected readonly filterState = computed(
    () =>
      createFilterState(this.filterSetContext(), this.filter(), {
        labelId: this.labelId,
      }) as FilterState | undefined,
  )

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => {
        const state = this.filterState()
        return state
          ? this.filterPanelContext().getFilterBindings(state)
          : {hidden: true}
      }),
    )
  }

  override ngOnInit() {
    this.filterContextService.init(this.filterState)
    super.ngOnInit()
  }
}
