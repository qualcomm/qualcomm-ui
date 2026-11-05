// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {computed, Directive, inject} from "@angular/core"

import {DialogIndicatorIconDirective} from "@qualcomm-ui/angular/dialog"
import {
  ICON_CONTEXT_TOKEN,
  type IconTokenContext,
} from "@qualcomm-ui/angular/icon"

/**
 * An icon that indicates the drawer's status.
 */
@Directive({
  providers: [
    {
      provide: ICON_CONTEXT_TOKEN,
      useFactory: (): IconTokenContext => {
        const directive = inject(DrawerIndicatorIconDirective)
        return {
          getBindings: computed(() =>
            directive.qdsContext().getIndicatorIconBindings(),
          ),
        }
      },
    },
  ],
  selector: "[q-drawer-indicator-icon]",
  standalone: false,
})
export class DrawerIndicatorIconDirective extends DialogIndicatorIconDirective {}
