// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  booleanAttribute,
  computed,
  Directive,
  inject,
  input,
  type OnInit,
} from "@angular/core"

import {useId, useOnDestroy} from "@qualcomm-ui/angular-core/common"
import {useForbiddenFormControlWarning} from "@qualcomm-ui/angular-core/forms"
import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"
import type {SignalifyInput} from "@qualcomm-ui/angular-core/signals"
import type {RadioItemContext} from "@qualcomm-ui/core/radio"
import type {Booleanish} from "@qualcomm-ui/utils/coercion"

import {useRadioContext} from "./radio-context.service"
import {RadioItemContextService} from "./radio-item-context.service"

@Directive()
export class CoreRadioRootDirective
  implements OnInit, SignalifyInput<RadioItemContext>
{
  /**
   * Controls whether the input is disabled in template-driven forms. When true,
   * prevents user interaction and applies visual styling to indicate the disabled
   * state.
   *
   * @remarks
   * The parent `q-radio-group` `disabled` property, if set to true, will override
   * this input.
   */
  readonly disabled = input<boolean | undefined, Booleanish>(undefined, {
    transform: booleanAttribute,
  })

  /**
   * {@link https://www.w3schools.com/html/html_id.asp id attribute}. If
   * omitted, a unique identifier will be generated for accessibility.)
   */
  readonly id = input<string>()

  /**
   * The value of the radio input. This is used to identify which radio is
   * selected in a group.
   */
  readonly value = input.required<string>()

  protected readonly radioContext = useRadioContext()
  protected readonly radioItemContext = inject(RadioItemContextService)

  protected readonly trackBindings = useTrackBindings(() =>
    this.radioContext().getRadioBindings({
      disabled: this.disabled(),
      id: this.hostId(),
      onDestroy: this.onDestroy,
      value: this.value(),
    }),
  )

  protected readonly hostId = computed(() => useId(this, this.id()))

  protected readonly onDestroy = useOnDestroy()

  constructor() {
    useForbiddenFormControlWarning({
      directive: "q-radio",
      rootDirective: "q-radio-group",
    })
  }

  ngOnInit() {
    this.trackBindings()

    this.radioItemContext.init(
      computed(() => ({
        disabled: this.disabled(),
        value: this.value(),
      })),
    )
  }
}
