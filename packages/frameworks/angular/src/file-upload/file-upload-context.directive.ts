// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Directive, inject} from "@angular/core"

import {ApiContextDirective} from "@qualcomm-ui/angular-core/machine"
import {FileUploadContextService} from "@qualcomm-ui/angular-core/file-upload"
import type {FileUploadApi} from "@qualcomm-ui/core/file-upload"

@Directive({
  selector: "[fileUploadContext]",
  standalone: false,
})
export class FileUploadContextDirective extends ApiContextDirective<FileUploadApi> {
  constructor() {
    const contextService = inject(FileUploadContextService)
    super(contextService, "fileUploadContext")
  }

  /**
   * Provides intellisense for the context in the template.
   */
  static ngTemplateContextGuard(
    dir: FileUploadContextDirective,
    ctx: unknown,
  ): ctx is {$implicit: FileUploadApi} {
    return true
  }
}
