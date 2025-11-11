// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  computed,
  Directive,
  inject,
  Injector,
  input,
  type OnInit,
  output,
} from "@angular/core"

import {
  useId,
  useIsMounted,
  useOnDestroy,
} from "@qualcomm-ui/angular-core/common"
import {
  normalizeProps,
  useMachine,
  useTrackBindings,
} from "@qualcomm-ui/angular-core/machine"
import type {SignalifyInput} from "@qualcomm-ui/angular-core/signals"
import {
  type AvatarApiProps,
  avatarMachine,
  createAvatarApi,
} from "@qualcomm-ui/core/avatar"
import type {Direction} from "@qualcomm-ui/utils/direction"
import type {Explicit} from "@qualcomm-ui/utils/guard"

import {AvatarContextService} from "./avatar-context.service"

@Directive()
export class CoreAvatarRootDirective
  implements SignalifyInput<AvatarApiProps>, OnInit
{
  /**
   * HTML {@link https://www.w3schools.com/html/html_id.asp id attribute}. If
   * omitted, a unique identifier will be generated for accessibility.)
   */
  readonly id = input<string>()

  /**
   * The document's text/writing direction.
   */
  readonly dir = input<Direction | undefined>()

  /**
   * Function called when the avatar state is changed.
   */
  readonly stateChanged = output<{state: string | null}>()

  protected readonly avatarContext = inject(AvatarContextService)
  protected readonly hostId = computed(() => useId(this, this.id()))
  protected readonly injector = inject(Injector)
  protected readonly isMounted = useIsMounted()
  protected readonly onDestroy = useOnDestroy()

  protected readonly trackBindings = useTrackBindings(() =>
    this.avatarContext.context().getRootBindings({
      id: this.hostId(),
      onDestroy: this.onDestroy,
    }),
  )

  ngOnInit() {
    const machine = useMachine(
      avatarMachine,
      computed<Explicit<AvatarApiProps>>(() => ({
        dir: this.dir(),
        id: this.hostId(),
        onStateChange: (event) => {
          if (this.isMounted()) {
            this.stateChanged.emit(event)
          }
        },
      })),
      this.injector,
    )

    this.avatarContext.init(
      computed(() => createAvatarApi(machine, normalizeProps)),
    )

    this.trackBindings()
  }
}
