// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Component, input} from "@angular/core"

import {
  FieldGroupRootDirective,
  provideQdsFieldGroupContext,
} from "@qualcomm-ui/angular/field-group"

/**
 * Groups multiple switches with a label, hint, and error text.
 */
@Component({
  providers: [provideQdsFieldGroupContext()],
  selector: "[q-switch-group]",
  standalone: false,
  template: `
    @if (label()) {
      <legend q-field-group-label>{{ label() }}</legend>
    }
    <div q-field-group-items>
      <ng-content />
    </div>
    @if (hint() && !invalid()) {
      <div q-field-group-hint>{{ hint() }}</div>
    }
    @if (errorText() && invalid()) {
      <q-field-group-error-text>{{ errorText() }}</q-field-group-error-text>
    }
  `,
})
export class SwitchGroupComponent extends FieldGroupRootDirective {
  /**
   * Error message displayed when invalid.
   */
  readonly errorText = input<string>()

  /**
   * Helper text displayed below items. Hidden when invalid.
   */
  readonly hint = input<string>()

  /**
   * Group label text.
   */
  readonly label = input<string>()
}
