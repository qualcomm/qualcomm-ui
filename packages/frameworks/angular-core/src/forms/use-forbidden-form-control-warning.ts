// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {afterNextRender, inject} from "@angular/core"
import {NgControl} from "@angular/forms"

type WarningOptions =
  | {
      /**
       * The name of the directive that emits the warning.
       */
      directive: string
      /**
       * The directive to bind to instead of {@link directive}.
       */
      rootDirective?: string
    }
  | {
      onError: () => void
    }

export const consoleBoldStyle = "font-weight: bold; white-space: nowrap;"

export function useForbiddenFormControlWarning(
  options: WarningOptions = {directive: "", rootDirective: ""},
) {
  const ngControl: NgControl | null = inject(NgControl, {
    optional: true,
    self: true,
  })

  return afterNextRender({
    read: () => {
      if (ngControl) {
        if ("onError" in options) {
          options.onError()
        } else {
          console.error(
            `An Angular form control binding was detected on a %c${options.directive}%c directive. This will not work as intended. Bind your form control to the ${options.rootDirective ? `parent %c${options.rootDirective}%c directive` : "root directive"} instead.`,
            consoleBoldStyle,
            "",
            consoleBoldStyle,
            "",
          )
        }
      }
    },
  })
}
