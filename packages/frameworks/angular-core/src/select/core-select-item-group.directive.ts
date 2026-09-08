// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {computed, Directive, inject, input, type OnInit} from "@angular/core"

import {useId} from "@qualcomm-ui/angular-core/common"
import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"
import type {ItemGroupProps} from "@qualcomm-ui/core/select"

import {useSelectContext} from "./select-context.service"
import {SelectItemGroupContextService} from "./select-item-group-context.service"

@Directive()
export class CoreSelectItemGroupDirective implements OnInit {
  /**
   * Unique identifier for the select item group. Not the final HTML `id`
   * attribute.
   */
  readonly id = input<string>()

  protected readonly selectContext = useSelectContext()
  protected readonly selectItemGroupService = inject(
    SelectItemGroupContextService,
  )
  protected readonly hostId = computed(() => useId(this, this.id()))

  protected readonly trackBindings = useTrackBindings(() =>
    this.selectContext().getItemGroupBindings(
      this.selectItemGroupService.context(),
    ),
  )

  ngOnInit() {
    this.selectItemGroupService.init(
      computed(
        () =>
          ({
            id: this.hostId(),
          }) satisfies ItemGroupProps,
      ),
    )

    this.trackBindings()
  }
}
