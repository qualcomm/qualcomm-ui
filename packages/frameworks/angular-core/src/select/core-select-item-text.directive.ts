// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Directive, type OnInit} from "@angular/core"

import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"

import {useSelectContext} from "./select-context.service"
import {useSelectItemContext} from "./select-item-context.service"

@Directive()
export class CoreSelectItemTextDirective implements OnInit {
  protected readonly selectContext = useSelectContext()
  protected readonly selectItemContext = useSelectItemContext()

  protected readonly trackBindings = useTrackBindings(() =>
    this.selectContext().getItemTextBindings(this.selectItemContext()),
  )

  ngOnInit() {
    this.trackBindings()
  }
}
