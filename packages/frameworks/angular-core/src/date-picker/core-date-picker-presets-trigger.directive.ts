// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {computed, Directive, type OnInit} from "@angular/core"

import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"

import {useDatePickerContext} from "./date-picker-context.service"

@Directive()
export class CoreDatePickerPresetsTriggerDirective implements OnInit {
  protected readonly datePickerContext = useDatePickerContext()

  protected readonly coreBindings = computed(() =>
    this.datePickerContext().getPresetsTriggerBindings(),
  )

  protected readonly trackBindings = useTrackBindings(() => this.coreBindings())

  ngOnInit() {
    this.trackBindings()
  }
}
