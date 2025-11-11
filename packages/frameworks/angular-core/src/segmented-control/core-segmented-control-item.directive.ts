// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  booleanAttribute,
  computed,
  Directive,
  inject,
  Injector,
  input,
  type OnInit,
} from "@angular/core"

import {CheckboxContextService} from "@qualcomm-ui/angular-core/checkbox"
import {useId, useOnDestroy} from "@qualcomm-ui/angular-core/common"
import {
  normalizeProps,
  useMachine,
  useTrackBindings,
} from "@qualcomm-ui/angular-core/machine"
import type {SignalifyInput} from "@qualcomm-ui/angular-core/signals"
import {
  type CheckboxApiProps,
  checkboxMachine,
  createCheckboxApi,
} from "@qualcomm-ui/core/checkbox"
import type {SegmentedControlItemApiProps} from "@qualcomm-ui/core/segmented-control"
import type {Booleanish} from "@qualcomm-ui/utils/coercion"

import {useSegmentedControlContext} from "./segmented-control-context.service"

@Directive()
export class CoreSegmentedControlItemDirective
  implements OnInit, SignalifyInput<SegmentedControlItemApiProps>
{
  /**
   * {@link https://www.w3schools.com/html/html_id.asp id attribute}. If
   * omitted, a unique identifier will be generated for accessibility.)
   */
  readonly id = input<string>()

  readonly disabled = input<boolean | undefined, Booleanish>(undefined, {
    transform: booleanAttribute,
  })

  readonly value = input.required<string>()

  protected readonly onDestroy = useOnDestroy()
  private readonly hostId = computed(() => useId(this, this.id()))
  protected readonly injector = inject(Injector)

  protected readonly checkboxContext = inject(CheckboxContextService)

  protected readonly context = useSegmentedControlContext()

  protected readonly trackBindings = useTrackBindings(() => {
    const id = this.hostId()
    return {
      ...this.checkboxContext.context().getRootBindings({id}),
      ...this.context().getItemBindings({id}),
    }
  })

  ngOnInit() {
    const machine = useMachine(
      checkboxMachine,
      computed<CheckboxApiProps>(() => ({
        checked: this.context().value?.includes(this.value()),
        defaultChecked: this.context().defaultValue?.includes(this.value()),
        dir: this.context().dir,
        disabled: this.context().disabled || this.disabled(),
        name: this.context().getName(),
        onCheckedChange: (next) => {
          this.context().handleChange(this.value(), next)
        },
        value: this.value(),
      })),
      this.injector,
    )
    this.checkboxContext.init(
      computed(() => createCheckboxApi(machine, normalizeProps)),
    )

    this.trackBindings()
  }
}
