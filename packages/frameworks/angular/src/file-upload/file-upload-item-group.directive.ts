// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {computed, Directive} from "@angular/core"

import {CoreFileUploadItemGroupDirective} from "@qualcomm-ui/angular-core/file-upload"

import {useQdsFileUploadContext} from "./qds-file-upload-context.service"

@Directive({
  selector: "[q-file-upload-item-group]",
  standalone: false,
})
export class FileUploadItemGroupDirective extends CoreFileUploadItemGroupDirective {
  protected readonly qdsFileUploadContext = useQdsFileUploadContext()

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.qdsFileUploadContext().getItemGroupBindings()),
    )
  }
}
