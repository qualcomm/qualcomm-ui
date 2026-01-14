// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {computed, Directive, input, type OnInit} from "@angular/core"

import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"
import type {SignalifyInput} from "@qualcomm-ui/angular-core/signals"
import type {ItemGroupProps, ItemType} from "@qualcomm-ui/core/file-upload"
import type {Explicit} from "@qualcomm-ui/utils/guard"

import {useFileUploadContext} from "./file-upload-context.service"

@Directive()
export class CoreFileUploadItemGroupDirective
  implements SignalifyInput<ItemGroupProps>, OnInit
{
  /**
   * The type of items in this group (accepted or rejected)
   */
  readonly type = input<ItemType | undefined>()

  protected readonly fileUploadContext = useFileUploadContext()

  protected readonly trackBindings = useTrackBindings(() =>
    this.fileUploadContext().getItemGroupBindings(
      computed<Explicit<ItemGroupProps>>(() => ({
        type: this.type(),
      }))(),
    ),
  )

  ngOnInit() {
    this.trackBindings()
  }
}
