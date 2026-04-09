import {Component, inject, signal} from "@angular/core"
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms"
import {ChevronLeft, ChevronRight} from "lucide-angular"

import {ButtonModule} from "@qualcomm-ui/angular/button"
import {StepperModule} from "@qualcomm-ui/angular/stepper"
import {TextInputModule} from "@qualcomm-ui/angular/text-input"
import {provideIcons} from "@qualcomm-ui/angular-core/lucide"

@Component({
  imports: [StepperModule, ButtonModule, TextInputModule, ReactiveFormsModule],
  providers: [provideIcons({ChevronLeft, ChevronRight})],
  selector: "stepper-nonlinear-form-demo",
  template: `
    <!-- preview -->
    <div
      q-stepper-root
      [completed]="completed()"
      [count]="items.length"
      [invalid]="invalid()"
      [linear]="false"
    >
      <div q-stepper-list>
        @for (item of items; track item.name; let i = $index) {
          <div q-stepper-item [index]="i">
            <button q-stepper-trigger>
              <div q-stepper-indicator>{{ i + 1 }}</div>
              <span q-stepper-label>{{ item.title }}</span>
            </button>
            <div q-stepper-separator></div>
          </div>
        }
      </div>

      @for (item of items; track item.name; let i = $index) {
        <div q-stepper-content [index]="i">
          <q-text-input
            class="w-72"
            [errorText]="getErrorText(item.name)"
            [formControl]="form.controls[item.name]"
            [invalid]="isFieldInvalid(item.name)"
            [label]="item.label"
            [placeholder]="item.placeholder"
          />
        </div>
      }

      <div q-stepper-completed-content>
        Survey submitted. Thank you for your feedback!
      </div>

      <div class="mt-6 flex justify-between">
        <ng-container *stepperContext="let api">
          <button
            q-button
            q-stepper-prev-trigger
            size="sm"
            startIcon="ChevronLeft"
            variant="outline"
            (click)="saveStep(api.step)"
          >
            Back
          </button>

          @if (allCompleted()) {
            <button
              endIcon="ChevronRight"
              q-button
              size="sm"
              (click)="saveStep(api.step); api.goToNextStep()"
            >
              Submit
            </button>
          } @else {
            <button
              endIcon="ChevronRight"
              q-button
              q-stepper-next-trigger
              size="sm"
              [disabled]="
                !api.hasNextStep ||
                (api.step === items.length - 1 && !allCompleted())
              "
              (click)="saveStep(api.step)"
            >
              Next
            </button>
          }
        </ng-container>
      </div>
    </div>
    <!-- preview -->
  `,
})
export class StepperNonlinearFormDemo {
  readonly items = [
    {
      label: "Age range",
      name: "age" as const,
      placeholder: "25-34",
      title: "Demographics",
    },
    {
      label: "Preferred contact method",
      name: "contact" as const,
      placeholder: "Email",
      title: "Preferences",
    },
    {
      label: "Comments",
      name: "comments" as const,
      placeholder: "Tell us what you think",
      title: "Feedback",
    },
  ]
  readonly completed = signal<Record<number, boolean>>({})
  readonly invalid = signal<Record<number, boolean>>({})

  private fb = inject(FormBuilder)

  readonly form = this.fb.group({
    age: ["", Validators.required],
    comments: ["", Validators.required],
    contact: ["", Validators.required],
  })

  allCompleted(): boolean {
    return this.items.every((_, i) => this.completed()[i])
  }

  isFieldInvalid(name: "age" | "comments" | "contact"): boolean {
    const control = this.form.controls[name]
    return control.invalid && (control.dirty || control.touched)
  }

  getErrorText(name: "age" | "comments" | "contact"): string {
    const control = this.form.controls[name]
    if (control.hasError("required")) {
      const item = this.items.find((i) => i.name === name)
      return `${item?.label} is required`
    }
    return ""
  }

  saveStep(index: number) {
    const field = this.items[index]?.name
    if (!field) {
      return
    }

    const control = this.form.controls[field]
    control.markAsTouched()

    if (control.valid) {
      this.invalid.update((prev) => ({...prev, [index]: false}))
      this.completed.update((prev) => ({...prev, [index]: true}))
    } else {
      this.invalid.update((prev) => ({...prev, [index]: true}))
      this.completed.update((prev) => ({...prev, [index]: false}))
    }
  }
}
