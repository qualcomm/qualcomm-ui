// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {computed, Directive, inject, type OnInit} from "@angular/core"

import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"
import {
  ICON_CONTEXT_TOKEN,
  type IconTokenContext,
} from "@qualcomm-ui/angular/icon"

import {useQdsDialogContext} from "./qds-dialog-context.service"

/**
 * An icon that indicates the dialog's status.
 */
@Directive({
  providers: [
    {
      provide: ICON_CONTEXT_TOKEN,
      useFactory: (): IconTokenContext => {
        const directive = inject(DialogIndicatorIconDirective)
        return {
          getBindings: computed(() =>
            directive.qdsContext().getIndicatorIconBindings(),
          ),
        }
      },
    },
  ],
  selector: "[q-dialog-indicator-icon]",
  standalone: false,
})
export class DialogIndicatorIconDirective implements OnInit {
  readonly qdsContext = useQdsDialogContext()

  protected trackBindings = useTrackBindings(() =>
    this.qdsContext().getIndicatorIconBindings(),
  )

  ngOnInit() {
    this.trackBindings()
  }
}
