// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Directive, type OnInit} from "@angular/core"

import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"

import {useFileUploadContext} from "./file-upload-context.service"

@Directive()
export class CoreFileUploadHiddenInputDirective implements OnInit {
  protected readonly fileUploadContext = useFileUploadContext()

  protected readonly trackBindings = useTrackBindings(() =>
    this.fileUploadContext().getHiddenInputBindings(),
  )

  ngOnInit() {
    this.trackBindings()
  }
}
