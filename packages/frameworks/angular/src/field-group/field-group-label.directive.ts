// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Directive, type OnInit} from "@angular/core"

import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"

import {useQdsFieldGroupContext} from "./qds-field-group-context.service"

/**
 * Label for the field group. Use with a `<legend>` element inside a fieldset.
 */
@Directive({
  selector: "[q-field-group-label]",
  standalone: false,
})
export class FieldGroupLabelDirective implements OnInit {
  protected readonly qdsFieldGroupContext = useQdsFieldGroupContext()

  protected readonly trackBindings = useTrackBindings(() =>
    this.qdsFieldGroupContext().getLabelBindings(),
  )

  ngOnInit() {
    this.trackBindings()
  }
}
