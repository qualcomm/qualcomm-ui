// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  booleanAttribute,
  computed,
  Directive,
  input,
  type OnInit,
} from "@angular/core"

import {useId, useOnDestroy} from "@qualcomm-ui/angular-core/common"
import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"
import type {SignalifyInput} from "@qualcomm-ui/angular-core/signals"
import type {DropzoneProps} from "@qualcomm-ui/core/file-upload"
import type {Booleanish} from "@qualcomm-ui/utils/coercion"

import {useFileUploadContext} from "./file-upload-context.service"

@Directive()
export class CoreFileUploadDropzoneDirective
  implements SignalifyInput<DropzoneProps>, OnInit
{
  /**
   * Whether to disable the click event on the dropzone
   */
  readonly disableClick = input<boolean | undefined, Booleanish>(undefined, {
    transform: booleanAttribute,
  })

  readonly id = input<string>()

  private readonly hostId = computed(() => useId(this, this.id()))

  protected readonly fileUploadContext = useFileUploadContext()

  protected readonly onDestroy = useOnDestroy()

  protected readonly trackBindings = useTrackBindings(() =>
    this.fileUploadContext().getDropzoneBindings({
      disableClick: this.disableClick(),
      id: this.hostId(),
      onDestroy: this.onDestroy,
    }),
  )

  ngOnInit() {
    this.trackBindings()
  }
}
