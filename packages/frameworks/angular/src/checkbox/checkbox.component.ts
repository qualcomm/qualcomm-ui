// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Component, input} from "@angular/core"

import {provideCheckboxContext} from "@qualcomm-ui/angular-core/checkbox"

import {CheckboxRootDirective} from "./checkbox-root.directive"
import {provideQdsCheckboxContext} from "./qds-checkbox-context.service"

@Component({
  providers: [provideCheckboxContext(), provideQdsCheckboxContext()],
  selector: "[q-checkbox]",
  standalone: false,
  template: `
    <ng-content select="[q-checkbox-hidden-input]">
      <input q-checkbox-hidden-input />
    </ng-content>

    <ng-content select="[q-checkbox-control]">
      <div q-checkbox-control>
        <div q-checkbox-indicator></div>
      </div>
    </ng-content>
    <ng-content select="[q-checkbox-label]">
      @if (label()) {
        <span q-checkbox-label>
          {{ label() }}
        </span>
      }
    </ng-content>
    <ng-content select="[q-checkbox-error-text]">
      @if (errorText()) {
        <div q-checkbox-error-text>
          {{ errorText() }}
        </div>
      }
    </ng-content>
  `,
})
export class CheckboxComponent extends CheckboxRootDirective {
  /**
   * Optional error that describes the checkbox when the field is invalid. This
   * element is automatically associated with the checkbox for accessibility.
   *
   * @remarks
   * To customize the element, provide it using the directive instead:
   *
   * ```angular-html
   * <label q-checkbox>
   *   <div q-checkbox-error-text>...</div>
   * </label>
   * ```
   */
  readonly errorText = input<string>()

  /**
   * Optional label describing the checkbox. This element is automatically
   * associated with the checkbox for accessibility. If omitted, you should provide
   * an `aria-label` or `aria-labelledby` attribute on the `q-checkbox-hidden-input`
   * element.
   *
   * @remarks
   * To customize the element, provide it using the directive instead:
   *
   * ```angular-html
   * <label q-checkbox>
   *   <div q-checkbox-label>...</div>
   * </label>
   * ```
   */
  readonly label = input<string | undefined>()
}
