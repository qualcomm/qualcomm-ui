// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Component, computed} from "@angular/core"
import {X} from "lucide-angular"

import {CoreDialogCloseTriggerDirective} from "@qualcomm-ui/angular-core/dialog"
import {provideIcons} from "@qualcomm-ui/angular-core/lucide"
import {useIconButtonApi} from "@qualcomm-ui/angular/button"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsDialogContext} from "./qds-dialog-context.service"

/**
 * A button that closes the dialog.
 */
@Component({
  providers: [provideIcons({X})],
  selector: "[q-dialog-close-button]",
  standalone: false,
  template: `
    <svg qIcon="X" [q-bind]="buttonApi().getIconBindings()"></svg>
  `,
})
export class DialogCloseButtonComponent extends CoreDialogCloseTriggerDirective {
  protected readonly qdsContext = useQdsDialogContext()
  protected readonly buttonApi = useIconButtonApi({
    density: "compact",
    size: "md",
    variant: "ghost",
  })

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() =>
        mergeProps(
          this.buttonApi().getRootBindings(),
          this.qdsContext().getCloseButtonBindings(),
        ),
      ),
    )
  }
}
