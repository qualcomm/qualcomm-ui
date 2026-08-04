// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Component, computed, type OnInit} from "@angular/core"
import {X} from "lucide-angular"

import {provideIcons} from "@qualcomm-ui/angular-core/lucide"
import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"
import {useIconButtonApi} from "@qualcomm-ui/angular/button"
import {QuiPreloadDirective} from "@qualcomm-ui/angular/transitions"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsAlertBannerContext} from "./qds-alert-banner-context.service"

@Component({
  hostDirectives: [QuiPreloadDirective],
  providers: [provideIcons({X})],
  selector: "[q-alert-banner-close-button]",
  standalone: false,
  template: `
    <ng-content>
      <svg qIcon="X" [q-bind]="iconProps()"></svg>
    </ng-content>
  `,
})
export class AlertBannerCloseButtonDirective implements OnInit {
  protected readonly qdsContext = useQdsAlertBannerContext()

  protected readonly iconButtonApi = useIconButtonApi({
    density: "compact",
    emphasis: computed(() => this.qdsContext().closeButtonEmphasis),
    size: "md",
    variant: "ghost",
  })

  protected readonly iconProps = computed(() =>
    this.iconButtonApi().getIconBindings(),
  )

  protected readonly trackBindings = useTrackBindings(() =>
    mergeProps(
      {onclick: () => this.qdsContext().onClose?.()},
      this.qdsContext().getCloseButtonBindings(),
      this.iconButtonApi().getRootBindings(),
    ),
  )

  ngOnInit() {
    this.trackBindings()
  }
}
