// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {computed, Directive, input, type OnInit} from "@angular/core"

import {useId, useOnDestroy} from "@qualcomm-ui/angular-core/common"
import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"

import {useCheckboxContext} from "./checkbox-context.service"

@Directive()
export class CoreCheckboxHiddenInputDirective implements OnInit {
  /**
   * {@link https://www.w3schools.com/html/html_id.asp id attribute}. If
   * omitted, a unique identifier will be generated for accessibility.
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
   * ID reference for an external label applied to the hidden input.
   *
   * @since 2.4.0
   */
  readonly ariaLabelledby = input<string | undefined>(undefined, {
    alias: "aria-labelledby",
  })

  protected readonly checkboxContext = useCheckboxContext()

  protected readonly trackBindings = useTrackBindings(() => {
    const bindings = this.checkboxContext().getHiddenInputBindings({
      id: this.hostId(),
      onDestroy: this.onDestroy,
    })
    const ariaLabel = this.ariaLabel() ?? undefined
    const ariaLabelledby = this.ariaLabelledby() ?? undefined

    return {
      ...bindings,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledby ?? bindings["aria-labelledby"],
    }
  })

  private readonly hostId = computed(() => useId(this, this.id()))

  private readonly onDestroy = useOnDestroy()

  ngOnInit() {
    this.trackBindings()
  }
}
