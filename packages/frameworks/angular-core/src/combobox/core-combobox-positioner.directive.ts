// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {computed, Directive, input, type OnInit} from "@angular/core"

import {useId, useOnDestroy} from "@qualcomm-ui/angular-core/common"
import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"
import {usePresenceRenderer} from "@qualcomm-ui/angular-core/presence"

import {useComboboxContext} from "./combobox-context.service"

@Directive()
export class CoreComboboxPositionerDirective implements OnInit {
  /**
   * {@link https://www.w3schools.com/html/html_id.asp id attribute}. If
   * omitted, a unique identifier will be generated for accessibility.
   */
  readonly id = input<string>()

  private readonly hostId = computed(() => useId(this, this.id()))

  protected readonly comboboxContext = useComboboxContext()

  protected readonly onDestroy = useOnDestroy()

  protected readonly presenceRendererEffect = usePresenceRenderer()

  protected readonly trackBindings = useTrackBindings(() =>
    this.comboboxContext().getPositionerBindings({
      id: this.hostId(),
      onDestroy: this.onDestroy,
    }),
  )

  ngOnInit() {
    this.trackBindings()
  }
}
