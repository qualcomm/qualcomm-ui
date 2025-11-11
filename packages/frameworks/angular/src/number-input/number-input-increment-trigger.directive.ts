// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Component, computed} from "@angular/core"
import {Plus} from "lucide-angular"

import {useInlineIconButtonApi} from "@qualcomm-ui/angular/inline-icon-button"
import {provideIcons} from "@qualcomm-ui/angular-core/lucide"
import {CoreNumberInputIncrementTriggerDirective} from "@qualcomm-ui/angular-core/number-input"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsNumberInputContext} from "./qds-number-input-context.service"

@Component({
  providers: [provideIcons({Plus})],
  selector: "[q-number-input-increment-trigger]",
  standalone: false,
  template: `
    <ng-content>
      <svg
        qIcon="Plus"
        [q-bind]="inlineIconButtonApi().getIconBindings()"
      ></svg>
    </ng-content>
  `,
})
export class NumberInputIncrementTriggerDirective extends CoreNumberInputIncrementTriggerDirective {
  protected readonly qdsNumberInputContext = useQdsNumberInputContext()
  protected readonly inlineIconButtonApi = useInlineIconButtonApi({
    emphasis: "neutral",
    size: computed(() => this.qdsNumberInputContext().size),
    variant: "fixed",
  })

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() =>
        mergeProps(
          this.inlineIconButtonApi().getRootBindings(),
          this.qdsNumberInputContext().getIncrementTriggerBindings(),
        ),
      ),
    )
  }
}
