// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Directive, type OnInit} from "@angular/core"

import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"

import {useQdsFieldGroupContext} from "./qds-field-group-context.service"

/**
 * Hint text displayed below the field group items.
 */
@Directive({
  selector: "[q-field-group-hint]",
  standalone: false,
})
export class FieldGroupHintDirective implements OnInit {
  protected readonly qdsFieldGroupContext = useQdsFieldGroupContext()

  protected readonly trackBindings = useTrackBindings(() =>
    this.qdsFieldGroupContext().getHintBindings(),
  )

  ngOnInit() {
    this.trackBindings()
  }
}
