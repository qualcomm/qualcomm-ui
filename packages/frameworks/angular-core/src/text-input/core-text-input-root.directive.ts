// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {DOCUMENT} from "@angular/common"
import {
  computed,
  Directive,
  inject,
  input,
  type OnInit,
  output,
} from "@angular/core"

import {useIsMounted} from "@qualcomm-ui/angular-core/common"
import {AbstractInputFormControlDirective} from "@qualcomm-ui/angular-core/input"
import {
  normalizeProps,
  useMachine,
  useTrackBindings,
} from "@qualcomm-ui/angular-core/machine"
import type {SignalifyInput} from "@qualcomm-ui/angular-core/signals"
import {
  createTextInputApi,
  type TextInputApiProps,
  textInputMachine,
} from "@qualcomm-ui/core/text-input"
import type {Direction} from "@qualcomm-ui/utils/direction"
import type {Explicit} from "@qualcomm-ui/utils/guard"

import {TextInputContextService} from "./text-input-context.service"

@Directive()
export class CoreTextInputRootDirective
  extends AbstractInputFormControlDirective
  implements
    OnInit,
    SignalifyInput<Omit<TextInputApiProps, "form" | "ids" | "value">>
{
  /**
   * The document's text/writing direction.
   *
   * @default "ltr"
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
   * Event emitted when the input value changes. This is only emitted on
   * interaction. It doesn't emit in response to programmatic form control changes.
   */
  readonly valueChanged = output<string>()

  protected readonly textInputService = inject(TextInputContextService)
  protected document = inject(DOCUMENT)

  protected readonly trackBindings = useTrackBindings(() =>
    this.textInputService.context().getRootBindings(),
  )

  protected readonly isMounted = useIsMounted()

  override ngOnInit() {
    super.ngOnInit()

    const machine = useMachine(
      textInputMachine,
      computed<Explicit<TextInputApiProps>>(() => ({
        defaultValue: this.defaultValue(),
        dir: this.dir(),
        disabled: this.isDisabled(),
        // angular handles this automatically with ngModel and Reactive Forms
        form: undefined,
        getRootNode: this.getRootNode(),
        ids: undefined,
        invalid: this.isInvalid(),
        name: this.name(),
        onFocusChange: (focused) => {
          if (!focused) {
            // only trigger onTouched on blur.
            this.onTouched()
          }
        },
        onValueChange: (value) => {
          if (!this.control) {
            if (this.isMounted()) {
              this.valueChanged.emit(value)
            }
            this.value.set(value)
            return
          }
          // ngModel is bound to the root, but change events happen on the <input>
          // element and are forwarded to the machine.  So we need to fire the value
          // change event to keep the form in sync.
          this.onChange(value)
          if (!this.control?.touched) {
            this.control.markAsTouched?.()
          }
          if (!this.control?.dirty) {
            this.control.markAsDirty?.()
          }
        },
        readOnly: this.readOnly(),
        required: this.isRequired(),
        value: this.value(),
      })),
      this.injector,
    )

    this.textInputService.init(
      computed(() => createTextInputApi(machine, normalizeProps)),
    )

    this.trackBindings()
  }
}
