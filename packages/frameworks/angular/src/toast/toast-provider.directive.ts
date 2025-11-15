// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  computed,
  Directive,
  inject,
  Injector,
  input,
  type OnInit,
} from "@angular/core"

import {normalizeProps, useMachine} from "@qualcomm-ui/angular-core/machine"
import {
  provideToastContext,
  ToastContextService,
} from "@qualcomm-ui/angular-core/toast"
import {
  createToastApi,
  type ToastApiProps,
  type ToastGroupSchema,
  toastMachine,
} from "@qualcomm-ui/core/toast"
import type {Machine} from "@qualcomm-ui/utils/machine"

@Directive({
  exportAs: "toastProvider",
  providers: [provideToastContext()],
  selector: "[toastProvider]",
  standalone: false,
})
export class ToastProviderDirective implements OnInit {
  readonly index = input.required<number>()
  readonly parent = input.required<Machine<ToastGroupSchema>>()
  readonly value = input.required<ToastApiProps>()
  readonly injector = inject(Injector, {self: true})

  protected toastApi = inject(ToastContextService)

  ngOnInit() {
    const machine = useMachine(
      toastMachine,
      computed<ToastApiProps>(() => ({
        ...this.value(),
        index: this.index(),
        parent: this.parent(),
      })),
      this.injector,
    )

    this.toastApi.init(computed(() => createToastApi(machine, normalizeProps)))
  }
}
