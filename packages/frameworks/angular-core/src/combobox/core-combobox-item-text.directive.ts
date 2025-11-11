// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Directive, type OnInit} from "@angular/core"

import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"

import {useComboboxContext} from "./combobox-context.service"
import {useComboboxItemContext} from "./combobox-item-context.service"

@Directive()
export class CoreComboboxItemTextDirective implements OnInit {
  protected readonly comboboxContext = useComboboxContext()
  protected readonly itemContext = useComboboxItemContext()

  protected readonly trackBindings = useTrackBindings(() =>
    this.comboboxContext().getItemTextBindings(this.itemContext()),
  )

  ngOnInit() {
    this.trackBindings()
  }
}
