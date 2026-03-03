// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Component, input, type OnInit} from "@angular/core"
import {CircleAlert} from "lucide-angular"

import type {LucideIconOrString} from "@qualcomm-ui/angular-core/lucide"
import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"

import {useQdsFieldGroupContext} from "./qds-field-group-context.service"

/**
 * Error message displayed when the field group is invalid.
 */
@Component({
  selector: "q-field-group-error-text",
  standalone: false,
  template: `
    <svg [qIcon]="icon()!" />
    <ng-content />
  `,
})
export class FieldGroupErrorTextComponent implements OnInit {
  /**
   * Error indicator icon.
   *
   * @default CircleAlert
   */
  readonly icon = input<LucideIconOrString>(CircleAlert)

  protected readonly qdsFieldGroupContext = useQdsFieldGroupContext()

  protected readonly trackBindings = useTrackBindings(() =>
    this.qdsFieldGroupContext().getErrorTextBindings(),
  )

  ngOnInit() {
    this.trackBindings()
  }
}
