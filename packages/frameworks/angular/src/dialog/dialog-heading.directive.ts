// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {computed, Directive} from "@angular/core"

import {CoreDialogHeadingDirective} from "@qualcomm-ui/angular-core/dialog"

import {useQdsDialogContext} from "./qds-dialog-context.service"

/**
 * A heading that labels the dialog.
 */
@Directive({
  selector: "[q-dialog-heading]",
  standalone: false,
})
export class DialogHeadingDirective extends CoreDialogHeadingDirective {
  protected readonly qdsContext = useQdsDialogContext()

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.qdsContext().getHeadingBindings()),
    )
  }
}
