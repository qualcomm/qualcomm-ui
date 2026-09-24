// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Component, input, type OnInit} from "@angular/core"
import {LucideChevronDown} from "@lucide/angular"

import {
  type LucideIconOrString,
  provideIcons,
} from "@qualcomm-ui/angular-core/lucide"
import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"
import {useMenuContext} from "@qualcomm-ui/angular-core/menu"
import {useQdsMenuContext} from "@qualcomm-ui/angular/menu"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsHeaderBarContext} from "./qds-header-bar-context.service"

@Component({
  providers: [provideIcons({LucideChevronDown})],
  selector: "[q-header-bar-menu-item]",
  standalone: false,
  template: `
    @if (icon()) {
      <svg [qIcon]="icon()!"></svg>
    }
    <ng-content />
    <svg data-header-bar-part="end-icon" qIcon="LucideChevronDown"></svg>
  `,
})
export class HeaderBarMenuItemDirective implements OnInit {
  /**
   * {@link https://lucide.dev lucide-angular} icon.
   */
  readonly icon = input<LucideIconOrString>()

  protected readonly menuContext = useMenuContext({optional: true})
  protected readonly qdsMenuContext = useQdsMenuContext({optional: true})
  protected readonly qdsHeaderBarContext = useQdsHeaderBarContext()

  protected readonly trackBindings = useTrackBindings(() => {
    if (!this.menuContext || !this.qdsMenuContext) {
      throw new Error("HeaderBarMenuItem must be used within a Menu")
    }

    return mergeProps(
      this.qdsMenuContext().getButtonBindings(),
      this.qdsHeaderBarContext().getNavItemBindings(),
    )
  })

  ngOnInit() {
    this.trackBindings()
  }
}
