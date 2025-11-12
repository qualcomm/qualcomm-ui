// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  computed,
  Directive,
  inject,
  input,
  type OnInit,
  output,
} from "@angular/core"
import {type ControlValueAccessor} from "@angular/forms"

import {useId, useIsMounted} from "@qualcomm-ui/angular-core/common"
import {AbstractBaseListCollectionFormControlDirective} from "@qualcomm-ui/angular-core/input"
import {
  normalizeProps,
  useMachine,
  useTrackBindings,
} from "@qualcomm-ui/angular-core/machine"
import type {SignalifyInput} from "@qualcomm-ui/angular-core/signals"
import {
  createSliderApi,
  type FocusChangeDetails,
  type SliderApiProps,
  sliderMachine,
  type ValueChangeDetails,
  type ValueTextDetails,
} from "@qualcomm-ui/core/slider"
import type {Direction} from "@qualcomm-ui/utils/direction"
import type {Explicit} from "@qualcomm-ui/utils/guard"

import {SliderContextService} from "./slider-context.service"

@Directive()
export class CoreSliderRootDirective
  extends AbstractBaseListCollectionFormControlDirective<number>
  implements
    SignalifyInput<
      Omit<
        SliderApiProps,
        "form" | "ids" | "value" | "aria-label" | "aria-labelledby"
      >
    >,
    ControlValueAccessor,
    OnInit
{
  /**
   * The document's text/writing direction.
   */
  readonly dir = input<Direction | undefined>()
  /**
   * HTML {@link https://www.w3schools.com/html/html_id.asp id attribute}. If
   * omitted, a unique identifier will be generated for accessibility.)
   */
  readonly id = input<string>()
  /**
   * The aria-label of each slider thumb. Useful for providing an accessible name to
   * the slider
   */
  readonly ariaLabel = input<string[] | string | undefined>(undefined, {
    alias: "aria-label",
  })
  /**
   * The `id` of the elements that labels each slider thumb. Useful for providing an
   * accessible name to the slider
   */
  readonly ariaLabelledby = input<string[] | string | undefined>(undefined, {
    alias: "aria-labelledby",
  })
  /**
   * Function that returns a human readable value for the slider thumb
   */
  readonly getAriaValueText = input<(details: ValueTextDetails) => string>()
  /**
   * The maximum value of the slider
   * @default 100
   */
  readonly max = input<number | undefined>()
  /**
   * The minimum value of the slider
   * @default 0
   */
  readonly min = input<number | undefined>()
  /**
   * The minimum permitted steps between multiple thumbs.
   *
   * `minStepsBetweenThumbs` * `step` should reflect the gap between the thumbs.
   *
   * - `step: 1` and `minStepsBetweenThumbs: 10` => gap is `10`
   * - `step: 10` and `minStepsBetweenThumbs: 2` => gap is `20`
   *
   * @default 0
   */
  readonly minStepsBetweenThumbs = input<number | undefined>()
  /**
   * The orientation of the slider
   * @default "horizontal"
   */
  readonly orientation = input<"vertical" | "horizontal" | undefined>()
  /**
   * The origin of the slider range. The track is filled from the origin
   * to the thumb for single values.
   * - "start": Useful when the value represents an absolute value
   * - "center": Useful when the value represents an offset (relative)
   * - "end": Useful when the value represents an offset from the end
   *
   * @default "start"
   */
  readonly origin = input<"start" | "center" | "end" | undefined>()
  /**
   * The step value of the slider
   * @default 1
   */
  readonly step = input<number | undefined>()
  /**
   * The alignment of the slider thumb relative to the track
   * - `center`: the thumb will extend beyond the bounds of the slider track.
   * - `contain`: the thumb will be contained within the bounds of the track.
   *
   * @default "contain"
   */
  readonly thumbAlignment = input<"contain" | "center" | undefined>()
  /**
   * The slider thumbs dimensions
   */
  readonly thumbSize = input<{height: number; width: number} | undefined>()
  /**
   * Value change callback.
   */
  readonly valueChanged = output<ValueChangeDetails>()
  /**
   * Function invoked when the slider value change is done
   */
  readonly valueChangedEnd = output<ValueChangeDetails>()
  /**
   * Function invoked when the slider focus changes
   */
  readonly focusChanged = output<FocusChangeDetails>()

  protected readonly sliderContextService = inject(SliderContextService)

  protected readonly isMounted = useIsMounted()

  protected readonly hostId = computed(() => useId(this, this.id()))

  protected readonly trackBindings = useTrackBindings(() =>
    this.sliderContextService.context().getRootBindings({id: this.hostId()}),
  )

  override ngOnInit() {
    super.ngOnInit()

    const machine = useMachine(
      sliderMachine,
      computed<Explicit<SliderApiProps>>(() => ({
        "aria-label": this.ariaLabel(),
        "aria-labelledby": this.ariaLabelledby(),
        defaultValue: this.defaultValue(),
        dir: this.dir(),
        disabled: this.isDisabled(),
        // angular handles this automatically with ngModel and Reactive Forms
        form: undefined,
        getAriaValueText: this.getAriaValueText(),
        ids: undefined,
        invalid: this.isInvalid(),
        max: this.max(),
        min: this.min(),
        minStepsBetweenThumbs: this.minStepsBetweenThumbs(),
        name: this.name(),
        onFocusChange: (details) => {
          if (this.isMounted()) {
            this.focusChanged.emit(details)
          }
          if (details.focusedIndex === -1) {
            // only trigger onTouched on blur.
            this.onTouched()
          }
        },
        onValueChange: (details) => {
          if (!this.control) {
            if (this.isMounted()) {
              this.valueChanged.emit(details)
            }
            this.value.set(details.value)
            return
          }
          // ngModel is bound to the root, but change events happen from internal
          // elements and are passed to the machine.  So we need to fire the
          // form's value change event to keep it in sync.
          this.onChange(details.value)
          // angular handles touched/dirty internally when ngModel is bound to an
          // <input> element, but we don't have that luxury here. We fire these
          // manually.
          if (!this.control?.touched) {
            this.control.markAsTouched?.()
          }
          if (!this.control?.dirty) {
            this.control.markAsDirty?.()
          }
        },
        onValueChangeEnd: (details) => {
          if (this.isMounted()) {
            this.valueChangedEnd.emit(details)
          }
        },
        orientation: this.orientation(),
        origin: this.origin(),
        readOnly: this.readOnly(),
        required: this.isRequired(),
        step: this.step(),
        thumbAlignment: this.thumbAlignment(),
        thumbSize: this.thumbSize(),
        value: this.value(),
      })),
      this.injector,
    )

    this.sliderContextService.init(
      computed(() => createSliderApi(machine, normalizeProps)),
    )

    this.trackBindings()
  }
}
