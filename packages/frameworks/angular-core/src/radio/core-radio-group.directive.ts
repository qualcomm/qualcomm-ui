// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {DOCUMENT} from "@angular/common"
import {computed, Directive, inject, input, type OnInit} from "@angular/core"

import {useId, useIsDestroyed} from "@qualcomm-ui/angular-core/common"
import {
  normalizeProps,
  useMachine,
  useTrackBindings,
} from "@qualcomm-ui/angular-core/machine"
import type {SignalifyInput} from "@qualcomm-ui/angular-core/signals"
import {
  createRadioApi,
  type RadioApiProps,
  radioMachine,
  type RadioOrientation,
} from "@qualcomm-ui/core/radio"
import type {Direction} from "@qualcomm-ui/utils/direction"
import type {Explicit} from "@qualcomm-ui/utils/guard"

import {AbstractRadioFormControlDirective} from "./abstract-radio-form-control.directive"
import {RadioContextService} from "./radio-context.service"

@Directive({
  host: {
    "(focusout)": "onBlur()",
  },
})
export class CoreRadioGroupDirective
  extends AbstractRadioFormControlDirective
  implements OnInit, SignalifyInput<Omit<RadioApiProps, "form" | "value">>
{
  /**
   * Accessible name of the radio group. Use when the group has no
   * `q-radio-group-label`.
   */
  readonly ariaLabel = input<string | undefined>(undefined, {
    alias: "aria-label",
  })

  /**
   * ID of an external element that labels the radio group. Takes precedence
   * over {@link ariaLabel} and the `q-radio-group-label` element.
   */
  readonly ariaLabelledby = input<string | undefined>(undefined, {
    alias: "aria-labelledby",
  })

  /**
   * The document's text/writing direction.
   *
   * @default "ltr"
   */
  readonly dir = input<Direction | undefined>(undefined)

  /**
   * {@link https://www.w3schools.com/html/html_id.asp id attribute}. If
   * omitted, a unique identifier will be generated for accessibility.)
   */
  readonly id = input<string>()

  /**
   * A root node to correctly resolve the Document in custom environments. i.e.,
   * Iframes, Electron.
   */
  readonly getRootNode = input<
    (() => ShadowRoot | Document | Node) | undefined
  >()

  /**
   * Orientation of the radio group
   *
   * @default 'vertical'
   */
  readonly orientation = input<RadioOrientation>()

  protected readonly radioContextService = inject(RadioContextService)

  protected readonly document = inject(DOCUMENT)

  protected readonly trackBindings = useTrackBindings(() => ({
    ...this.radioContextService.context().getGroupBindings({
      id: this.hostId(),
      onDestroy: this.onDestroy,
    }),
    ...this.labelBindings(),
  }))

  /**
   * An explicit `aria-label` replaces the `aria-labelledby` reference to the
   * `q-radio-group-label` element, which would otherwise take precedence over
   * it.
   */
  private readonly labelBindings = computed(() => {
    const ariaLabel = this.ariaLabel()
    const ariaLabelledby = this.ariaLabelledby()
    if (ariaLabelledby) {
      return {"aria-labelledby": ariaLabelledby}
    }
    if (ariaLabel) {
      return {"aria-label": ariaLabel, "aria-labelledby": undefined}
    }
    return {}
  })

  protected readonly hostId = computed(() => useId(this, this.id()))

  private readonly isDestroyed = useIsDestroyed()

  protected onBlur() {
    if (!this.isDestroyed()) {
      this.onTouched()
    }
  }

  override ngOnInit() {
    super.ngOnInit()

    this.trackBindings()

    const controlName = this.ngControl?.name
      ? `${this.ngControl.name}`
      : undefined

    const machine = useMachine(
      radioMachine,
      computed<Explicit<RadioApiProps>>(() => ({
        defaultValue: this.defaultValue(),
        dir: this.dir(),
        disabled: this.isDisabled(),
        form: "",
        getRootNode: this.getRootNode() ?? (() => this.document),
        invalid: this.invalid(),
        name: this.name() || controlName,
        onValueChange: (value) => {
          this.onChange(value)
          if (!this.control) {
            this.valueChanged.emit(value)
            this.value.set(value)
          }
          if (this.control && !this.control?.touched) {
            this.onTouched()
          }
        },
        orientation: this.orientation(),
        readOnly: this.readOnly(),
        required: this.isRequired(),
        value: this.value(),
      })),
      this.injector,
    )

    this.radioContextService.init(
      computed(() => createRadioApi(machine, normalizeProps)),
    )
  }
}
