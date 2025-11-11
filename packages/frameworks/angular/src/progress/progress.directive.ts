// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Component, input} from "@angular/core"

import {provideProgressContext} from "@qualcomm-ui/angular-core/progress"

import {ProgressRootDirective} from "./progress-root.directive"
import {provideQdsProgressContext} from "./qds-progress-context.service"

@Component({
  providers: [provideProgressContext(), provideQdsProgressContext()],
  selector: "[q-progress]",
  standalone: false,
  template: `
    <ng-content select="[q-progress-label]">
      @if (label()) {
        <div q-progress-label>{{ label() }}</div>
      }
    </ng-content>

    <ng-content select="[q-progress-value-text]">
      @if (valueText()) {
        <div q-progress-value-text>{{ valueText() }}</div>
      }
    </ng-content>

    <ng-content select="[q-progress-track]">
      <div q-progress-track></div>
    </ng-content>

    <ng-content select="[q-progress-error-text]">
      @if (errorText()) {
        <div q-progress-error-text>{{ errorText() }}</div>
      }
    </ng-content>

    <ng-content>
      @if (hint()) {
        <div q-progress-hint>{{ hint() }}</div>
      }
    </ng-content>
  `,
})
export class ProgressDirective extends ProgressRootDirective {
  /**
   * Optional error text. Only rendered when {@link invalid} is true.
   *
   * @remarks
   * This can also be provided using the directive:
   * ```angular-html
   * <div q-progress-label>...</div>
   * ```
   */
  readonly errorText = input<string>()

  /**
   * Additional description for the component, rendered below the bar.
   *
   * @remarks
   * This can also be provided using the directive:
   * ```angular-html
   * <div q-progress-hint>...</div>
   * ```
   */
  readonly hint = input<string>()

  /**
   * Accessible label for the component, rendered above or to the left of the bar.
   *
   * @remarks
   * This can also be provided using the directive:
   * ```angular-html
   * <div q-progress-label>...</div>
   * ```
   */
  readonly label = input<string>()

  /**
   * Optional value text.
   *
   * @remarks
   * This can also be provided using the directive:
   * ```angular-html
   * <div q-progress-value-text>...</div>
   * ```
   */
  readonly valueText = input<string>()
}
