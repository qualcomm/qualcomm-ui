// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Component, computed, inject, input} from "@angular/core"

import {useFilterPanelContext} from "@qualcomm-ui/angular-core/filter-panel"
import type {LucideIconOrString} from "@qualcomm-ui/angular-core/lucide"
import {
  BaseButtonDirective,
  provideQdsButtonPropsContext,
  QdsButtonPropsContextService,
} from "@qualcomm-ui/angular/button"
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
 * Commits the draft filters when clicked. Disabled when the draft matches the
 * committed filters, which is always the case in `auto` apply mode. Renders
 * "Apply" when it has no content.
 *
 * @example
 * ```angular-html
 * <div q-filter-panel-footer>
 *   <button q-filter-panel-apply-button></button>
 * </div>
 * ```
 */
@Component({
  hostDirectives: [QuiPreloadDirective],
  providers: [
    provideFilterPanelButtonContexts(),
    provideQdsButtonPropsContext(),
  ],
  selector: "[q-filter-panel-apply-button]",
  standalone: false,
  template: `
    <ng-content select="[q-start-icon]">
      @if (startIcon()) {
        <svg q-start-icon [icon]="startIcon()!"></svg>
      }
    </ng-content>

    <ng-content>Apply</ng-content>

    <ng-content select="[q-number-badge], [q-status-badge]" />

    <ng-content select="[q-end-icon]">
      @if (endIcon()) {
        <svg q-end-icon [icon]="endIcon()!"></svg>
      }
    </ng-content>
  `,
})
export class FilterPanelApplyButtonComponent extends BaseButtonDirective {
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
   * @default 'fill'
   */
  override readonly variant = input<QdsButtonVariant | undefined>("fill")

  protected readonly filterPanelContext = useFilterPanelContext()

  protected readonly qdsFilterPanelContext = useQdsFilterPanelContext()

  constructor() {
    super()

    /**
     * The apply button has its own size and density, which replace the
     * panel's button defaults. Explicit inputs still take precedence.
     */
    inject(QdsButtonPropsContextService).init(
      computed(() => this.qdsFilterPanelContext().getApplyButtonProps()),
    )

    this.trackBindings.extendWith(
      computed(() => {
        const trigger = this.filterPanelContext().getApplyTriggerBindings()
        const disabled = !!this.disabled() || trigger.disabled
        return mergeProps(
          trigger,
          this.qdsFilterPanelContext().getApplyButtonBindings(),
          {"data-disabled": booleanDataAttr(disabled), disabled},
        )
      }),
    )
  }
}
