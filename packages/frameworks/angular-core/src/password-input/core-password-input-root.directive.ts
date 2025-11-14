// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {DOCUMENT} from "@angular/common"
import {
  booleanAttribute,
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
  createPasswordInputApi,
  type PasswordInputApiProps,
  type PasswordInputIntlTranslations,
  passwordInputMachine,
} from "@qualcomm-ui/core/password-input"
import type {Booleanish} from "@qualcomm-ui/utils/coercion"
import type {Direction} from "@qualcomm-ui/utils/direction"
import type {Explicit} from "@qualcomm-ui/utils/guard"

import {PasswordInputContextService} from "./password-input-context.service"

@Directive()
export class CorePasswordInputRootDirective
  extends AbstractInputFormControlDirective
  implements
    Omit<SignalifyInput<PasswordInputApiProps>, "form" | "ids" | "value">,
    OnInit
{
  /**
   * The {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/autocomplete autocomplete}
   * attribute for the password input.
   *
   * @default "current-password"
   */
  readonly autoComplete = input<
    "current-password" | "new-password" | undefined
  >()

  /**
   * The default visibility of the password input.
   */
  readonly defaultVisible = input<boolean | undefined, Booleanish>(undefined, {
    transform: booleanAttribute,
  })

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
   * Localized messages to use for element labels.
   */
  readonly translations = input<PasswordInputIntlTranslations | undefined>()

  /**
   * Whether the password input is visible.
   */
  readonly visible = input<boolean | undefined, Booleanish>(undefined, {
    transform: booleanAttribute,
  })

  /**
   * Event emitted when the input value changes. This is only emitted on
   * interaction. It doesn't emit in response to programmatic form control changes.
   */
  readonly valueChanged = output<string>()

  /**
   * Function called when the visibility changes.
   */
  readonly visibleChanged = output<boolean>()

  protected readonly document = inject(DOCUMENT)

  protected readonly isMounted = useIsMounted()

  protected readonly passwordInputService = inject(PasswordInputContextService)

  protected readonly trackBindings = useTrackBindings(() => {
    return this.passwordInputService.context().getRootBindings()
  })

  override ngOnInit() {
    super.ngOnInit()

    const machine = useMachine(
      passwordInputMachine,
      computed<Explicit<PasswordInputApiProps>>(() => ({
        autoComplete: this.autoComplete(),
        defaultValue: this.defaultValue(),
        defaultVisible: this.defaultVisible(),
        dir: this.dir(),
        disabled: this.isDisabled(),
        // angular handles this automatically with ngModel and Reactive Forms
        form: undefined,
        getRootNode: this.getRootNode() ?? (() => this.document),
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
        onVisibleChange: (value) => {
          if (this.isMounted()) {
            this.visibleChanged.emit(value)
          }
        },
        readOnly: this.readOnly(),
        required: this.isRequired(),
        translations: this.translations(),
        value: this.value(),
        visible: this.visible(),
      })),
      this.injector,
    )

    this.passwordInputService.init(
      computed(() => createPasswordInputApi(machine, normalizeProps)),
    )

    this.trackBindings()
  }
}
