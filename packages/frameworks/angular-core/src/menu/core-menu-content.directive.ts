// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  computed,
  Directive,
  effect,
  ElementRef,
  inject,
  input,
  type OnInit,
} from "@angular/core"

import {useId, useOnDestroy} from "@qualcomm-ui/angular-core/common"
import {mergeProps, useTrackBindings} from "@qualcomm-ui/angular-core/machine"
import {
  PresenceContextService,
  usePresenceRenderer,
} from "@qualcomm-ui/angular-core/presence"

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
      this.presenceService.getPresenceBindings(),
    )
  })

  protected readonly onDestroy = useOnDestroy()

  protected presenceEffect = usePresenceRenderer()

  private readonly hostId = computed(() => useId(this, this.id()))

  constructor() {
    // update the ref when the element is mounted or unmounted to keep state in sync.
    // React does this automatically with its composable refs and data binding, but
    // with Angular we must do this imperatively.
    effect(() => {
      const element = this.elementRef.nativeElement
      if (this.presenceService.unmounted()) {
        this.presenceService.setNode(null)
      } else {
        this.presenceService.setNode(element)
      }
    })
  }

  ngOnInit() {
    this.trackBindings()
  }
}
