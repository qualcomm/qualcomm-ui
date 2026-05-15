// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  booleanAttribute,
  computed,
  Directive,
  input,
  type OnInit,
} from "@angular/core"

import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"
import type {SignalifyInput} from "@qualcomm-ui/angular-core/signals"
import type {DropzoneProps} from "@qualcomm-ui/core/file-upload"
import type {Booleanish} from "@qualcomm-ui/utils/coercion"
import type {Explicit} from "@qualcomm-ui/utils/guard"

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

  protected readonly fileUploadContext = useFileUploadContext()

  protected readonly trackBindings = useTrackBindings(() =>
    this.fileUploadContext().getDropzoneBindings(
      computed<Explicit<DropzoneProps>>(() => ({
        disableClick: this.disableClick(),
      }))(),
    ),
  )

  ngOnInit() {
    this.trackBindings()
  }
}
