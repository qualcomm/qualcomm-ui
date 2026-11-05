// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {computed, Directive} from "@angular/core"

import {
  CoreFileUploadItemDirective,
  provideFileUploadItemContext,
} from "@qualcomm-ui/angular-core/file-upload"

import {useQdsFileUploadContext} from "./qds-file-upload-context.service"

@Directive({
  providers: [provideFileUploadItemContext()],
  selector: "[q-file-upload-item]",
  standalone: false,
})
export class FileUploadItemDirective extends CoreFileUploadItemDirective {
  protected readonly qdsFileUploadContext = useQdsFileUploadContext()

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.qdsFileUploadContext().getItemBindings()),
    )
  }
}
