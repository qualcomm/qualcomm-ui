// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Component, computed} from "@angular/core"
import {ChevronDown} from "lucide-angular"

import {useInlineIconButtonApi} from "@qualcomm-ui/angular/inline-icon-button"
import {CoreComboboxTriggerDirective} from "@qualcomm-ui/angular-core/combobox"
import {provideIcons} from "@qualcomm-ui/angular-core/lucide"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsComboboxContext} from "./qds-combobox-context.service"

@Component({
  providers: [provideIcons({ChevronDown})],
  selector: "[q-combobox-trigger]",
  standalone: false,
  template: `
    <ng-content>
      <svg
        qIcon="ChevronDown"
        [q-bind]="inlineIconButtonApi().getIconBindings()"
      ></svg>
    </ng-content>
  `,
})
export class ComboboxTriggerDirective extends CoreComboboxTriggerDirective {
  protected readonly qdsComboboxContext = useQdsComboboxContext()
  protected readonly inlineIconButtonApi = useInlineIconButtonApi({
    emphasis: "neutral",
    size: computed(() =>
      this.qdsComboboxContext().size === "sm" ? "sm" : "md",
    ),
    variant: "scale",
  })

  constructor() {
    super()
    this.trackBindings.extendWith(
      computed(() =>
        mergeProps(
          this.qdsComboboxContext().getIndicatorBindings(),
          this.inlineIconButtonApi().getRootBindings(),
        ),
      ),
    )
  }
}
