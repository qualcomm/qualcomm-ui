// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  booleanAttribute,
  computed,
  Directive,
  input,
  type OnInit,
} from "@angular/core"

import {useId, useOnDestroy} from "@qualcomm-ui/angular-core/common"
import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"
import type {SignalifyInput} from "@qualcomm-ui/angular-core/signals"
import type {ComboboxApiTriggerProps} from "@qualcomm-ui/core/combobox"
import type {Booleanish} from "@qualcomm-ui/utils/coercion"

import {useComboboxContext} from "./combobox-context.service"

@Directive()
export class CoreComboboxTriggerDirective
  implements SignalifyInput<ComboboxApiTriggerProps>, OnInit
{
  /**
   * Whether the trigger is focusable
   */
  readonly focusable = input<boolean | undefined, Booleanish>(undefined, {
    transform: booleanAttribute,
  })

  /**
   * {@link https://www.w3schools.com/html/html_id.asp id attribute}. If
   * omitted, a unique identifier will be generated for accessibility.
   */
  readonly id = input<string>()

  protected readonly comboboxContext = useComboboxContext()
  protected readonly hostId = computed(() => useId(this, this.id()))
  protected readonly onDestroy = useOnDestroy()

  protected readonly trackBindings = useTrackBindings(() =>
    this.comboboxContext().getTriggerBindings({
      focusable: this.focusable(),
      id: this.hostId(),
      onDestroy: this.onDestroy,
    }),
  )

  ngOnInit() {
    this.trackBindings()
  }
}
