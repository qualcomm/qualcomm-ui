// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Directive, type OnInit} from "@angular/core"

import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"

import {useSelectContext} from "./select-context.service"
import {useSelectItemGroupContext} from "./select-item-group-context.service"

@Directive()
export class CoreSelectItemGroupLabelDirective implements OnInit {
  protected readonly selectContext = useSelectContext()
  protected readonly itemGroupContext = useSelectItemGroupContext()

  protected readonly trackBindings = useTrackBindings(() =>
    this.selectContext().getItemGroupLabelBindings({
      htmlFor: this.itemGroupContext().id,
    }),
  )

  ngOnInit() {
    this.trackBindings()
  }
}
