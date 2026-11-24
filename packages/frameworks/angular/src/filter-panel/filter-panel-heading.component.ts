// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Component, computed, input, type OnInit} from "@angular/core"
import {LucideFunnel} from "@lucide/angular"

import type {LucideIconOrString} from "@qualcomm-ui/angular-core/lucide"
import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"

import {useQdsFilterPanelContext} from "./qds-filter-panel-context.service"

/**
 * The title of the filter panel.
 *
 * @example
 * ```angular-html
 * <div q-filter-panel-heading>Filters</div>
 * ```
 */
@Component({
  selector: "[q-filter-panel-heading]",
  standalone: false,
  template: `
    @if (icon()) {
      <svg aria-hidden="true" [qIcon]="icon()!" [size]="iconSize()"></svg>
    }
    <ng-content />
  `,
})
export class FilterPanelHeadingComponent implements OnInit {
  /**
   * {@link https://lucide.dev/icons lucide-angular} icon, rendered before the
   * heading text. Pass `null` to hide it.
   *
   * @default LucideFunnel
   */
  readonly icon = input<LucideIconOrString | null>(LucideFunnel)

  protected readonly qdsFilterPanelContext = useQdsFilterPanelContext()

  protected readonly iconSize = computed(
    () => this.qdsFilterPanelContext().getIconProps().size,
  )

  protected readonly trackBindings = useTrackBindings(() =>
    this.qdsFilterPanelContext().getHeadingBindings(),
  )

  ngOnInit() {
    this.trackBindings()
  }
}
