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
  output,
} from "@angular/core"

import {useIsMounted} from "@qualcomm-ui/angular-core/common"
import {normalizeProps, useMachine} from "@qualcomm-ui/angular-core/machine"
import type {SignalifyInput} from "@qualcomm-ui/angular-core/signals"
import {
  createTourApi,
  type TourApiProps,
  type TourStatusChangeDetails,
  type TourStepChangeDetails,
  type TourStepsChangeDetails,
  tourMachine,
} from "@qualcomm-ui/core/tour"
import type {
  FocusOutsideEvent,
  InteractOutsideEvent,
  PointerDownOutsideEvent,
} from "@qualcomm-ui/dom/interact-outside"
import type {Explicit} from "@qualcomm-ui/utils/guard"

import {TourContextService} from "./tour-context.service"

@Directive()
export class CoreTourRootDirective
  implements SignalifyInput<Omit<TourApiProps, "ids">>, OnInit
{
  readonly closeOnEscape = input<TourApiProps["closeOnEscape"]>()
  readonly closeOnInteractOutside =
    input<TourApiProps["closeOnInteractOutside"]>()
  readonly dir = input<TourApiProps["dir"]>()
  readonly getRootNode = input<TourApiProps["getRootNode"]>()
  readonly keyboardNavigation = input<TourApiProps["keyboardNavigation"]>()
  readonly preventInteraction = input<TourApiProps["preventInteraction"]>()
  readonly spotlightOffset = input<TourApiProps["spotlightOffset"]>()
  readonly spotlightRadius = input<TourApiProps["spotlightRadius"]>()
  readonly stepId = input<TourApiProps["stepId"]>()
  readonly steps = input<TourApiProps["steps"]>()
  readonly translations = input<TourApiProps["translations"]>()

  readonly focusOutside = output<FocusOutsideEvent>()
  readonly interactOutside = output<InteractOutsideEvent>()
  readonly pointerDownOutside = output<PointerDownOutsideEvent>()
  readonly statusChanged = output<TourStatusChangeDetails>()
  readonly stepChanged = output<TourStepChangeDetails>()
  readonly stepsChanged = output<TourStepsChangeDetails>()

  protected readonly document = inject(DOCUMENT)
  protected readonly injector = inject(Injector)
  protected readonly isMounted = useIsMounted()
  protected readonly tourContext = inject(TourContextService)

  ngOnInit() {
    const machine = useMachine(
      tourMachine,
      computed<Explicit<TourApiProps>>(() => ({
        closeOnEscape: this.closeOnEscape(),
        closeOnInteractOutside: this.closeOnInteractOutside(),
        dir: this.dir(),
        getRootNode: this.getRootNode() || (() => this.document),
        ids: undefined,
        keyboardNavigation: this.keyboardNavigation(),
        onFocusOutside: (event) => {
          if (this.isMounted()) {
            this.focusOutside.emit(event)
          }
        },
        onInteractOutside: (event) => {
          if (this.isMounted()) {
            this.interactOutside.emit(event)
          }
        },
        onPointerDownOutside: (event) => {
          if (this.isMounted()) {
            this.pointerDownOutside.emit(event)
          }
        },
        onStatusChange: (details) => {
          if (this.isMounted()) {
            this.statusChanged.emit(details)
          }
        },
        onStepChange: (details) => {
          if (this.isMounted()) {
            this.stepChanged.emit(details)
          }
        },
        onStepsChange: (details) => {
          if (this.isMounted()) {
            this.stepsChanged.emit(details)
          }
        },
        preventInteraction: this.preventInteraction(),
        spotlightOffset: this.spotlightOffset(),
        spotlightRadius: this.spotlightRadius(),
        stepId: this.stepId(),
        steps: this.steps(),
        translations: this.translations(),
      })),
      this.injector,
    )

    this.tourContext.init(
      computed(() => createTourApi(machine, normalizeProps)),
    )
  }
}
