// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Component, computed, input, type OnInit} from "@angular/core"

import type {LucideIconOrString} from "@qualcomm-ui/angular-core/lucide"
import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"
import {useIconButtonApi} from "@qualcomm-ui/angular/button"
import {QuiPreloadDirective} from "@qualcomm-ui/angular/transitions"

@Component({
  hostDirectives: [QuiPreloadDirective],
  selector: "[q-header-bar-action-icon-button]",
  standalone: false,
  template: `
    <ng-content select="svg[qIcon]" />
    @if (icon()) {
      <svg [q-bind]="iconProps()" [qIcon]="icon()!"></svg>
    }
  `,
})
export class HeaderBarActionIconButtonDirective implements OnInit {
  /**
   * {@link https://lucide.dev/icons lucide-angular} icon.
   */
  readonly icon = input<LucideIconOrString>()

  protected readonly iconButtonApi = useIconButtonApi({
    density: "compact",
    size: "lg",
    variant: "ghost",
  })

  protected readonly iconProps = computed(() =>
    this.iconButtonApi().getIconBindings(),
  )

  protected readonly trackBindings = useTrackBindings(() =>
    this.iconButtonApi().getRootBindings(),
  )

  ngOnInit() {
    this.trackBindings()
  }
}
