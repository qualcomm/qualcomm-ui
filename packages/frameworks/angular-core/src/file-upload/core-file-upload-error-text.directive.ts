// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {computed, Directive, input, type OnInit} from "@angular/core"

import {useId} from "@qualcomm-ui/angular-core/common"
import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"

import {useFileUploadContext} from "./file-upload-context.service"

@Directive()
export class CoreFileUploadErrorTextDirective implements OnInit {
  readonly id = input<string>()

  protected readonly fileUploadContext = useFileUploadContext()

  protected readonly trackBindings = useTrackBindings(() =>
    this.fileUploadContext().getErrorTextBindings({
      id: this.hostId(),
    }),
  )

  private readonly hostId = computed(() => useId(this, this.id()))

  ngOnInit() {
    this.trackBindings()
  }
}
