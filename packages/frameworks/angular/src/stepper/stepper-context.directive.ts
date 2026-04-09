// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Directive, inject} from "@angular/core"

import {ApiContextDirective} from "@qualcomm-ui/angular-core/machine"
import {StepperContextService} from "@qualcomm-ui/angular-core/stepper"
import type {StepperApi} from "@qualcomm-ui/core/stepper"

/**
 * Access the API of the {@link StepperRootDirective} in the template.
 *
 * @example
 * ```angular-html
 * <div q-stepper-root [count]="3">
 *   <ng-container *stepperContext="let stepperApi">
 *     <button (click)="stepperApi.goToNextStep()">Next</button>
 *   </ng-container>
 * </div>
 * ```
 */
@Directive({
  selector: "[stepperContext]",
  standalone: false,
})
export class StepperContextDirective extends ApiContextDirective<StepperApi> {
  constructor() {
    const contextService = inject(StepperContextService)
    super(contextService, "stepperContext")
  }

  /**
   * Provides intellisense for the context in the template.
   */
  static ngTemplateContextGuard(
    dir: StepperContextDirective,
    ctx: unknown,
  ): ctx is {$implicit: StepperApi} {
    return true
  }
}
