// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Directive, ElementRef, inject, type OnInit} from "@angular/core"

import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"

import {useFileUploadContext} from "./file-upload-context.service"
import {useFileUploadItemContext} from "./file-upload-item-context.service"

@Directive()
export class CoreFileUploadItemSizeTextDirective implements OnInit {
  protected readonly fileUploadContext = useFileUploadContext()
  protected readonly fileUploadItemContext = useFileUploadItemContext()
  private readonly elementRef = inject(ElementRef)

  protected readonly trackBindings = useTrackBindings(() =>
    this.fileUploadContext().getItemSizeTextBindings(
      this.fileUploadItemContext(),
    ),
  )

  ngOnInit() {
    this.trackBindings()

    const context = this.fileUploadContext()
    const itemContext = this.fileUploadItemContext()
    if (itemContext.file) {
      this.elementRef.nativeElement.textContent = context.getFileSize(
        itemContext.file,
      )
    }
  }
}
