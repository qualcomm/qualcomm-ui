import {
  booleanAttribute,
  computed,
  Directive,
  inject,
  input,
  type OnInit,
  output,
} from "@angular/core"

import {numberAttributeOrUndefined} from "@qualcomm-ui/angular-core/attributes"
import {useIsMounted} from "@qualcomm-ui/angular-core/common"
import {
  normalizeProps,
  useMachine,
  useTrackBindings,
} from "@qualcomm-ui/angular-core/machine"
import type {SignalifyInput} from "@qualcomm-ui/angular-core/signals"
import {
  createNumberInputApi,
  type NumberInputApiProps,
  type NumberInputIntlTranslations,
  numberInputMachine,
  type NumberInputMode,
  type NumberInputValueChangeDetails,
  type NumberInputValueInvalidDetails,
} from "@qualcomm-ui/core/number-input"
import type {Booleanish, NumberInput} from "@qualcomm-ui/utils/coercion"
import type {Direction} from "@qualcomm-ui/utils/direction"
import {type Explicit} from "@qualcomm-ui/utils/guard"

import {AbstractNumberInputFormControlDirective} from "./abstract-number-input-form-control.directive"
import {NumberInputContextService} from "./number-input-context.service"

@Directive()
export class CoreNumberInputRootDirective
  extends AbstractNumberInputFormControlDirective
  implements
    OnInit,
    Omit<
      SignalifyInput<NumberInputApiProps>,
      "defaultValue" | "form" | "ids" | "value"
    >
{
  /**
   * Whether to allow mouse wheel to change the value
   */
  readonly allowMouseWheel = input<boolean | undefined, Booleanish>(undefined, {
    transform: booleanAttribute,
  })

  /**
   * Whether to allow the value to overflow the min/max range
   * @default true
   */
  readonly allowOverflow = input<boolean | undefined, Booleanish>(undefined, {
    transform: booleanAttribute,
  })

  /**
   * Whether to clamp the value when the input loses focus (blur)
   * @default true
   */
  readonly clampValueOnBlur = input<boolean | undefined, Booleanish>(
    undefined,
    {
      transform: booleanAttribute,
    },
  )

  /**
   * The document's text/writing direction.
   *
   * @default "ltr"
   */
  readonly dir = input<Direction | undefined>(undefined)

  /**
   * Whether to focus the input when the value changes
   *
   * @default true
   */
  readonly focusInputOnChange = input<boolean | undefined, Booleanish>(
    undefined,
    {
      transform: booleanAttribute,
    },
  )

  /**
   * The options to pass to the `Intl.NumberFormat` constructor
   */
  readonly formatOptions = input<Intl.NumberFormatOptions | undefined>()

  /**
   * A root node to correctly resolve the Document in custom environments. i.e.,
   * Iframes, Electron.
   */
  readonly getRootNode = input<
    (() => ShadowRoot | Document | Node) | undefined
  >()

  /**
   * Hints at the type of data that might be entered by the user. It also determines
   * the type of keyboard shown to the user on mobile devices
   * @default "decimal"
   */
  readonly inputMode = input<NumberInputMode | undefined>()

  /**
   * The maximum value of the number input
   * @default Number.MAX_SAFE_INTEGER
   */
  readonly max = input<number | undefined, NumberInput>(undefined, {
    transform: numberAttributeOrUndefined,
  })

  /**
   * The minimum value of the number input
   * @default Number.MIN_SAFE_INTEGER
   */
  readonly min = input<number | undefined, NumberInput>(undefined, {
    transform: numberAttributeOrUndefined,
  })

  /**
   * The current locale. Based on the BCP 47 definition.
   *
   * @default 'en-US'
   */
  readonly locale = input<string | undefined>()

  /**
   * The pattern used to check the <input> element's value against
   *
   * @default "[0-9]*(.[0-9]+)?"
   */
  readonly pattern = input<string | undefined>()

  /**
   * Whether to spin the value when the increment/decrement button is pressed
   * @default true
   */
  readonly spinOnPress = input<boolean | undefined, Booleanish>(undefined, {
    transform: booleanAttribute,
  })

  /**
   * Amount to increment/decrement the value when using stepper buttons or arrow keys.
   * @default 1
   */
  readonly step = input<number | undefined, NumberInput>(undefined, {
    transform: numberAttributeOrUndefined,
  })

  /**
   * Specifies the localized strings that identify the accessibility elements and
   * their states
   */
  readonly translations = input<NumberInputIntlTranslations | undefined>()

  /**
   * Event emitted when the checkbox is checked or unchecked. This is only emitted
   * on interaction. It doesn't emit in response to programmatic form control
   * changes.
   */
  readonly valueChanged = output<NumberInputValueChangeDetails>()

  /**
   * Function invoked when the value overflows or underflows the min/max range
   */
  readonly valueInvalid = output<NumberInputValueInvalidDetails>()

  protected readonly isMounted = useIsMounted()

  protected readonly numberInputContext = inject(NumberInputContextService)

  protected readonly trackBindings = useTrackBindings(() => {
    return this.numberInputContext.context().getRootBindings()
  })

  override ngOnInit() {
    super.ngOnInit()

    const machine = useMachine(
      numberInputMachine,
      computed<Explicit<NumberInputApiProps>>(() => {
        return {
          allowMouseWheel: this.allowMouseWheel(),
          allowOverflow: this.allowOverflow(),
          clampValueOnBlur: this.clampValueOnBlur(),
          defaultValue: this.defaultValue()
            ? `${this.defaultValue() ?? ""}`
            : "",
          dir: this.dir(),
          disabled: this.isDisabled(),
          focusInputOnChange: this.focusInputOnChange(),
          // angular handles this automatically with ngModel and Reactive Forms
          form: undefined,
          formatOptions: this.formatOptions(),
          getRootNode: this.getRootNode(),
          ids: undefined,
          inputMode: this.inputMode(),
          invalid: this.isInvalid(),
          locale: this.locale(),
          max: this.max(),
          min: this.min(),
          name: this.name(),
          onFocusChange: (details) => {
            if (!details.focused) {
              // only trigger onTouched on blur.
              this.onTouched()
            }
          },
          onValueChange: (details) => {
            this.stringValue.set(details.value)
            if (!this.control) {
              if (this.isMounted()) {
                this.valueChanged.emit(details)
              }
              this.value.set(details.valueAsNumber)
              return
            }
            // ngModel is bound to the root, but change events happen on the <input>
            // element and are forwarded to the machine.  So we need to fire the
            // value change event to keep the form in sync.
            this.onChange(details.valueAsNumber)
            if (!this.control?.touched) {
              this.control.markAsTouched?.()
            }
            if (!this.control?.dirty) {
              this.control.markAsDirty?.()
            }
          },
          onValueInvalid: (details) => {
            this.valueInvalid.emit(details)
          },
          pattern: this.pattern(),
          readOnly: this.readOnly(),
          required: this.isRequired(),
          spinOnPress: this.spinOnPress(),
          step: this.step(),
          translations: this.translations(),
          value: this.stringValue(),
        }
      }),
      this.injector,
    )

    this.numberInputContext.init(
      computed(() => createNumberInputApi(machine, normalizeProps)),
    )

    this.trackBindings()
  }
}
