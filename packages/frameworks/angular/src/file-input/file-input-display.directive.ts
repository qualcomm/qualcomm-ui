// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Component, computed, input, type OnInit} from "@angular/core"

import {useFileUploadContext} from "@qualcomm-ui/angular-core/file-upload"
import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"
import {useQdsFileUploadContext} from "@qualcomm-ui/angular/file-upload"
import {useQdsInputContext} from "@qualcomm-ui/angular/input"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

@Component({
  selector: "[q-file-input-display]",
  standalone: false,
  template: `
    {{ fileName() || placeholder() }}
  `,
})
export class FileInputDisplayDirective implements OnInit {
  /**
   * Text shown when no file has been selected.
   */
  readonly placeholder = input<string | undefined>()

  protected readonly fileUploadContext = useFileUploadContext()
  protected readonly qdsFileUploadContext = useQdsFileUploadContext()
  protected readonly qdsInputContext = useQdsInputContext()

  protected readonly fileName = computed(
    () =>
      this.fileUploadContext().acceptedFiles[0]?.name ??
      this.fileUploadContext().rejectedFiles[0]?.file.name,
  )

  protected readonly trackBindings = useTrackBindings(() =>
    mergeProps(
      this.qdsFileUploadContext().getInputDisplayBindings(),
      this.qdsInputContext().getInputBindings(),
    ),
  )

  ngOnInit() {
    this.trackBindings()
  }
}
