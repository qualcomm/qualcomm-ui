// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {computed, Directive, inject, type OnInit} from "@angular/core"

import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"
import {
  provideQdsButtonPropsContext,
  QdsButtonPropsContextService,
} from "@qualcomm-ui/angular/button"

import {useQdsMenuContext} from "./qds-menu-context.service"

/**
 * The bottom section of the menu.
 */
@Directive({
  providers: [provideQdsButtonPropsContext()],
  selector: "[q-menu-footer]",
  standalone: false,
})
export class MenuFooterDirective implements OnInit {
  protected readonly buttonPropsService = inject(QdsButtonPropsContextService)
  protected readonly qdsMenuContext = useQdsMenuContext()

  protected readonly trackBindings = useTrackBindings(() =>
    this.qdsMenuContext().getFooterBindings(),
  )

  ngOnInit() {
    this.buttonPropsService.init(
      computed(() => this.qdsMenuContext().getFooterButtonProps()),
    )
    this.trackBindings()
  }
}
