// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {computed, Directive, inject, input, type OnInit} from "@angular/core"

import {useId, useOnDestroy} from "@qualcomm-ui/angular-core/common"
import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"
import {
  PresenceContextService,
  usePresenceRenderer,
} from "@qualcomm-ui/angular-core/presence"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useComboboxContext} from "./combobox-context.service"

@Directive()
export class CoreComboboxContentDirective implements OnInit {
  /**
   * {@link https://www.w3schools.com/html/html_id.asp id attribute}. If
   * omitted, a unique identifier will be generated for accessibility.
   */
  readonly id = input<string>()

  protected readonly hostId = computed(() => useId(this, this.id()))

  protected readonly comboboxContext = useComboboxContext()

  protected readonly onDestroy = useOnDestroy()

  protected readonly presenceService = inject(PresenceContextService)

  protected readonly presenceRendererEffect = usePresenceRenderer()

  protected readonly trackBindings = useTrackBindings(() =>
    mergeProps(
      this.comboboxContext().getContentBindings({
        id: this.hostId(),
        onDestroy: this.onDestroy,
      }),
      this.presenceService.getPresenceBindings(),
    ),
  )

  ngOnInit() {
    this.trackBindings()
  }
}
