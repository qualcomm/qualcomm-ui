// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {computed, Directive, inject, input, type OnInit} from "@angular/core"

import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"
import type {SignalifyInput} from "@qualcomm-ui/angular-core/signals"
import type {ItemProps, ItemType} from "@qualcomm-ui/core/file-upload"
import type {Explicit} from "@qualcomm-ui/utils/guard"

import {useFileUploadContext} from "./file-upload-context.service"
import {FileUploadItemContextService} from "./file-upload-item-context.service"

@Directive()
export class CoreFileUploadItemDirective
  implements SignalifyInput<ItemProps>, OnInit
{
  /**
   * The file associated with this item
   */
  readonly file = input.required<File>()

  /**
   * The type of item (accepted or rejected)
   */
  readonly type = input<ItemType | undefined>()

  protected readonly fileUploadContext = useFileUploadContext()

  protected readonly fileUploadItemService = inject(
    FileUploadItemContextService,
  )

  protected readonly trackBindings = useTrackBindings(() =>
    this.fileUploadContext().getItemBindings(
      this.fileUploadItemService.context(),
    ),
  )

  ngOnInit() {
    this.fileUploadItemService.init(
      computed<Explicit<ItemProps>>(() => ({
        file: this.file(),
        type: this.type(),
      })),
    )

    this.trackBindings()
  }
}
