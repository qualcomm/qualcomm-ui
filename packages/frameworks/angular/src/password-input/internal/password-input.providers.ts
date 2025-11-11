// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {inject, type Provider} from "@angular/core"

import {provideQdsInputContext} from "@qualcomm-ui/angular/input"
import {
  AbstractInputFormControlDirective,
  INPUT_FORM_CONTROL_CONTEXT,
} from "@qualcomm-ui/angular-core/input"
import {providePasswordInputContext} from "@qualcomm-ui/angular-core/password-input"

export function providePasswordInput(): Provider[] {
  return [
    provideQdsInputContext(),
    providePasswordInputContext(),
    {
      provide: INPUT_FORM_CONTROL_CONTEXT,
      useFactory: () => {
        const abstractFormControl = inject(AbstractInputFormControlDirective, {
          self: true,
        })
        return abstractFormControl.formControlContext
      },
    },
  ]
}
