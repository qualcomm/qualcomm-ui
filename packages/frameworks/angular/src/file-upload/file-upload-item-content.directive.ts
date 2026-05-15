// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Directive, type OnInit} from "@angular/core"

import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"

import {useQdsFileUploadContext} from "./qds-file-upload-context.service"

@Directive({
  selector: "[q-file-upload-item-content]",
  standalone: false,
})
export class FileUploadItemContentDirective implements OnInit {
  protected readonly qdsContext = useQdsFileUploadContext()

  protected readonly trackBindings = useTrackBindings(() =>
    this.qdsContext().getItemContentBindings(),
  )

  ngOnInit() {
    this.trackBindings()
  }
}
