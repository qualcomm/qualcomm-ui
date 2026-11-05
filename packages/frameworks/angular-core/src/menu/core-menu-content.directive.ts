// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  computed,
  Directive,
  ElementRef,
  inject,
  input,
  type OnInit,
} from "@angular/core"

import {useId, useOnDestroy} from "@qualcomm-ui/angular-core/common"
import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"
import {PresenceContextService} from "@qualcomm-ui/angular-core/presence"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useMenuContext} from "./menu-context.service"

@Directive()
export class CoreMenuContentDirective implements OnInit {
  /**
   * {@link https://www.w3schools.com/html/html_id.asp id attribute}. If
   * omitted, a unique identifier will be generated for accessibility.
   */
  readonly id = input<string>()

  protected readonly menuContext = useMenuContext()
  protected readonly presenceService = inject(PresenceContextService)

  readonly elementRef = inject(ElementRef)

  protected readonly trackBindings = useTrackBindings(() => {
    return mergeProps(
      this.menuContext().getContentBindings({
        id: this.hostId(),
        onDestroy: this.onDestroy,
      }),
      {hidden: this.presenceService.getPresenceBindings().hidden},
    )
  })

  protected readonly onDestroy = useOnDestroy()

  private readonly hostId = computed(() => useId(this, this.id()))

  ngOnInit() {
    this.trackBindings()
  }
}
