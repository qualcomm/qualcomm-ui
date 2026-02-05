// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Component, computed, input} from "@angular/core"

import {CoreFileUploadErrorTextDirective} from "@qualcomm-ui/angular-core/file-upload"
import type {LucideIcon} from "@qualcomm-ui/angular-core/lucide"

import {useQdsFileUploadContext} from "./qds-file-upload-context.service"

@Component({
  selector: "[q-file-upload-error-text]",
  standalone: false,
  template: `
    @if (icon()) {
      <svg [qIcon]="icon()!" />
    }
    <ng-content />
  `,
})
export class FileUploadErrorTextDirective extends CoreFileUploadErrorTextDirective {
  /**
   * Optional error indicator icon.
   */
  readonly icon = input<LucideIcon | string>()

  protected readonly qdsFileUploadContext = useQdsFileUploadContext()

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.qdsFileUploadContext().getErrorTextBindings()),
    )
  }
}
