// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {booleanAttribute, Component, input} from "@angular/core"

import {provideTooltipContext} from "@qualcomm-ui/angular-core/tooltip"
import type {Booleanish} from "@qualcomm-ui/utils/coercion"

import {TooltipRootDirective} from "./tooltip-root.directive"

@Component({
  providers: [provideTooltipContext()],
  selector: "[q-tooltip]",
  standalone: false,
  template: `
    <ng-content select="[q-tooltip-trigger]" />

    <q-portal [disabled]="disablePortal()">
      <div q-tooltip-positioner>
        <div q-tooltip-content>
          @if (!hideArrow()) {
            <div q-tooltip-arrow>
              <div q-tooltip-arrow-tip></div>
            </div>
          }
          <ng-content />
        </div>
      </div>
    </q-portal>
  `,
})
export class TooltipDirective extends TooltipRootDirective {
  /**
   * If true, the tooltip will not be rendered in a DOM portal.
   */
  readonly disablePortal = input<boolean | undefined, Booleanish>(undefined, {
    transform: booleanAttribute,
  })

  /**
   * Whether to hide the arrow.
   */
  readonly hideArrow = input<boolean | undefined, Booleanish>(undefined, {
    transform: booleanAttribute,
  })
}
