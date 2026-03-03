// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Directive, type OnInit} from "@angular/core"

import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"

import {useQdsFieldGroupContext} from "./qds-field-group-context.service"

/**
 * Container for the field group items.
 */
@Directive({
  selector: "[q-field-group-items]",
  standalone: false,
})
export class FieldGroupItemsDirective implements OnInit {
  protected readonly qdsFieldGroupContext = useQdsFieldGroupContext()

  protected readonly trackBindings = useTrackBindings(() =>
    this.qdsFieldGroupContext().getItemsBindings(),
  )

  ngOnInit() {
    this.trackBindings()
  }
}
