// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {DOCUMENT} from "@angular/common"
import {
  computed,
  Directive,
  inject,
  Injector,
  input,
  type OnInit,
} from "@angular/core"

import {useId, useOnDestroy} from "@qualcomm-ui/angular-core/common"
import {
  normalizeProps,
  useMachine,
  useTrackBindings,
} from "@qualcomm-ui/angular-core/machine"
import type {SignalifyInput} from "@qualcomm-ui/angular-core/signals"
import {
  createToastGroupApi,
  toastGroupMachine,
  type ToastGroupProps,
  type ToastGroupSchema,
  type ToastStore,
} from "@qualcomm-ui/core/toast"
import type {Direction} from "@qualcomm-ui/utils/direction"
import type {Explicit} from "@qualcomm-ui/utils/guard"
import type {Machine} from "@qualcomm-ui/utils/machine"

import {ToastGroupContextService} from "./toast-group-context.service"

@Directive()
export class CoreToasterDirective
  implements SignalifyInput<Omit<ToastGroupProps, "store" | "id">>, OnInit
{
  /**
   * The document's text/writing direction
   *
   * @default 'ltr'
   */
  readonly dir = input<Direction | undefined>(undefined)

  /**
   * A root node to correctly resolve the Document in custom environments. i.e.,
   * Iframes, Electron.
   */
  readonly getRootNode = input<
    (() => ShadowRoot | Document | Node) | undefined
  >()

  /**
   * Unique identifier for the toaster
   */
  readonly id = input<string>()

  /**
   * The toast store instance
   */
  readonly toaster = input.required<ToastStore>()

  protected readonly toastGroupService = inject(ToastGroupContextService)

  protected readonly trackBindings = useTrackBindings(() => {
    return this.toastGroupService.context().getGroupBindings()
  })

  protected readonly document = inject(DOCUMENT)
  protected readonly injector = inject(Injector)
  protected readonly onDestroy = useOnDestroy()
  private readonly hostId = computed(() => useId(this, this.id()))

  protected machine: Machine<ToastGroupSchema>

  ngOnInit() {
    this.machine = useMachine(
      toastGroupMachine,
      computed<Explicit<ToastGroupProps>>(() => ({
        dir: this.dir(),
        getRootNode: this.getRootNode() || (() => this.document),
        id: this.hostId(),
        store: this.toaster(),
      })),
      this.injector,
    )

    this.toastGroupService.init(
      computed(() => createToastGroupApi(this.machine, normalizeProps)),
    )

    this.trackBindings()
  }
}
