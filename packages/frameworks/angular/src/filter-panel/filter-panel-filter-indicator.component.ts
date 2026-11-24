// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Component, computed, input} from "@angular/core"
import {LucideChevronDown} from "@lucide/angular"

import {CoreFilterPanelFilterIndicatorDirective} from "@qualcomm-ui/angular-core/filter-panel"
import type {LucideIconOrString} from "@qualcomm-ui/angular-core/lucide"

import {useQdsFilterPanelContext} from "./qds-filter-panel-context.service"

/**
 * Indicates whether the filter is expanded.
 *
 * @example
 * ```angular-html
 * <span q-filter-panel-filter-indicator></span>
 * ```
 */
@Component({
  selector: "[q-filter-panel-filter-indicator]",
  standalone: false,
  template: `
    <svg [qIcon]="icon()" [size]="iconSize()"></svg>
  `,
})
export class FilterPanelFilterIndicatorComponent extends CoreFilterPanelFilterIndicatorDirective {
  /**
   * {@link https://lucide.dev/icons lucide-angular} indicator icon for the
   * filter trigger.
   *
   * @default LucideChevronDown
   */
  readonly icon = input<LucideIconOrString>(LucideChevronDown)

  protected readonly qdsFilterPanelContext = useQdsFilterPanelContext()

  protected readonly iconSize = computed(
    () => this.qdsFilterPanelContext().getIconProps().size,
  )

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.qdsFilterPanelContext().getFilterIndicatorBindings()),
    )
  }
}
