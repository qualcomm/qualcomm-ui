// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Component} from "@angular/core"

import {CoreFileUploadDropzoneDirective} from "@qualcomm-ui/angular-core/file-upload"
import {useInputGroup} from "@qualcomm-ui/angular/input"

@Component({
  selector: "[q-file-input-control]",
  standalone: false,
  template: `
    <ng-content select="[q-input-start-icon]">
      @if (inputGroupContext().startIcon) {
        <div q-input-start-icon [icon]="inputGroupContext().startIcon"></div>
      }
    </ng-content>
    <ng-content />
    <ng-content select="[q-input-end-icon]">
      @if (inputGroupContext().endIcon) {
        <div q-input-end-icon [icon]="inputGroupContext().endIcon"></div>
      }
    </ng-content>
  `,
})
export class FileInputControlDirective extends CoreFileUploadDropzoneDirective {
  protected readonly inputGroupContext = useInputGroup()

  constructor() {
    super()
    this.trackBindings.extendWith(() => this.inputGroupContext().getBindings())
  }
}
