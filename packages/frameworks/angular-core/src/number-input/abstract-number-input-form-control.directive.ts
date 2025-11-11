import {
  afterNextRender,
  booleanAttribute,
  computed,
  Directive,
  effect,
  inject,
  Injector,
  input,
  isDevMode,
  linkedSignal,
  type OnInit,
  runInInjectionContext,
  signal,
} from "@angular/core"
import {takeUntilDestroyed} from "@angular/core/rxjs-interop"
import {
  type AbstractControl,
  type ControlValueAccessor,
  type FormControlStatus,
  FormGroupDirective,
  FormSubmittedEvent,
  NgControl,
  NgForm,
  NgModel,
  PristineChangeEvent,
  Validators,
} from "@angular/forms"

import {numberAttributeOrUndefined} from "@qualcomm-ui/angular-core/attributes"
import {useOnDestroy} from "@qualcomm-ui/angular-core/common"
import {allEventsSignal, type FormEventData} from "@qualcomm-ui/angular-core/forms"
import type {Booleanish, NumberInput} from "@qualcomm-ui/utils/coercion"
import {defined, isDefined} from "@qualcomm-ui/utils/guard"

import {requiredNumberValidator} from "./number-input.validators"

@Directive()
export abstract class AbstractNumberInputFormControlDirective
  implements ControlValueAccessor, OnInit
{
  /**
   * The initial checked state of the checkbox when rendered. Use when you don't
   * need to control the checked state of the checkbox. This property will be
   * ignored if you opt into controlled state via form control bindings.
   */
  readonly defaultValue = input<number | undefined, NumberInput>(undefined, {
    transform: numberAttributeOrUndefined,
  })

  /**
   * Controls whether the input is disabled in template-driven forms. When true,
   * prevents user interaction and applies visual styling to indicate the disabled
   * state.
   */
  readonly disabled = input<boolean | undefined, Booleanish>(undefined, {
    transform: booleanAttribute,
  })

  /**
   * Controls the visual error state of the input. When true, applies semantic error
   * styling to indicate validation failure.
   */
  readonly invalid = input<boolean | undefined, Booleanish>(undefined, {
    transform: booleanAttribute,
  })

  /**
   * The name of the input field in a checkbox. Useful for form submission.
   */
  readonly name = input<string | undefined>()

  /**
   * Whether the input is read-only. When true, prevents user interaction while
   * keeping the input focusable and visible.
   */
  readonly readOnly = input<boolean | undefined, Booleanish>(undefined, {
    transform: booleanAttribute,
  })

  /**
   * Controls whether the input is required in template-driven forms. When
   * true, the input must have a value for form validation to pass.
   */
  readonly required = input<boolean | undefined, Booleanish>(undefined, {
    transform: booleanAttribute,
  })

  /* the internal "value" state of the input */
  protected readonly value = signal<number | undefined>(undefined)
  protected readonly stringValue = signal<string | undefined>(undefined)
  protected readonly onDestroy = useOnDestroy()
  protected readonly injector = inject(Injector)
  protected readonly formControlStatus = signal<FormControlStatus | undefined>(
    undefined,
  )
  protected readonly formSubmitted = signal(false)

  protected readonly ngControl: NgControl | null = inject(NgControl, {
    optional: true,
    self: true,
  })

  protected readonly formEventData = signal<FormEventData<
    number | undefined
  > | null>(null)

  /**
   * If the component is bound to an Angular AbstractControl, its state wins.
   * If not, fall back to the host attribute.
   */
  protected readonly isDisabled = linkedSignal(() => {
    /**
     * When the component is bound to any AbstractControl, status is guaranteed to
     * be non-undefined.
     */
    const status = this.formControlStatus()
    const disabled = this.disabled()
    if (status !== undefined) {
      return status === "DISABLED"
    }

    return !!disabled
  })

  readonly isInvalid = computed(() => {
    const formEventData = this.formEventData()
    const submitted = this.formSubmitted()
    const isInvalidDefined = defined(this.invalid())
    const invalidProp = this.invalid() || false
    if (!this.control) {
      return invalidProp
    }

    let invalid, touched, dirty

    if (this.isTemplateDrivenForm) {
      invalid = isInvalidDefined ? invalidProp : this.control.invalid
      touched = this.control.touched
      dirty = this.control.dirty
    } else if (formEventData) {
      invalid = formEventData.invalid
      touched = formEventData.touched
      dirty = formEventData.dirty
    } else {
      return invalidProp
    }

    // TODO: evaluate whether this should be customizable.
    // React Hook Form uses a reValidateMode prop for adjusting the validation
    // strategy after the form has been submitted.
    if (submitted) {
      return invalid
    }

    switch (this.control.updateOn) {
      case "submit":
        return invalid
      case "blur":
        return invalid && touched
      default:
        // "change"
        return dirty && invalid
    }
  })

  readonly isRequired = linkedSignal(() => {
    const control = this.control
    const required = this.required()
    if (!control || !this.isReactiveForm) {
      return required
    }

    if (typeof control.hasValidator === "function") {
      return (
        control.hasValidator(Validators.required) ||
        control.hasValidator(Validators.requiredTrue) ||
        control.hasValidator(requiredNumberValidator)
      )
    }
    return false
  })

  constructor() {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this
      this.setValueFromControl()
    }

    afterNextRender(() => {
      if (isDefined(this.required()) && this.isReactiveForm && isDevMode()) {
        console.warn(
          "The required attribute is not supported on reactive forms. Use Validators instead. https://angular.dev/guide/forms/form-validation#validating-input-in-reactive-forms",
        )
      }
    })

    effect(() => {
      const required = this.required()
      if (this.control && this.isTemplateDrivenForm) {
        if (required) {
          this.control.addValidators(requiredNumberValidator)
        } else if (this.control.hasValidator(requiredNumberValidator)) {
          this.control.removeValidators(requiredNumberValidator)
        }
      }
    })
  }

  ngOnInit() {
    this.setValueFromControl()
    // Ensure the form control receives the initial value
    const defaultValue = this.defaultValue()
    if (!this.control && defined(defaultValue)) {
      this.stringValue.set(`${defaultValue}`)
      this.value.set(defaultValue)
    } else if (this.control) {
      const subscription = this.control.statusChanges.subscribe((status) => {
        this.formControlStatus.set(status)
      })
      this.onDestroy(() => {
        subscription.unsubscribe()
      })

      const parent = this.getParentForm()

      runInInjectionContext(this.injector, () => {
        if (this.control) {
          const formSignal = allEventsSignal<number | undefined>(this.control)
          effect(() => {
            this.formEventData.set(formSignal())
          })
        }

        if (this.control) {
          this.control?.valueChanges
            .pipe(takeUntilDestroyed())
            .subscribe(() => {
              this.setValueFromControl()
            })
        }

        if (parent) {
          let prevPristine = this.control?.pristine || false
          parent.form.events.pipe(takeUntilDestroyed()).subscribe((event) => {
            if (event instanceof PristineChangeEvent) {
              if (event.pristine && !prevPristine) {
                // if this event fires with pristine status and the control was
                // previously not pristine, this means that the form was reset. There
                // isn't another way to determine form resets programmatically,
                // unfortunately.
                this.formSubmitted.set(false)
              }
              prevPristine = event.pristine
            } else if (event instanceof FormSubmittedEvent) {
              this.formSubmitted.set(true)
              this.control?.markAsDirty()
            }
          })
          parent.ngSubmit.pipe(takeUntilDestroyed()).subscribe(() => {
            if (this.isReactiveForm) {
              // already accounted for in the above event subscription.
              return
            }
            this.formSubmitted.set(true)
            this.control?.markAsDirty()
          })
        }
      })
    }
  }

  private setValueFromControl() {
    if (this.ngControl) {
      const value = this.ngControl.control?.value
      if (isDefined(value) && !Number.isNaN(value)) {
        this.value.set(value)
        this.stringValue.set(`${value}`)
      }
    }
  }

  /** `true` when used with template-driven forms (`[(ngModel)]`, `ngModel`, …). */
  get isTemplateDrivenForm(): boolean {
    return this.ngControl instanceof NgModel
  }

  /** `true` when used with reactive-forms (`formControl`, `formControlName`, …). */
  get isReactiveForm(): boolean {
    // Any NgControl that is *not* NgModel belongs to the reactive-forms package
    return !!this.ngControl && !this.isTemplateDrivenForm
  }

  /** Convenience access to the underlying AbstractControl (can be null). */
  protected get control(): AbstractControl | null {
    return this.ngControl?.control ?? null
  }

  /**
   * Used to subscribe to form submit events.
   */
  private getParentForm(): NgForm | FormGroupDirective | null {
    if (!this.control) {
      return null
    }

    // Try to find NgForm first
    try {
      const ngForm = this.injector.get(NgForm, null)
      if (ngForm) {
        return ngForm
      }
    } catch {}

    // Fall back to FormGroupDirective
    try {
      const formGroupDirective = this.injector.get(FormGroupDirective, null)
      if (formGroupDirective) {
        return formGroupDirective
      }
    } catch {}

    return null
  }

  /*
   * Control value accessor methods
   */
  writeValue(value: any): void {
    this.value.set(value)
  }

  // placeholder
  protected onChange = (_value: any) => {}

  registerOnChange(fn: (value: any) => void): void {
    this.onChange = (_value) => {
      fn(_value)
      this.value.set(_value)
    }
  }

  protected onTouched = () => {}
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn
  }

  /**
   * NgModel never calls setDisabledState, but ReactiveForms does. Everything else
   * (writeValue, registerOnChange, registerOnTouched) is identical between Reactive
   * and Template forms.
   */
  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled)
  }
}
