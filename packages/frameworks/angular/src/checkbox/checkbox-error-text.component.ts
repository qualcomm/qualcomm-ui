// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Component, computed, input} from "@angular/core"
import {CircleAlert} from "lucide-angular"

import {CoreCheckboxErrorTextDirective} from "@qualcomm-ui/angular-core/checkbox"
import type {LucideIconOrString} from "@qualcomm-ui/angular-core/lucide"

import {useQdsCheckboxContext} from "./qds-checkbox-context.service"

/**
 * Error message displayed when the checkbox is invalid.
 */
@Component({
  selector: "[q-checkbox-error-text]",
  standalone: false,
  template: `
    <svg [qIcon]="icon()!" />
    <ng-content />
  `,
})
export class CheckboxErrorTextComponent extends CoreCheckboxErrorTextDirective {
  /**
   * Error indicator icon.
   *
   * @default CircleAlert
   */
  readonly icon = input<LucideIconOrString>(CircleAlert)

  protected readonly qdsCheckboxContext = useQdsCheckboxContext()

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.qdsCheckboxContext().getErrorTextBindings()),
    )
  }
}
