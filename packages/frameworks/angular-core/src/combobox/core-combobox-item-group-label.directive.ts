// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Directive, type OnInit} from "@angular/core"

import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"

import {useComboboxContext} from "./combobox-context.service"
import {useComboboxItemGroupContext} from "./combobox-item-group-context.service"

@Directive()
export class CoreComboboxItemGroupLabelDirective implements OnInit {
  protected readonly comboboxContext = useComboboxContext()
  protected readonly itemGroupContext = useComboboxItemGroupContext()

  protected readonly trackBindings = useTrackBindings(() =>
    this.comboboxContext().getItemGroupLabelBindings({
      htmlFor: this.itemGroupContext().id,
    }),
  )

  ngOnInit() {
    this.trackBindings()
  }
}
