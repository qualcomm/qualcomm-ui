// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Component, computed, input, type OnInit} from "@angular/core"
import {ChevronDown} from "lucide-angular"

import {useInlineIconButtonApi} from "@qualcomm-ui/angular/inline-icon-button"
import type {LucideIconOrString} from "@qualcomm-ui/angular-core/lucide"
import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"
import {useSelectContext} from "@qualcomm-ui/angular-core/select"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsSelectContext} from "./qds-select-context.service"

@Component({
  selector: "[q-select-indicator]",
  standalone: false,
  template: `
    <svg [q-bind]="inlineIconButtonApi().getIconBindings()" [qIcon]="icon()" />
  `,
})
export class SelectIndicatorDirective implements OnInit {
  /**
   * Indicator icon.
   *
   * @default ChevronDown
   */
  readonly icon = input<LucideIconOrString>(ChevronDown)

  protected readonly qdsSelectContext = useQdsSelectContext()
  protected readonly selectContext = useSelectContext()
  protected readonly inlineIconButtonApi = useInlineIconButtonApi({
    emphasis: "neutral",
    size: computed(() => (this.qdsSelectContext().size === "sm" ? "sm" : "md")),
    variant: "scale",
  })

  protected readonly trackBindings = useTrackBindings(() =>
    mergeProps(
      this.selectContext().getIndicatorBindings(),
      this.qdsSelectContext().getIndicatorBindings(),
      this.inlineIconButtonApi().getRootBindings(),
    ),
  )

  ngOnInit() {
    this.trackBindings()
  }
}
