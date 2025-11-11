// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  booleanAttribute,
  computed,
  Directive,
  inject,
  Injector,
  input,
  type OnInit,
  output,
} from "@angular/core"

import {useId, useIsMounted} from "@qualcomm-ui/angular-core/common"
import {
  normalizeProps,
  useMachine,
  useTrackBindings,
} from "@qualcomm-ui/angular-core/machine"
import type {SignalifyInput} from "@qualcomm-ui/angular-core/signals"
import {
  createTooltipApi,
  type TooltipApiProps,
  tooltipMachine,
  type TooltipPositioningOptions,
} from "@qualcomm-ui/core/tooltip"
import type {Booleanish} from "@qualcomm-ui/utils/coercion"
import type {Direction} from "@qualcomm-ui/utils/direction"
import type {Explicit} from "@qualcomm-ui/utils/guard"

import {TooltipContextService} from "./tooltip-context.service"

@Directive()
export class CoreTooltipRootDirective
  implements SignalifyInput<TooltipApiProps>, OnInit
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
   * Whether the tooltip should close when the trigger is clicked.
   */
  readonly closeOnClick = input<boolean | undefined, Booleanish>(undefined, {
    transform: booleanAttribute,
  })

  /**
   * Whether to close the tooltip when the escape key is pressed.
   */
  readonly closeOnEscape = input<boolean | undefined, Booleanish>(undefined, {
    transform: booleanAttribute,
  })

  /**
   * The disabled state of the tooltip
   */
  readonly disabled = input<boolean | undefined, Booleanish>(undefined, {
    transform: booleanAttribute,
  })

  /**
   * The open state of the tooltip.
   */
  readonly open = input<boolean | undefined, Booleanish>(undefined, {
    transform: booleanAttribute,
  })

  /**
   * The user provided options used to position the popover content
   *
   * @inheritDoc
   */
  readonly positioning = input<TooltipPositioningOptions>()

  /**
   * Function called when the tooltip is opened/closed.
   */
  readonly openChanged = output<boolean>()

  protected readonly tooltipContext = inject(TooltipContextService)

  readonly hostId = computed(() => useId(this, this.id()))

  private readonly isMounted = useIsMounted()

  private readonly injector = inject(Injector)

  private readonly trackBindings = useTrackBindings(() =>
    this.tooltipContext.context().getRootBindings(),
  )

  ngOnInit() {
    const machine = useMachine(
      tooltipMachine,
      computed<Explicit<TooltipApiProps>>(() => ({
        closeOnClick: this.closeOnClick(),
        closeOnEscape: this.closeOnEscape(),
        dir: this.dir(),
        disabled: this.disabled(),
        id: this.hostId(),
        onOpenChange: (open) => {
          if (this.isMounted()) {
            this.openChanged.emit(open)
          }
        },
        open: this.open(),
        positioning: this.positioning(),
      })),
      this.injector,
    )

    this.tooltipContext.init(
      computed(() => createTooltipApi(machine, normalizeProps)),
    )

    this.trackBindings()
  }
}
