// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {computed, Directive, type OnInit} from "@angular/core"

import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"

import {useQdsFileUploadContext} from "./qds-file-upload-context.service"

/**
 * The main dropzone text content.
 */
@Directive({
  selector: "[q-file-upload-dropzone-text]",
  standalone: false,
})
export class FileUploadDropzoneTextDirective implements OnInit {
  protected readonly qdsContext = useQdsFileUploadContext()

  protected readonly trackBindings = useTrackBindings(
    computed(() => this.qdsContext().getDropzoneTextBindings()),
  )

  ngOnInit() {
    this.trackBindings()
  }
}
