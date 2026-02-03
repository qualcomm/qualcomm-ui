// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {computed, Directive, type OnInit} from "@angular/core"

import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"

import {useQdsFileUploadContext} from "./qds-file-upload-context.service"

/**
 * Container for the dropzone text line.
 */
@Directive({
  selector: "[q-file-upload-dropzone-text-line]",
  standalone: false,
})
export class FileUploadDropzoneTextLineDirective implements OnInit {
  protected readonly qdsContext = useQdsFileUploadContext()

  protected readonly trackBindings = useTrackBindings(
    computed(() => this.qdsContext().getDropzoneTextLineBindings()),
  )

  ngOnInit() {
    this.trackBindings()
  }
}
