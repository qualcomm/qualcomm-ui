// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Directive, type OnInit} from "@angular/core"

import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"

import {useQdsDialogContext} from "./qds-dialog-context.service"

/**
 * An icon that indicates the dialog's status.
 */
@Directive({
  selector: "[q-dialog-indicator-icon]",
  standalone: false,
})
export class DialogIndicatorIconDirective implements OnInit {
  protected readonly qdsContext = useQdsDialogContext()

  protected trackBindings = useTrackBindings(() =>
    this.qdsContext().getIndicatorIconBindings(),
  )

  ngOnInit() {
    this.trackBindings()
  }
}
