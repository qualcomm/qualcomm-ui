// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Component, computed, input} from "@angular/core"
import {CircleAlert} from "lucide-angular"

import type {LucideIconOrString} from "@qualcomm-ui/angular-core/lucide"
import {CoreRadioGroupErrorTextDirective} from "@qualcomm-ui/angular-core/radio"

import {useQdsRadioContext} from "../qds-radio-context.service"

@Component({
  selector: "[q-radio-group-error-text]",
  standalone: false,
  template: `
    <svg [qIcon]="icon()!" />
    <ng-content />
  `,
})
export class RadioGroupErrorTextComponent extends CoreRadioGroupErrorTextDirective {
  /**
   * Error indicator icon.
   *
   * @default CircleAlert
   */
  readonly icon = input<LucideIconOrString>(CircleAlert)

  protected readonly qdsRadioContext = useQdsRadioContext()

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.qdsRadioContext().getErrorTextBindings()),
    )
  }
}
