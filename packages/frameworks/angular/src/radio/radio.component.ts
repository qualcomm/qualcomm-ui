// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Component, input} from "@angular/core"

import {provideRadioItemContext} from "@qualcomm-ui/angular-core/radio"

import {provideQdsRadioContext} from "./qds-radio-context.service"
import {RadioRootDirective} from "./radio-root.directive"

@Component({
  providers: [provideRadioItemContext(), provideQdsRadioContext()],
  selector: "[q-radio]",
  standalone: false,
  template: `
    <ng-content select="[q-radio-hidden-input]">
      <input q-radio-hidden-input />
    </ng-content>
    <ng-content select="[q-radio-control]">
      <div q-radio-control></div>
    </ng-content>
    <ng-content select="[q-radio-label]">
      @if (label()) {
        <span q-radio-label>
          {{ label() }}
        </span>
      }
    </ng-content>
  `,
})
export class RadioComponent extends RadioRootDirective {
  /**
   * Optional label describing the element. Recommended. This element is
   * automatically associated with the component's input element for accessibility.
   */
  readonly label = input<string | undefined>()
}
