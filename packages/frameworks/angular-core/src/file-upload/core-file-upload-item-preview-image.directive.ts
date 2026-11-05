// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Directive, input, type OnInit} from "@angular/core"

import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"
import type {SignalifyInput} from "@qualcomm-ui/angular-core/signals"
import type {ItemPreviewImageProps} from "@qualcomm-ui/core/file-upload"

import {useFileUploadContext} from "./file-upload-context.service"
import {useFileUploadItemContext} from "./file-upload-item-context.service"

@Directive()
export class CoreFileUploadItemPreviewImageDirective
  implements
    Omit<SignalifyInput<ItemPreviewImageProps>, "file" | "fileErrors" | "type">,
    OnInit
{
  /**
   * The URL of the image to preview
   */
  readonly url = input.required<string>()

  protected readonly fileUploadContext = useFileUploadContext()
  protected readonly fileUploadItemContext = useFileUploadItemContext()

  protected readonly trackBindings = useTrackBindings(() =>
    this.fileUploadContext().getItemPreviewImageBindings({
      ...this.fileUploadItemContext(),
      url: this.url(),
    }),
  )

  ngOnInit() {
    this.trackBindings()
  }
}
