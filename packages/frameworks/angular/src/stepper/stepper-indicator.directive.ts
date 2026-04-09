// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Component, computed, input} from "@angular/core"
import {Check} from "lucide-angular"

import {
  type LucideIconOrString,
  provideIcons,
} from "@qualcomm-ui/angular-core/lucide"
import {
  CoreStepperIndicatorDirective,
  useStepperContext,
  useStepperItemContext,
} from "@qualcomm-ui/angular-core/stepper"
import {StepperIndicatorAlert} from "@qualcomm-ui/qds-core/stepper"

import {useQdsStepperContext} from "./qds-stepper-context.service"

@Component({
  providers: [provideIcons({Check})],
  selector: "[q-stepper-indicator]",
  standalone: false,
  template: `
    @if (!itemState().current && itemState().completed) {
      @if (completedIcon()) {
        <svg
          [q-bind]="qdsContext().getIndicatorIconBindings()"
          [qIcon]="completedIcon()!"
        />
      }
    } @else if (!itemState().current && itemState().invalid) {
      @if (errorIcon()) {
        <svg
          [q-bind]="qdsContext().getIndicatorIconBindings()"
          [qIcon]="errorIcon()!"
        />
      }
    } @else {
      <span><ng-content /></span>
    }
  `,
})
export class StepperIndicatorDirective extends CoreStepperIndicatorDirective {
  /**
   * Icon to display when the step is completed.
   *
   * @default 'check'
   */
  readonly completedIcon = input<LucideIconOrString | undefined>("check")

  /**
   * Icon to display when the step is in an error state.
   *
   * @default StepperIndicatorAlert
   */
  readonly errorIcon = input<LucideIconOrString | undefined>(
    StepperIndicatorAlert,
  )

  protected readonly qdsContext = useQdsStepperContext()

  private readonly _stepperContext = useStepperContext()
  private readonly _stepperItemContext = useStepperItemContext()

  protected readonly itemState = computed(() =>
    this._stepperContext().getItemState(this._stepperItemContext()),
  )

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() => this.qdsContext().getIndicatorBindings()),
    )
  }
}
