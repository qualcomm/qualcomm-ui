// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {computed, Directive, input, type OnInit} from "@angular/core"

import {useId, useOnDestroy} from "@qualcomm-ui/angular-core/common"
import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"

import {useNumberInputContext} from "./number-input-context.service"

@Directive()
export class CoreNumberInputInputDirective implements OnInit {
  readonly id = input<string>()

  /**
   * ARIA label applied to the input.
   *
   * @since 2.4.0
   */
  readonly ariaLabel = input<string | undefined>(undefined, {
    alias: "aria-label",
  })

  /**
   * ID reference for an external label applied to the input.
   *
   * @since 2.4.0
   */
  readonly ariaLabelledby = input<string | undefined>(undefined, {
    alias: "aria-labelledby",
  })

  protected readonly numberInputContext = useNumberInputContext()

  protected readonly trackBindings = useTrackBindings(() => {
    const bindings = this.numberInputContext().getInputBindings({
      id: this.hostId(),
      onDestroy: this.onDestroy,
    })
    const ariaLabel = this.ariaLabel() ?? undefined
    const ariaLabelledby = this.ariaLabelledby() ?? bindings["aria-labelledby"]

    return {
      ...bindings,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledby,
    }
  })

  private readonly hostId = computed(() => useId(this, this.id()))

  private readonly onDestroy = useOnDestroy()

  ngOnInit() {
    this.trackBindings()
  }
}
