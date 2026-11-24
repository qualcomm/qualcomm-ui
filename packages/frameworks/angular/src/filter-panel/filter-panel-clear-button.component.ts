// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Component, computed, input} from "@angular/core"

import {useFilterPanelContext} from "@qualcomm-ui/angular-core/filter-panel"
import type {LucideIconOrString} from "@qualcomm-ui/angular-core/lucide"
import {BaseButtonDirective} from "@qualcomm-ui/angular/button"
import {QuiPreloadDirective} from "@qualcomm-ui/angular/transitions"
import type {
  QdsButtonEmphasis,
  QdsButtonVariant,
} from "@qualcomm-ui/qds-core/button"
import {booleanDataAttr} from "@qualcomm-ui/utils/attributes"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {provideFilterPanelButtonContexts} from "./filter-panel-button.providers"
import {useQdsFilterPanelContext} from "./qds-filter-panel-context.service"

/**
 * Removes every filter when clicked. In `manual` apply mode, the cleared
 * filters must still be applied. Disabled when no filters are set. Renders
 * "Clear all" when it has no content.
 *
 * @example
 * ```angular-html
 * <div q-filter-panel-header>
 *   <div q-filter-panel-heading>Filters</div>
 *   <button q-filter-panel-clear-button></button>
 * </div>
 * ```
 */
@Component({
  hostDirectives: [QuiPreloadDirective],
  providers: [provideFilterPanelButtonContexts()],
  selector: "[q-filter-panel-clear-button]",
  standalone: false,
  template: `
    <ng-content select="[q-start-icon]">
      @if (startIcon()) {
        <svg q-start-icon [icon]="startIcon()!"></svg>
      }
    </ng-content>

    <ng-content>Clear all</ng-content>

    <ng-content select="[q-number-badge], [q-status-badge]" />

    <ng-content select="[q-end-icon]">
      @if (endIcon()) {
        <svg q-end-icon [icon]="endIcon()!"></svg>
      }
    </ng-content>
  `,
})
export class FilterPanelClearButtonComponent extends BaseButtonDirective {
  /**
   * The variant of the button.
   *
   * @default 'primary'
   */
  override readonly emphasis = input<QdsButtonEmphasis | undefined>("primary")

  /**
   * {@link https://lucide.dev/icons lucide-angular} icon, positioned after the label.
   */
  readonly endIcon = input<LucideIconOrString>()

  /**
   * The variant of the button.
   *
   * @default 'ghost'
   */
  override readonly variant = input<QdsButtonVariant | undefined>("ghost")

  protected readonly filterPanelContext = useFilterPanelContext()

  protected readonly qdsFilterPanelContext = useQdsFilterPanelContext()

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => {
        const trigger = this.filterPanelContext().getClearTriggerBindings()
        const disabled = !!this.disabled() || trigger.disabled
        return mergeProps(
          trigger,
          this.qdsFilterPanelContext().getClearButtonBindings(),
          {"data-disabled": booleanDataAttr(disabled), disabled},
        )
      }),
    )
  }
}
