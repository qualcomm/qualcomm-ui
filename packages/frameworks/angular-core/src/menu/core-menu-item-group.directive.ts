// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {computed, Directive, inject, input, type OnInit} from "@angular/core"

import {useId} from "@qualcomm-ui/angular-core/common"
import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"

import {useMenuContext} from "./menu-context.service"
import {MenuItemGroupContextService} from "./menu-item-group-context.service"

@Directive()
export class CoreMenuItemGroupDirective implements OnInit {
  /**
   * {@link https://www.w3schools.com/html/html_id.asp id attribute}. If
   * omitted, a unique identifier will be generated for accessibility.
   */
  readonly id = input<string>()

  protected readonly menuContext = useMenuContext()
  protected readonly menuItemGroupService = inject(MenuItemGroupContextService)

  protected readonly trackBindings = useTrackBindings(() => {
    return this.menuContext().getItemGroupBindings({
      id: this.hostId(),
    })
  })

  private readonly hostId = computed(() => useId(this, this.id()))

  ngOnInit() {
    this.menuItemGroupService.init(computed(() => ({id: this.hostId()})))
    this.trackBindings()
  }
}
