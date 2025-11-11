// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {computed, Directive, type OnInit} from "@angular/core"

import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"

import {useSelectContext} from "./select-context.service"

@Directive()
export class CoreSelectValueTextDirective implements OnInit {
  readonly collection = computed(() => this.selectContext().collection)
  readonly placeholder = computed(() => this.selectContext().placeholder)
  readonly valueAsString = computed(() => this.selectContext().valueAsString)
  readonly value = computed(() => this.selectContext().value)

  protected readonly selectContext = useSelectContext()

  protected readonly trackBindings = useTrackBindings(() =>
    this.selectContext().getValueTextBindings(),
  )

  ngOnInit() {
    this.trackBindings()
  }
}
