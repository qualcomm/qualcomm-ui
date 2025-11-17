// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Directive, type OnInit} from "@angular/core"

import {
  normalizeProps,
  useTrackBindings,
} from "@qualcomm-ui/angular-core/machine"
import {getQdsKbdBindings} from "@qualcomm-ui/qds-core/kbd"

@Directive({
  selector: "[q-kbd]",
})
export class KbdDirective implements OnInit {
  protected readonly trackBindings = useTrackBindings(() =>
    getQdsKbdBindings(normalizeProps),
  )

  ngOnInit() {
    this.trackBindings()
  }
}
