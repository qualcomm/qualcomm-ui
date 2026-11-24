// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Component, computed, input} from "@angular/core"
import {LucideX} from "@lucide/angular"

import type {LucideIconOrString} from "@qualcomm-ui/angular-core/lucide"
import {
  IconButtonDirective,
  provideQdsIconButtonContext,
} from "@qualcomm-ui/angular/button"
import type {QdsButtonVariant} from "@qualcomm-ui/qds-core/button"

import {useQdsFilterPanelContext} from "./qds-filter-panel-context.service"

/**
 * Closes the filter panel. The panel does not manage its own visibility, so
 * handle `(click)` or render this inside a container that provides closing
 * behavior, such as a drawer.
 *
 * @example
 * ```angular-html
 * <div q-filter-panel-header>
 *   <div q-filter-panel-heading>Filters</div>
 *   <button q-filter-panel-close-button (click)="close()"></button>
 * </div>
 * ```
 */
@Component({
  providers: [provideQdsIconButtonContext()],
  selector: "[q-filter-panel-close-button]",
  standalone: false,
  template: `
    <ng-content select="svg[qIcon]" />
    @if (icon()) {
      <svg
        [q-bind]="iconProps()"
        [qIcon]="icon()!"
        [size]="iconButtonContext.context().size"
      ></svg>
    }
  `,
})
export class FilterPanelCloseButtonComponent extends IconButtonDirective {
  /**
   * Accessible name of the button.
   *
   * @default 'Close filters'
   */
  readonly ariaLabel = input<string | undefined>(undefined, {
    alias: "aria-label",
  })

  /**
   * {@link https://lucide.dev/icons lucide-angular} icon.
   *
   * @default LucideX
   */
  override readonly icon = input<LucideIconOrString | undefined>(LucideX)

  /**
   * The variant of the button.
   *
   * @default 'outline'
   */
  override readonly variant = input<QdsButtonVariant | undefined>("outline")

  protected readonly qdsFilterPanelContext = useQdsFilterPanelContext()

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => {
        const bindings = this.qdsFilterPanelContext().getCloseButtonBindings()
        return {
          ...bindings,
          "aria-label": this.ariaLabel() ?? bindings["aria-label"],
        }
      }),
    )
  }
}
