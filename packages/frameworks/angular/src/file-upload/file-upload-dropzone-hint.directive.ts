// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {computed, Directive, type OnInit} from "@angular/core"

import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"

import {useQdsFileUploadContext} from "./qds-file-upload-context.service"

/**
 * Hint text displayed below the dropzone instructions.
 */
@Directive({
  selector: "[q-file-upload-dropzone-hint]",
  standalone: false,
})
export class FileUploadDropzoneHintDirective implements OnInit {
  protected readonly qdsContext = useQdsFileUploadContext()

  protected readonly trackBindings = useTrackBindings(
    computed(() => this.qdsContext().getDropzoneHintBindings()),
  )

  ngOnInit() {
    this.trackBindings()
  }
}
