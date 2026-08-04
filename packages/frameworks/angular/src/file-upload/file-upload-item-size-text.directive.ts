// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Component, computed} from "@angular/core"

import {CoreFileUploadItemSizeTextDirective} from "@qualcomm-ui/angular-core/file-upload"

import {useQdsFileUploadContext} from "./qds-file-upload-context.service"

@Component({
  selector: "[q-file-upload-item-size-text]",
  standalone: false,
  template: `
    @if (fileSize()) {
      {{ fileSize() }}
    }
  `,
})
export class FileUploadItemSizeTextDirective extends CoreFileUploadItemSizeTextDirective {
  protected readonly qdsFileUploadContext = useQdsFileUploadContext()

  readonly fileSize = computed(() => {
    const itemContext = this.fileUploadItemContext()
    const fileUploadContext = this.fileUploadContext()
    return itemContext.type === "rejected"
      ? null
      : fileUploadContext.getFileSize(itemContext.file)
  })

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.qdsFileUploadContext().getItemSizeTextBindings()),
    )
  }
}
