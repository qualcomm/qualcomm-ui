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
  NgForm,
  PristineChangeEvent,
  Validators,
} from "@angular/forms"

import {useOnDestroy} from "@qualcomm-ui/angular-core/common"
import {allEventsSignal} from "@qualcomm-ui/angular-core/forms"
import type {Booleanish} from "@qualcomm-ui/utils/coercion"
import {defined, isDefined} from "@qualcomm-ui/utils/guard"

import {initInputFormControl} from "./input-form-control-provider"

@Directive()
export abstract class AbstractInputFormControlDirective
  implements ControlValueAccessor, OnInit
{
  /**
   * The initial state of the input when rendered. Use when you don't
   * need to control the checked state of the input. This property will be
   * ignored if you opt into controlled state via form control bindings.
   */
  readonly defaultValue = input<string | undefined>(undefined)

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
   * The name of the input field. Useful for form submission.
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
  protected readonly value = signal<string>("")
  protected readonly onDestroy = useOnDestroy()
  protected readonly injector = inject(Injector)
  protected readonly formControlStatus = signal<FormControlStatus | undefined>(
    undefined,
  )
  protected readonly formSubmitted = signal(false)

  readonly formControlContext = initInputFormControl()

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
    const formEventData = this.formControlContext.formEventData()
    this.formSubmitted()
    const isInvalidDefined = defined(this.invalid())
    const invalidProp = this.invalid() || false
    if (!this.control) {
      return invalidProp
    }

    let invalid, touched, dirty

    if (this.formControlContext.isTemplateDrivenForm()) {
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
    if (!control || !this.formControlContext.isReactiveForm()) {
      return required
    }

    if (typeof control.hasValidator === "function") {
      return (
        control.hasValidator(Validators.required) ||
        control.hasValidator(Validators.requiredTrue)
      )
    }
    return false
  })

  constructor() {
    if (this.formControlContext.ngControl) {
      this.formControlContext.ngControl.valueAccessor = this
      this.value.set(this.formControlContext.ngControl.control?.value || "")
    }

    afterNextRender(() => {
      if (
        isDefined(this.required()) &&
        this.formControlContext.isReactiveForm() &&
        isDevMode()
      ) {
        console.warn(
          "The required attribute is not supported on reactive forms. Use Validators instead. https://angular.dev/guide/forms/form-validation#validating-input-in-reactive-forms",
        )
      }
    })

    effect(() => {
      const required = this.required()
      if (this.control && this.formControlContext.isTemplateDrivenForm()) {
        if (required) {
          this.control.addValidators(Validators.required)
        } else if (this.control.hasValidator(Validators.required)) {
          this.control.removeValidators(Validators.required)
        }
      }
    })
  }

  ngOnInit() {
    // Ensure the form control receives the initial value
    const defaultValue = this.defaultValue()
    if (!this.control && defaultValue) {
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
          const formSignal = allEventsSignal<string | undefined>(this.control)
          effect(() => {
            this.formControlContext.formEventData.set(formSignal())
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
            if (this.formControlContext.isReactiveForm()) {
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

  /** Convenience access to the underlying AbstractControl (can be null). */
  get control(): AbstractControl | null {
    return this.formControlContext.ngControl?.control ?? null
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
