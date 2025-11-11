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
  createSegmentedControlApi,
  type SegmentedControlApiProps,
  segmentedControlMachine,
  type SegmentedControlOrientation,
} from "@qualcomm-ui/core/segmented-control"
import type {Booleanish} from "@qualcomm-ui/utils/coercion"
import type {Direction} from "@qualcomm-ui/utils/direction"
import type {Explicit} from "@qualcomm-ui/utils/guard"

import {SegmentedControlContextService} from "./segmented-control-context.service"

@Directive()
export class CoreSegmentedControlRootDirective
  implements SignalifyInput<Omit<SegmentedControlApiProps, "form">>, OnInit
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
   * Function called once the value of the segmented control group changes.
   */
  readonly valueChanged = output<string[] | null | undefined>()

  /**
   * Whether the group is disabled. When true, prevents user interaction and applies
   * visual styling to indicate the disabled state..
   */
  readonly disabled = input<boolean | undefined, Booleanish>(undefined, {
    transform: booleanAttribute,
  })

  /**
   * Whether the control allows multiple selections or not.
   */
  readonly multiple = input<boolean | undefined, Booleanish>(undefined, {
    transform: booleanAttribute,
  })

  /**
   * Orientation of the segmented control group
   *
   * @default 'horizontal'
   */
  readonly orientation = input<SegmentedControlOrientation>()

  readonly defaultValue = input<string[]>()
  readonly name = input<string | undefined>()
  readonly value = input<string[] | null | undefined>()

  protected readonly segmentedControlContextService = inject(
    SegmentedControlContextService,
  )
  protected readonly hostId = computed(() => useId(this, this.id()))
  protected readonly injector = inject(Injector)
  protected readonly isMounted = useIsMounted()
  protected readonly onDestroy = useOnDestroy()

  protected readonly trackBindings = useTrackBindings(() =>
    this.segmentedControlContextService.context().getGroupBindings({
      id: this.hostId(),
      onDestroy: this.onDestroy,
    }),
  )

  ngOnInit() {
    const machine = useMachine(
      segmentedControlMachine,
      computed<Explicit<SegmentedControlApiProps>>(() => ({
        defaultValue: this.defaultValue(),
        dir: this.dir(),
        disabled: this.disabled(),
        form: "",
        id: this.hostId(),
        multiple: this.multiple(),
        name: this.name(),
        onValueChange: (event) => {
          if (this.isMounted()) {
            this.valueChanged.emit(event)
          }
        },
        orientation: this.orientation(),
        value: this.value(),
      })),
      this.injector,
    )

    this.segmentedControlContextService.init(
      computed(() => createSegmentedControlApi(machine, normalizeProps)),
    )

    this.trackBindings()
  }
}
