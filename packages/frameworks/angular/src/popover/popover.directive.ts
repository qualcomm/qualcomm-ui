// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {booleanAttribute, Component, input} from "@angular/core"

import {providePopoverContext} from "@qualcomm-ui/angular-core/popover"
import type {Booleanish} from "@qualcomm-ui/utils/coercion"

import {PopoverRootDirective} from "./popover-root.directive"

@Component({
  providers: [providePopoverContext()],
  selector: "[q-popover]",
  standalone: false,
  template: `
    <ng-content select="[q-popover-anchor]" />

    <ng-template qPortal [disabled]="disablePortal()">
      <div q-popover-positioner>
        <ng-content select="[q-popover-content]">
          <section q-popover-content>
            @if (!hideArrow()) {
              <div q-popover-arrow></div>
            }
            <ng-content select="[q-popover-label]">
              @if (label()) {
                <div q-popover-label>{{ label() }}</div>
              }
            </ng-content>
            <ng-content select="[q-popover-description]">
              @if (description()) {
                <div q-popover-description>{{ description() }}</div>
              }
            </ng-content>

            <ng-content />
          </section>
        </ng-content>
      </div>
    </ng-template>
  `,
})
export class PopoverDirective extends PopoverRootDirective {
  /**
   * Optional description text for the popover.
   */
  readonly description = input<string | undefined>()

  /**
   * Set to true to disable portalling behavior for the popup content.
   */
  readonly disablePortal = input<boolean | undefined, Booleanish>(undefined, {
    transform: booleanAttribute,
  })

  /**
   * Set to true to hide the arrow element.
   */
  readonly hideArrow = input<boolean | undefined, Booleanish>(undefined, {
    transform: booleanAttribute,
  })

  /**
   * Optional label text for the popover.
   */
  readonly label = input<string | undefined>()
}
