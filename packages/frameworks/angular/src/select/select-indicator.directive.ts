// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Component, computed, input} from "@angular/core"
import {ChevronDown} from "lucide-angular"

import type {LucideIconOrString} from "@qualcomm-ui/angular-core/lucide"
import {useSelectContext} from "@qualcomm-ui/angular-core/select"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsSelectContext} from "./qds-select-context.service"

@Component({
  selector: "[q-select-indicator]",
  standalone: false,
  template: `
    <svg [q-bind]="indicatorBindings()" [qIcon]="icon()" />
  `,
})
export class SelectIndicatorDirective {
  /**
   * Indicator icon.
   *
   * @default ChevronDown
   */
  readonly icon = input<LucideIconOrString>(ChevronDown)

  protected readonly qdsSelectContext = useQdsSelectContext()
  protected readonly selectContext = useSelectContext()

  readonly indicatorBindings = computed(() =>
    mergeProps(
      this.selectContext().getIndicatorBindings(),
      this.qdsSelectContext().getIndicatorBindings(),
    ),
  )
}
