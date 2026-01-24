// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {computed, Directive, inject, input, type OnInit} from "@angular/core"

import {normalizeProps} from "@qualcomm-ui/angular-core/machine"
import {
  CoreFileUploadRootDirective,
  provideFileUploadContext,
} from "@qualcomm-ui/angular-core/file-upload"
import {
  createQdsFileUploadApi,
  type QdsFileUploadSize,
} from "@qualcomm-ui/qds-core/file-upload"

import {
  provideQdsFileUploadContext,
  QdsFileUploadContextService,
} from "./qds-file-upload-context.service"

@Directive({
  providers: [provideFileUploadContext(), provideQdsFileUploadContext()],
  selector: "[q-file-upload-root]",
  standalone: false,
})
export class FileUploadRootDirective
  extends CoreFileUploadRootDirective
  implements OnInit
{
  /**
   * Governs the size and padding of file upload elements.
   *
   * @default 'md'
   */
  readonly size = input<QdsFileUploadSize>()

  protected readonly fileUploadService = inject(QdsFileUploadContextService)

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.fileUploadService.context().getRootBindings()),
    )
  }

  override ngOnInit() {
    super.ngOnInit()

    this.fileUploadService.init(
      computed(() =>
        createQdsFileUploadApi(
          {
            size: this.size(),
          },
          normalizeProps,
        ),
      ),
    )
  }
}
