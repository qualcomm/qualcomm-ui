// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  booleanAttribute,
  Component,
  type ElementRef,
  input,
} from "@angular/core"

import {useTourContext} from "@qualcomm-ui/angular-core/tour"
import type {Booleanish} from "@qualcomm-ui/utils/coercion"

@Component({
  selector: "q-tour-floating-portal",
  standalone: false,
  template: `
    @if (tour().open && tour().step) {
      <ng-template qPortal [container]="container()" [disabled]="disabled()">
        @if (tour().step?.backdrop) {
          <div q-tour-backdrop></div>
        }
        <div q-tour-spotlight></div>
        <div q-tour-positioner>
          <section q-tour-content>
            @if (tour().step?.arrow) {
              <div q-tour-arrow><div q-tour-arrow-tip></div></div>
            }
            <ng-content />
          </section>
        </div>
      </ng-template>
    }
  `,
})
export class TourFloatingPortalComponent {
  readonly container = input<ElementRef<HTMLElement> | HTMLElement | null>(null)
  readonly disabled = input<boolean | undefined, Booleanish>(undefined, {
    transform: booleanAttribute,
  })

  protected readonly tour = useTourContext()
}
