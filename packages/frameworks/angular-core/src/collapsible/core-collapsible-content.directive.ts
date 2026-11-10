// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {computed, Directive, inject, input, type OnInit} from "@angular/core"

import {useId, useOnDestroy} from "@qualcomm-ui/angular-core/common"
import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"

import {
  CollapsibleContextService,
  useCollapsibleContext,
} from "./collapsible-context.service"

@Directive()
export class CoreCollapsibleContentDirective implements OnInit {
  /**
   * {@link https://www.w3schools.com/html/html_id.asp id attribute}. If
   * omitted, a unique identifier will be generated for accessibility.
   */
  readonly id = input<string>()

  private readonly collapsibleService = inject(CollapsibleContextService)

  /**
   * Whether descendants should be rendered. Wrap content in
   * `@if (content.shouldRender())` to defer creating its components and to
   * destroy them after collapse when the render strategy requires it.
   */
  readonly shouldRender = computed(() => !this.collapsibleService.isUnmounted())

  protected readonly collapsibleContext = useCollapsibleContext()

  protected readonly trackBindings = useTrackBindings(() => {
    return this.collapsibleContext().getContentBindings({
      id: this.hostId(),
      onDestroy: this.onDestroy,
    })
  })

  protected readonly hostId = computed(() => useId(this, this.id()))

  protected readonly onDestroy = useOnDestroy()

  ngOnInit() {
    this.trackBindings()
  }
}
