// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Directive, type OnInit} from "@angular/core"

import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"

import {useDialogContext} from "./dialog-context.service"

@Directive()
export class CoreDialogFooterDirective implements OnInit {
  protected readonly dialogContext = useDialogContext()

  protected readonly trackBindings = useTrackBindings(() =>
    this.dialogContext().getFooterBindings(),
  )

  ngOnInit() {
    this.trackBindings()
  }
}
