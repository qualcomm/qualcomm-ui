// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Directive} from "@angular/core"

import type {ToastApi} from "@qualcomm-ui/core/toast"

@Directive({
  selector: "[q-toast-context]",
  standalone: false,
})
export class ToastContextDirective {
  /**
   * Type guard for the context, provides intellisense for the context in the
   * template.
   */
  static ngTemplateContextGuard(
    dir: ToastContextDirective,
    ctx: unknown,
  ): ctx is {$implicit: ToastApi<string>} {
    return true
  }
}
