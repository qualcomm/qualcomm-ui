import {
  computed,
  inject,
  InjectionToken,
  type Signal,
  signal,
  type WritableSignal,
} from "@angular/core"
import {NgControl, NgModel} from "@angular/forms"

import type {FormEventData} from "@qualcomm-ui/angular-core/forms"

export interface InputFormControlContext<T> {
  control?: NgControl["control"] | null
  /**
   * Computed error message from the underlying control.
   */
  errorText: Signal<string | undefined | null>
  formEventData: WritableSignal<FormEventData<T | undefined> | null>
  /** `true` when used with reactive-forms (`formControl`, `formControlName`). */
  isReactiveForm: () => boolean
  /** `true` when used with template-driven forms (`[(ngModel)]`, `ngModel`). */
  isTemplateDrivenForm: () => boolean
  ngControl: NgControl | null
}

export type FormControlKnownErrors = Record<
  string,
  ((error: any) => string) | undefined
>

const defaultErrors: FormControlKnownErrors = {
  email: () => "Invalid email",
  max: (err) => `Max: ${err.max}`,
  maxLength: (err) => `Max length: ${err.maxLength}`,
  min: (err) => `Min: ${err.min}`,
  minLength: (err) => `Min length: ${err.requiredLength}`,
  pattern: () => "Invalid format",
  required: () => "This field is required",
  requiredTrue: () => "Required",
}

/**
 * Override the default error messages for known form control errors.
 *
 * The defaults are as follows:
 * ```angular-html
 * const defaultKnownErrors: FormControlKnownErrors = {
 *   email: () => "Invalid email",
 *   max: (err) => `Max: ${err.max}`,
 *   maxLength: (err) => `Max length: ${err.maxLength}`,
 *   min: (err) => `Min: ${err.min}`,
 *   minLength: (err) => `Min length: ${err.requiredLength}`,
 *   pattern: () => "Invalid format",
 *   required: () => "This field is required",
 *   requiredTrue: () => "This field is required",
 * }
 * ```
 */
export const FORM_CONTROL_ERROR_MESSAGE_PROVIDER = new InjectionToken<
  Partial<FormControlKnownErrors>
>("FormControlErrorProvider")

export const INPUT_FORM_CONTROL_CONTEXT = new InjectionToken<
  InputFormControlContext<any>
>("InputFormControl")

export function initInputFormControl<T = string>(): InputFormControlContext<T> {
  const ngControl: NgControl | null = inject(NgControl, {
    optional: true,
    self: true,
  })

  const knownErrors: FormControlKnownErrors = {
    ...defaultErrors,
    ...(inject(FORM_CONTROL_ERROR_MESSAGE_PROVIDER, {optional: true}) ?? {}),
  }

  const formEventData = signal<FormEventData<T | undefined> | null>(null)

  function isTemplateDrivenForm(): boolean {
    return ngControl instanceof NgModel
  }

  function isReactiveForm(): boolean {
    // Any NgControl that is *not* NgModel belongs to the reactive-forms package
    return !!ngControl && !isTemplateDrivenForm()
  }

  return {
    control: ngControl?.control ?? null,
    errorText: computed(() => {
      // make this reactive so that the error message is updated when the form state
      // changes.
      formEventData()
      const errors = ngControl?.control?.errors ?? {}
      const [errorKey, errorValue] = Object.entries(errors)[0] ?? []
      if (errorKey && knownErrors[errorKey]) {
        return knownErrors[errorKey](errorValue)
      }
      return errors["errorText"] ?? errors["error"] ?? null
    }),
    formEventData,
    isReactiveForm,
    isTemplateDrivenForm,
    ngControl,
  }
}
