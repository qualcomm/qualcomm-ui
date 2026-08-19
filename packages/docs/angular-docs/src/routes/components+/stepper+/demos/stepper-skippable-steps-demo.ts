import {Component, inject, signal} from "@angular/core"
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms"
import {LucideChevronLeft, LucideChevronRight} from "@lucide/angular"

import {provideIcons} from "@qualcomm-ui/angular-core/lucide"
import {ButtonModule} from "@qualcomm-ui/angular/button"
import {StepperModule} from "@qualcomm-ui/angular/stepper"
import {TextInputModule} from "@qualcomm-ui/angular/text-input"
import type {
  CanGoToStepDetails,
  StepInvalidDetails,
} from "@qualcomm-ui/core/stepper"

const PROMO_STEP = 1

const steps = [
  {title: "Shipping", value: "shipping"},
  {title: "Promo Code", value: "promo"},
  {title: "Payment", value: "payment"},
]

@Component({
  imports: [StepperModule, ButtonModule, TextInputModule, ReactiveFormsModule],
  providers: [provideIcons({LucideChevronLeft, LucideChevronRight})],
  selector: "stepper-skippable-steps-demo",
  template: `
    <!-- preview -->
    <div
      q-stepper-root
      [canGoToStep]="canGoToStep"
      [count]="steps.length"
      [isStepSkippable]="isStepSkippable"
      [step]="step()"
      (stepChanged)="step.set($event)"
      (stepInvalid)="onStepInvalid($event)"
    >
      <div q-stepper-list>
        @for (s of steps; track s.value; let i = $index) {
          <div q-stepper-item [index]="i">
            <button q-stepper-trigger>
              <div q-stepper-indicator>{{ i + 1 }}</div>
              <span q-stepper-label>
                {{ s.title }}
                @if (i === promoStep) {
                  <span q-stepper-hint>(optional)</span>
                }
              </span>
            </button>
            <div q-stepper-separator></div>
          </div>
        }
      </div>

      <div q-stepper-content [index]="0">
        <q-text-input
          class="max-w-56"
          label="Shipping address"
          placeholder="123 Main St"
          [errorText]="getErrorText('address')"
          [formControl]="form.controls.address"
          [invalid]="isFieldInvalid('address')"
        />
      </div>

      <div q-stepper-content [index]="1">
        <q-text-input
          class="max-w-56"
          label="Promo code"
          placeholder="SAVE20"
          [formControl]="form.controls.promo"
        />
      </div>

      <div q-stepper-content [index]="2">
        <q-text-input
          class="max-w-56"
          label="Card number"
          placeholder="4242 4242 4242 4242"
          [errorText]="getErrorText('card')"
          [formControl]="form.controls.card"
          [invalid]="isFieldInvalid('card')"
        />
      </div>

      <div q-stepper-completed-content>
        Order confirmed. Thank you for your purchase!
      </div>

      <div class="mt-6 flex justify-between">
        <button
          q-button
          q-stepper-prev-trigger
          size="sm"
          startIcon="ChevronLeft"
          variant="outline"
        >
          Back
        </button>
        <button
          endIcon="ChevronRight"
          q-button
          q-stepper-next-trigger
          size="sm"
          variant="outline"
        >
          Next
        </button>
      </div>
    </div>
    <!-- preview -->
  `,
})
export class StepperSkippableStepsDemo {
  readonly steps = steps
  readonly promoStep = PROMO_STEP
  readonly step = signal(0)

  private fb = inject(FormBuilder)

  readonly form = this.fb.group({
    address: ["", Validators.required],
    card: ["", Validators.required],
    promo: [""],
  })

  readonly isStepSkippable = (index: number): boolean => index === PROMO_STEP

  readonly canGoToStep = ({
    current,
    target,
  }: CanGoToStepDetails): boolean | undefined => {
    if (target <= current) {
      return undefined
    }
    return this.validateStep(current)
  }

  isFieldInvalid(name: "address" | "card" | "promo"): boolean {
    const control = this.form.controls[name]
    return control.invalid && (control.dirty || control.touched)
  }

  getErrorText(name: "address" | "card"): string {
    const control = this.form.controls[name]
    if (control.hasError("required")) {
      return `${name === "address" ? "Shipping address" : "Card number"} is required`
    }
    return ""
  }

  onStepInvalid({step}: StepInvalidDetails) {
    if (step === 0) {
      this.form.controls.address.markAsTouched()
      this.form.controls.address.markAsDirty()
    }
    if (step === 2) {
      this.form.controls.card.markAsTouched()
      this.form.controls.card.markAsDirty()
    }
  }

  private validateStep(index: number): boolean {
    if (index === 0) {
      return this.form.controls.address.valid
    }
    if (index === 2) {
      return this.form.controls.card.valid
    }
    return true
  }
}
