// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {computed, Directive, input, type OnInit} from "@angular/core"

import {useId, useOnDestroy} from "@qualcomm-ui/angular-core/common"
import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"
import type {SignalifyInput} from "@qualcomm-ui/angular-core/signals"

import {useRadioContext} from "./radio-context.service"
import {useRadioItemContext} from "./radio-item-context.service"

@Directive()
export class CoreRadioItemHiddenInputDirective
  implements OnInit, SignalifyInput<{id?: string}>
{
  /**
   * {@link https://www.w3schools.com/html/html_id.asp id attribute}. If
   * omitted, a unique identifier will be generated for accessibility.)
   */
  readonly id = input<string>()

  /**
   * ARIA label applied to the hidden input.
   *
   * @since 2.4.0
   */
  readonly ariaLabel = input<string | undefined>(undefined, {
    alias: "aria-label",
  })

  /**
   * ID reference for an external item label applied to the hidden input.
   *
   * @since 2.4.0
   */
  readonly ariaLabelledby = input<string | undefined>(undefined, {
    alias: "aria-labelledby",
  })

  protected readonly radioContext = useRadioContext()
  protected readonly radioItemContext = useRadioItemContext()

  protected readonly trackBindings = useTrackBindings(() => {
    const bindings = this.radioContext().getRadioHiddenInputBindings({
      ...this.radioItemContext(),
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

  protected readonly onDestroy = useOnDestroy()
  private readonly hostId = computed(() => useId(this, this.id()))

  ngOnInit() {
    this.trackBindings()
  }
}
