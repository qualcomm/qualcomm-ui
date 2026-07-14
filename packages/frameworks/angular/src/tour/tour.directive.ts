// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {booleanAttribute, Component, input} from "@angular/core"

import {provideTourContext} from "@qualcomm-ui/angular-core/tour"
import type {Booleanish} from "@qualcomm-ui/utils/coercion"

import {provideQdsTourContext} from "./qds-tour-context.service"
import {TourRootDirective} from "./tour-root.directive"

@Component({
  providers: [provideTourContext(), provideQdsTourContext()],
  selector: "[q-tour]",
  standalone: false,
  template: `
    <ng-content />
    <q-tour-floating-portal [disabled]="disablePortal()">
      <ng-container *tourContext="let tour">
        <h2 q-tour-heading>{{ tour.step?.heading }}</h2>
        <div q-tour-description>{{ tour.step?.description }}</div>
        <div q-tour-progress-text>{{ tour.getProgressText() }}</div>
        @if (tour.step?.actions?.length) {
          <div class="qui-tour__action-group">
            @for (action of tour.step?.actions ?? []; track $index) {
              <button q-tour-action-trigger [action]="action">
                {{ action.label }}
              </button>
            }
          </div>
        }
        <button q-tour-close-button></button>
      </ng-container>
    </q-tour-floating-portal>
  `,
})
export class TourDirective extends TourRootDirective {
  readonly disablePortal = input<boolean | undefined, Booleanish>(undefined, {
    transform: booleanAttribute,
  })
}
