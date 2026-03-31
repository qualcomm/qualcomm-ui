// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  booleanAttribute,
  Component,
  computed,
  input,
  type OnInit,
} from "@angular/core"
import {ChevronRight} from "lucide-angular"

import {useId} from "@qualcomm-ui/angular-core/common"
import {
  type LucideIconOrString,
  provideIcons,
} from "@qualcomm-ui/angular-core/lucide"
import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"
import type {Booleanish} from "@qualcomm-ui/utils/coercion"

import {
  QDS_BREADCRUMB_ITEM,
  useQdsBreadcrumbsContext,
} from "./qds-breadcrumbs-context.service"

@Component({
  providers: [
    provideIcons({ChevronRight}),
    {provide: QDS_BREADCRUMB_ITEM, useExisting: BreadcrumbItemDirective},
  ],
  selector: "[q-breadcrumb-item]",
  standalone: false,
  template: `
    <span class="qui-breadcrumbs__item-trigger-container">
      <ng-content select="[q-breadcrumb-item-trigger]">
        <button q-breadcrumb-item-trigger>
          <ng-content />
        </button>
      </ng-content>
      @if (tooltip()) {
        <span q-breadcrumb-item-tooltip [attr.id]="tooltipId()">
          {{ tooltip() }}
        </span>
      }
    </span>

    <ng-content select="[q-breadcrumb-item-separator]">
      <svg q-breadcrumb-item-separator [qIcon]="separator()"></svg>
    </ng-content>
  `,
})
export class BreadcrumbItemDirective implements OnInit {
  /**
   * Controls the component's interactivity. If `true`, the component becomes
   * unresponsive to input and is visually dimmed to indicate its disabled state.
   */
  readonly disabled = input<boolean | undefined, Booleanish>(undefined, {
    transform: booleanAttribute,
  })

  /**
   * The separator element to render between items.
   *
   * @default ChevronRight
   */
  readonly separator = input<LucideIconOrString>("ChevronRight")

  /**
   * Text content of a tooltip displayed above the trigger on hover or
   * keyboard focus.
   */
  readonly tooltip = input<string | undefined>()

  private readonly _tooltipId = useId(this, null)

  readonly tooltipId = computed(() => (this.tooltip() ? this._tooltipId : null))

  protected readonly qdsContext = useQdsBreadcrumbsContext()

  protected readonly trackBindings = useTrackBindings(() =>
    this.qdsContext().getItemBindings({disabled: this.disabled()}),
  )

  ngOnInit() {
    this.trackBindings()
  }
}
