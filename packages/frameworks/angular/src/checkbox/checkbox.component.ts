// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Component, input} from "@angular/core"

import {provideCheckboxContext} from "@qualcomm-ui/angular-core/checkbox"

import {CheckboxRootDirective} from "./checkbox-root.directive"
import {provideQdsCheckboxContext} from "./qds-checkbox-context.service"

@Component({
  host: {
    "[attr.aria-label]": "undefined",
    "[attr.aria-labelledby]": "undefined",
  },
  providers: [provideCheckboxContext(), provideQdsCheckboxContext()],
  selector: "[q-checkbox]",
  standalone: false,
  template: `
    <ng-content select="[q-checkbox-hidden-input]">
      <input
        q-checkbox-hidden-input
        [aria-label]="ariaLabel()"
        [aria-labelledby]="ariaLabelledby()"
      />
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
    <ng-content select="[q-checkbox-hint]">
      @if (hint()) {
        <div q-checkbox-hint>
          {{ hint() }}
        </div>
      }
    </ng-content>
  `,
})
export class CheckboxComponent extends CheckboxRootDirective {
  /**
   * Accessible label applied to the generated hidden input when no visible label
   * is provided.
   *
   * @since 2.9.0
   */
  readonly ariaLabel = input<string | undefined>(undefined, {
    alias: "aria-label",
  })

  /**
   * ID reference for an external label applied to the generated hidden input.
   *
   * @since 2.9.0
   */
  readonly ariaLabelledby = input<string | undefined>(undefined, {
    alias: "aria-labelledby",
  })

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
   * Optional hint text displayed below the checkbox. Hints are hidden when the
   * checkbox is invalid.
   *
   * @remarks
   * To customize the element, provide it using the directive instead:
   *
   * ```angular-html
   * <label q-checkbox>
   *   <div q-checkbox-hint>...</div>
   * </label>
   * ```
   */
  readonly hint = input<string>()

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
