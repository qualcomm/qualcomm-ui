import {Component, output, signal} from "@angular/core"
import {
  FormControl,
  FormGroup,
  FormsModule,
  NgForm,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms"
import {render} from "@testing-library/angular"
import {describe, expect, test, vi} from "vitest"
import {page, userEvent} from "vitest/browser"

import {SwitchModule} from "@qualcomm-ui/angular/switch"

import {type MultiComponentTest, runTests} from "~test-utils"

const demoLabel = "Demo Label"

const labels = {
  errorText: "You must agree to the terms and conditions",
  label: "I agree to the terms and conditions",
  reset: "Reset",
  submit: "Submit",
}

const testCases: MultiComponentTest[] = [
  {
    composite() {
      @Component({
        imports: [SwitchModule],
        template: `
          <label q-switch-root>
            <input q-switch-hidden-input />
            <div q-switch-control></div>
            <span q-switch-label>{{ demoLabel }}</span>
          </label>
        `,
      })
      class CompositeComponent {
        protected readonly demoLabel = demoLabel
      }
      return CompositeComponent
    },
    simple() {
      @Component({
        imports: [SwitchModule],
        template: `
          <label label="${demoLabel}" q-switch></label>
        `,
      })
      class SimpleComponent {}
      return SimpleComponent
    },
    testCase(component) {
      test(`checked/unchecked state — ${component.name}`, async () => {
        await render(component)

        expect(page.getByLabelText(demoLabel)).not.toBeChecked()
        await userEvent.click(page.getByText(demoLabel))
        expect(page.getByLabelText(demoLabel)).toBeChecked()
        await userEvent.click(page.getByText(demoLabel))
        expect(page.getByLabelText(demoLabel)).not.toBeChecked()
      })
    },
  },
  {
    composite() {
      @Component({
        imports: [SwitchModule],
        template: `
          <label disabled q-switch>
            <input q-switch-hidden-input />
            <div q-switch-control></div>
            A
            <span q-switch-label>{{ demoLabel }}</span>
          </label>
        `,
      })
      class CompositeComponent {
        protected readonly demoLabel = demoLabel
      }
      return CompositeComponent
    },
    simple() {
      @Component({
        imports: [SwitchModule],
        template: `
          <label disabled label="${demoLabel}" q-switch></label>
        `,
      })
      class SimpleComponent {}
      return SimpleComponent
    },
    testCase(component) {
      test(`disabled — ${component.name}`, async () => {
        await render(component)

        expect(page.getByLabelText(demoLabel)).toBeDisabled()
        expect(page.getByLabelText(demoLabel)).not.toBeChecked()
      })
    },
  },
  {
    composite() {
      @Component({
        imports: [SwitchModule],
        template: `
          <label q-switch-root>
            <input id="hidden-input-id" q-switch-hidden-input />
            <div q-switch-control></div>
            <span q-switch-label>{{ demoLabel }}</span>
          </label>
        `,
      })
      class CompositeComponent {
        protected readonly demoLabel = demoLabel
      }
      return CompositeComponent
    },
    simple() {
      @Component({
        imports: [SwitchModule],
        template: `
          <label label="${demoLabel}" q-switch>
            <input id="hidden-input-id" q-switch-hidden-input />
          </label>
        `,
      })
      class SimpleComponent {}
      return SimpleComponent
    },
    testCase(component) {
      test(`controlled id — ${component.name}`, async () => {
        await render(component)

        expect(page.getByLabelText(demoLabel)).toHaveAttribute(
          "id",
          "hidden-input-id",
        )
      })
    },
  },
  {
    composite() {
      @Component({
        imports: [SwitchModule, ReactiveFormsModule],
        template: `
          <label
            q-switch
            [formControl]="formControl"
            (checkedChanged)="changed.emit($event)"
          >
            <input q-switch-hidden-input />
            <div q-switch-control></div>
            <span q-switch-label>{{ demoLabel }}</span>
          </label>
        `,
      })
      class CompositeComponent {
        protected readonly demoLabel = demoLabel
        formControl = new FormControl(true)

        changed = output<boolean>()
      }
      return CompositeComponent
    },
    simple() {
      @Component({
        imports: [SwitchModule, ReactiveFormsModule],
        template: `
          <label
            label="${demoLabel}"
            q-switch
            [formControl]="formControl"
            (checkedChanged)="changed.emit($event)"
          ></label>
        `,
      })
      class SimpleComponent {
        formControl = new FormControl(true)

        changed = output<boolean>()
      }
      return SimpleComponent
    },
    testCase(component) {
      test(`reactive forms — ${component.name}`, async () => {
        const changeWatcher = vi.fn()
        await render(component, {
          on: {changed: (checked) => changeWatcher(checked)},
        })

        expect(page.getByLabelText(demoLabel)).toBeChecked()
        await userEvent.click(page.getByText(demoLabel))
        await expect.element(page.getByLabelText(demoLabel)).not.toBeChecked()
        expect(changeWatcher).toHaveBeenCalledExactlyOnceWith(false)

        await userEvent.click(page.getByText(demoLabel))
        await expect.element(page.getByLabelText(demoLabel)).toBeChecked()
        expect(changeWatcher).toHaveBeenLastCalledWith(true)
      })
    },
  },
  {
    composite() {
      @Component({
        imports: [SwitchModule, ReactiveFormsModule],
        template: `
          <label q-switch [formControl]="formControl">
            <input q-switch-hidden-input />
            <div q-switch-control></div>
            <span q-switch-label>{{ demoLabel }}</span>
            <span q-switch-error-text>Error</span>
          </label>
        `,
      })
      class CompositeComponent {
        protected readonly demoLabel = demoLabel
        formControl = new FormControl(true, Validators.requiredTrue)
      }
      return CompositeComponent
    },
    simple() {
      @Component({
        imports: [SwitchModule, ReactiveFormsModule],
        template: `
          <label
            errorText="Error"
            label="${demoLabel}"
            q-switch
            [formControl]="formControl"
          ></label>
        `,
      })
      class SimpleComponent {
        formControl = new FormControl(true, Validators.requiredTrue)
      }
      return SimpleComponent
    },
    testCase(component) {
      test(`reactive forms: required / errors — ${component.name}`, async () => {
        await render(component)

        expect(page.getByText("Error")).not.toBeVisible()

        await userEvent.click(page.getByText(demoLabel))
        await expect.element(page.getByLabelText(demoLabel)).not.toBeChecked()

        await expect.element(page.getByText("Error")).toBeVisible()

        await userEvent.click(page.getByText(demoLabel))
        await expect.element(page.getByLabelText(demoLabel)).toBeChecked()

        await expect.element(page.getByText("Error")).not.toBeVisible()
      })
    },
  },
  {
    composite() {
      @Component({
        imports: [SwitchModule, ReactiveFormsModule],
        template: `
          <label q-switch [formControl]="formControl">
            <input q-switch-hidden-input />
            <div q-switch-control></div>
            <span q-switch-label>{{ demoLabel }}</span>
          </label>
        `,
      })
      class CompositeComponent {
        protected readonly demoLabel = demoLabel
        formControl = new FormControl({disabled: true, value: true})
      }
      return CompositeComponent
    },
    simple() {
      @Component({
        imports: [SwitchModule, ReactiveFormsModule],
        template: `
          <label
            label="${demoLabel}"
            q-switch
            [formControl]="formControl"
          ></label>
        `,
      })
      class SimpleComponent {
        formControl = new FormControl({disabled: true, value: true})
      }
      return SimpleComponent
    },
    testCase(component) {
      test(`reactive forms: disabled form control — ${component.name}`, async () => {
        const {fixture} = await render(component)
        const instance = fixture.componentInstance

        expect(page.getByLabelText(demoLabel)).toBeDisabled()
        expect(page.getByLabelText(demoLabel)).toBeChecked()

        await userEvent.click(page.getByText(demoLabel), {
          force: true,
        })
        await expect.element(page.getByLabelText(demoLabel)).toBeChecked()

        instance.formControl.enable()
        fixture.detectChanges()

        await expect.element(page.getByLabelText(demoLabel)).not.toBeDisabled()

        await userEvent.click(page.getByText(demoLabel))
        await expect.element(page.getByLabelText(demoLabel)).not.toBeChecked()
      })
    },
  },
  {
    composite() {
      @Component({
        imports: [SwitchModule, ReactiveFormsModule],
        template: `
          <label
            q-switch
            [formControl]="formControl"
            (checkedChanged)="changed.emit($event)"
          >
            <input q-switch-hidden-input />
            <div q-switch-control></div>
            <span q-switch-label>{{ demoLabel }}</span>
          </label>
          <button data-test-id="set-true" (click)="setValue(true)">
            Set True
          </button>
          <button data-test-id="set-false" (click)="setValue(false)">
            Set False
          </button>
        `,
      })
      class CompositeComponent {
        protected readonly demoLabel = demoLabel
        formControl = new FormControl(false)
        changed = output<boolean>()

        setValue(value: boolean) {
          this.formControl.setValue(value)
        }
      }
      return CompositeComponent
    },
    simple() {
      @Component({
        imports: [SwitchModule, ReactiveFormsModule],
        template: `
          <label
            label="${demoLabel}"
            q-switch
            [formControl]="formControl"
            (checkedChanged)="changed.emit($event)"
          ></label>
          <button data-test-id="set-true" (click)="setValue(true)">
            Set True
          </button>
          <button data-test-id="set-false" (click)="setValue(false)">
            Set False
          </button>
        `,
      })
      class SimpleComponent {
        formControl = new FormControl(false)
        changed = output<boolean>()

        setValue(value: boolean) {
          this.formControl.setValue(value)
        }
      }
      return SimpleComponent
    },
    testCase(component) {
      test(`programmatic changes — ${component.name}`, async () => {
        const changeWatcher = vi.fn()
        await render(component, {
          on: {changed: (checked) => changeWatcher(checked)},
        })

        expect(page.getByLabelText(demoLabel)).not.toBeChecked()

        await userEvent.click(page.getByTestId("set-true"))
        await expect.element(page.getByLabelText(demoLabel)).toBeChecked()

        await userEvent.click(page.getByTestId("set-false"))
        await expect.element(page.getByLabelText(demoLabel)).not.toBeChecked()
      })
    },
  },
  {
    composite() {
      @Component({
        imports: [SwitchModule, ReactiveFormsModule],
        template: `
          <form [formGroup]="form" (ngSubmit)="onSubmit()">
            <label formControlName="checkbox" q-switch>
              <input q-switch-hidden-input />
              <div q-switch-control></div>
              <span q-switch-label>{{ demoLabel }}</span>
            </label>
            <button data-test-id="reset" type="button" (click)="resetForm()">
              Reset
            </button>
            <button data-test-id="submit" type="submit">Submit</button>
          </form>
        `,
      })
      class CompositeComponent {
        protected readonly demoLabel = demoLabel
        form = new FormGroup({
          checkbox: new FormControl(true, Validators.requiredTrue),
        })

        resetForm() {
          this.form.reset()
        }

        onSubmit() {}
      }
      return CompositeComponent
    },
    simple() {
      @Component({
        imports: [SwitchModule, ReactiveFormsModule],
        template: `
          <form [formGroup]="form">
            <label
              formControlName="checkbox"
              label="${demoLabel}"
              q-switch
            ></label>
            <button data-test-id="reset" type="button" (click)="resetForm()">
              Reset
            </button>
            <button data-test-id="submit" type="submit">Submit</button>
          </form>
        `,
      })
      class SimpleComponent {
        form = new FormGroup({
          checkbox: new FormControl(true, Validators.requiredTrue),
        })

        resetForm() {
          this.form.reset()
        }
      }
      return SimpleComponent
    },
    testCase(component) {
      test(`form reset — ${component.name}`, async () => {
        await render(component)

        expect(page.getByLabelText(demoLabel)).toBeChecked()

        await userEvent.click(page.getByText(demoLabel))
        await expect.element(page.getByLabelText(demoLabel)).not.toBeChecked()

        await userEvent.click(page.getByText(demoLabel))
        await expect.element(page.getByLabelText(demoLabel)).toBeChecked()

        await userEvent.click(page.getByTestId("reset"))
        await expect.element(page.getByLabelText(demoLabel)).not.toBeChecked()
      })
    },
  },
  {
    composite() {
      @Component({
        imports: [SwitchModule, ReactiveFormsModule],
        template: `
          <button autofocus>focus target</button>
          <label q-switch [formControl]="formControl">
            <input q-switch-hidden-input />
            <div q-switch-control></div>
            <span q-switch-label>{{ demoLabel }}</span>
            <span q-switch-error-text>Required</span>
          </label>
        `,
      })
      class CompositeComponent {
        protected readonly demoLabel = demoLabel
        formControl = new FormControl(false, Validators.requiredTrue)
      }
      return CompositeComponent
    },
    simple() {
      @Component({
        imports: [SwitchModule, ReactiveFormsModule],
        template: `
          <button autofocus>focus target</button>
          <label
            errorText="Required"
            label="${demoLabel}"
            q-switch
            [formControl]="formControl"
          ></label>
        `,
      })
      class SimpleComponent {
        formControl = new FormControl(false, Validators.requiredTrue)
      }
      return SimpleComponent
    },
    testCase(component) {
      test(`reactive forms: validation states — ${component.name}`, async () => {
        const {fixture} = await render(component)
        const instance = fixture.componentInstance

        expect(instance.formControl.touched).toBe(false)
        expect(instance.formControl.dirty).toBe(false)
        expect(instance.formControl.valid).toBe(false)

        await userEvent.click(page.getByText("focus target"))
        await userEvent.tab()
        await userEvent.tab()

        await expect.poll(() => instance.formControl.touched).toBe(true)
        await expect.element(page.getByText("Required")).not.toBeVisible()

        await userEvent.click(page.getByText(demoLabel))
        await expect.poll(() => instance.formControl.dirty).toBe(true)
        await expect.poll(() => instance.formControl.valid).toBe(true)

        await expect.element(page.getByText("Required")).not.toBeVisible()

        // by default, error only shows when the control is invalid and has changed.
        await userEvent.click(page.getByText(demoLabel))
        await expect.element(page.getByText("Required")).toBeVisible()
      })
    },
  },
  {
    composite() {
      @Component({
        imports: [SwitchModule, FormsModule],
        template: `
          <label
            q-switch
            [(ngModel)]="checked"
            (checkedChanged)="changed.emit($event)"
          >
            <input q-switch-hidden-input />
            <div q-switch-control></div>
            <span q-switch-label>{{ demoLabel }}</span>
          </label>
        `,
      })
      class CompositeComponent {
        protected readonly demoLabel = demoLabel
        checked = true
        changed = output<boolean>()
      }
      return CompositeComponent
    },
    simple() {
      @Component({
        imports: [SwitchModule, FormsModule],
        template: `
          <label
            label="${demoLabel}"
            q-switch
            [(ngModel)]="checked"
            (checkedChanged)="changed.emit($event)"
          ></label>
        `,
      })
      class SimpleComponent {
        checked = true
        changed = output<boolean>()
      }
      return SimpleComponent
    },
    testCase(component) {
      test(`template forms: change handler — ${component.name}`, async () => {
        const changeWatcher = vi.fn()
        await render(component, {
          on: {changed: (checked) => changeWatcher(checked)},
        })
        await expect.element(page.getByLabelText(demoLabel)).toBeChecked()
        await userEvent.click(page.getByText(demoLabel))
        await expect.element(page.getByLabelText(demoLabel)).not.toBeChecked()
        expect(changeWatcher).toHaveBeenCalledExactlyOnceWith(false)
        await userEvent.click(page.getByText(demoLabel))
        await expect.element(page.getByLabelText(demoLabel)).toBeChecked()
        expect(changeWatcher).toHaveBeenLastCalledWith(true)
      })
    },
  },
  {
    composite() {
      @Component({
        imports: [SwitchModule, FormsModule],
        template: `
          <label disabled q-switch [(ngModel)]="checked">
            <input q-switch-hidden-input />
            <div q-switch-control></div>
            <span q-switch-label>{{ demoLabel }}</span>
          </label>
        `,
      })
      class CompositeComponent {
        protected readonly demoLabel = demoLabel
        checked = true
      }
      return CompositeComponent
    },
    simple() {
      @Component({
        imports: [SwitchModule, FormsModule],
        template: `
          <label
            disabled
            label="${demoLabel}"
            q-switch
            [(ngModel)]="checked"
          ></label>
        `,
      })
      class SimpleComponent {
        checked = true
      }
      return SimpleComponent
    },
    testCase(component) {
      test(`template forms: disabled — ${component.name}`, async () => {
        const {fixture} = await render(component)
        const instance = fixture.componentInstance
        await expect.element(page.getByLabelText(demoLabel)).toBeDisabled()
        expect(page.getByLabelText(demoLabel)).toBeChecked()

        await userEvent.click(page.getByText(demoLabel), {
          force: true,
        })
        await expect.element(page.getByLabelText(demoLabel)).toBeChecked()
        expect(instance.checked).toBe(true)
      })
    },
  },
  {
    composite() {
      @Component({
        imports: [SwitchModule, FormsModule],
        template: `
          <label q-switch readOnly [(ngModel)]="checked">
            <input q-switch-hidden-input />
            <div q-switch-control></div>
            <span q-switch-label>{{ demoLabel }}</span>
          </label>
        `,
      })
      class CompositeComponent {
        protected readonly demoLabel = demoLabel
        checked = true
      }
      return CompositeComponent
    },
    simple() {
      @Component({
        imports: [SwitchModule, FormsModule],
        template: `
          <label
            label="${demoLabel}"
            q-switch
            readOnly
            [(ngModel)]="checked"
          ></label>
        `,
      })
      class SimpleComponent {
        checked = true
      }
      return SimpleComponent
    },
    testCase(component) {
      test(`template forms: read-only — ${component.name}`, async () => {
        const {fixture} = await render(component)
        const instance = fixture.componentInstance
        await expect.element(page.getByLabelText(demoLabel)).toBeChecked()
        await userEvent.click(page.getByText(demoLabel))
        await expect.element(page.getByLabelText(demoLabel)).toBeChecked()
        expect(instance.checked).toBe(true)
      })
    },
  },
  {
    composite() {
      @Component({
        imports: [SwitchModule, FormsModule],
        template: `
          <label
            q-switch
            [(ngModel)]="checked"
            (checkedChanged)="changed.emit($event)"
          >
            <input q-switch-hidden-input />
            <div q-switch-control></div>
            <span q-switch-label>{{ demoLabel }}</span>
          </label>
          <button data-test-id="set-true" (click)="setValue(true)">
            Set True
          </button>
          <button data-test-id="set-false" (click)="setValue(false)">
            Set False
          </button>
        `,
      })
      class CompositeComponent {
        protected readonly demoLabel = demoLabel
        checked = false
        changed = output<boolean>()
        setValue(value: boolean) {
          this.checked = value
        }
      }
      return CompositeComponent
    },
    simple() {
      @Component({
        imports: [SwitchModule, FormsModule],
        template: `
          <label
            label="${demoLabel}"
            q-switch
            [(ngModel)]="checked"
            (checkedChanged)="changed.emit($event)"
          ></label>
          <button data-test-id="set-true" (click)="setValue(true)">
            Set True
          </button>
          <button data-test-id="set-false" (click)="setValue(false)">
            Set False
          </button>
        `,
      })
      class SimpleComponent {
        checked = false
        changed = output<boolean>()
        setValue(value: boolean) {
          this.checked = value
        }
      }
      return SimpleComponent
    },
    testCase(component) {
      test(`template forms: programmatic changes — ${component.name}`, async () => {
        const changeWatcher = vi.fn()
        await render(component, {
          on: {changed: (checked) => changeWatcher(checked)},
        })
        await expect.element(page.getByLabelText(demoLabel)).not.toBeChecked()
        await userEvent.click(page.getByTestId("set-true"))
        await expect.element(page.getByLabelText(demoLabel)).toBeChecked()
        await userEvent.click(page.getByTestId("set-false"))
        await expect.element(page.getByLabelText(demoLabel)).not.toBeChecked()
      })
    },
  },
  {
    composite() {
      @Component({
        imports: [SwitchModule, FormsModule],
        template: `
          <form #form="ngForm">
            <label
              #checkboxControl="ngModel"
              name="checkbox"
              q-switch
              required
              [(ngModel)]="checked"
            >
              <input q-switch-hidden-input />
              <div q-switch-control></div>
              <span q-switch-label>{{ demoLabel }}</span>
              <span q-switch-error-text>Required</span>
            </label>
            <div data-test-id="status">
              Touched: {{ checkboxControl.touched }} | Dirty:
              {{ checkboxControl.dirty }} | Valid: {{ checkboxControl.valid }}
            </div>
          </form>
        `,
      })
      class CompositeComponent {
        protected readonly demoLabel = demoLabel
        readonly checked = signal(true)
      }
      return CompositeComponent
    },
    simple() {
      @Component({
        imports: [SwitchModule, FormsModule],
        template: `
          <form #form="ngForm">
            <label
              #checkboxControl="ngModel"
              errorText="Required"
              label="${demoLabel}"
              name="checkbox"
              q-switch
              required
              [(ngModel)]="checked"
            ></label>
            <div data-test-id="status">
              Touched: {{ checkboxControl.touched }} | Dirty:
              {{ checkboxControl.dirty }}
            </div>
          </form>
        `,
      })
      class SimpleComponent {
        readonly checked = signal(true)
      }
      return SimpleComponent
    },
    testCase(component) {
      test(`template forms: validation states — ${component.name}`, async () => {
        await render(component)

        expect(page.getByTestId("status")).toHaveTextContent(
          "Touched: false | Dirty: false",
        )
        expect(page.getByText("Required")).not.toBeVisible()

        await userEvent.tab()
        await userEvent.tab()
        await expect
          .element(page.getByTestId("status"))
          .toHaveTextContent("Touched: true | Dirty: false")

        expect(page.getByText("Required")).not.toBeVisible()

        await userEvent.click(page.getByText(demoLabel))
        await expect
          .element(page.getByTestId("status"))
          .toHaveTextContent("Touched: true | Dirty: true")

        await expect.element(page.getByText("Required")).toBeVisible()

        await userEvent.click(page.getByText(demoLabel))

        await expect
          .element(page.getByTestId("status"))
          .toHaveTextContent("Touched: true | Dirty: true")

        await expect.element(page.getByText("Required")).not.toBeVisible()
      })
    },
  },
  {
    composite() {
      @Component({
        imports: [SwitchModule],
        template: `
          <label defaultChecked q-switch>
            <input q-switch-hidden-input />
            <div q-switch-control></div>
            <span q-switch-label>{{ demoLabel }}</span>
          </label>
        `,
      })
      class CompositeComponent {
        protected readonly demoLabel = demoLabel
      }
      return CompositeComponent
    },
    simple() {
      @Component({
        imports: [SwitchModule],
        template: `
          <label defaultChecked label="${demoLabel}" q-switch></label>
        `,
      })
      class SimpleComponent {}
      return SimpleComponent
    },
    testCase(component) {
      test(`checkbox default checked — ${component.name}`, async () => {
        await render(component)

        await expect.element(page.getByLabelText(demoLabel)).toBeChecked()
      })
    },
  },
  () => {
    return {
      composite() {
        @Component({
          imports: [SwitchModule, FormsModule],
          template: `
            <form #termsForm="ngForm">
              <label
                #terms="ngModel"
                data-test-id="terms-checkbox"
                name="terms"
                q-switch
                required
                [(ngModel)]="agreedToTerms"
              >
                <input q-switch-hidden-input />
                <div q-switch-control></div>
                <span q-switch-label>{{ labels.label }}</span>
                <span q-switch-error-text>{{ labels.errorText }}</span>
              </label>
              <button data-test-id="submit-button" type="submit">
                {{ labels.submit }}
              </button>
              <button
                data-test-id="reset-button"
                type="button"
                (click)="resetForm(termsForm)"
              >
                {{ labels.reset }}
              </button>
            </form>
          `,
        })
        class CompositeFormComponent {
          protected readonly labels = labels
          readonly agreedToTerms = signal<boolean>(false)

          resetForm(form: NgForm) {
            this.agreedToTerms.set(false)
            form.resetForm()
          }
        }
        return CompositeFormComponent
      },
      simple() {
        @Component({
          imports: [SwitchModule, FormsModule],
          template: `
            <form #simpleForm="ngForm">
              <label
                #terms="ngModel"
                data-test-id="terms-checkbox"
                errorText="${labels.errorText}"
                label="I agree to the terms and conditions"
                name="terms"
                q-switch
                required
                [(ngModel)]="agreedToTerms"
              ></label>
              <button data-test-id="submit-button" type="submit">
                {{ labels.submit }}
              </button>
              <button
                data-test-id="reset-button"
                type="button"
                (click)="resetForm(simpleForm)"
              >
                {{ labels.reset }}
              </button>
            </form>
          `,
        })
        class SimpleFormComponent {
          protected readonly labels = labels
          readonly agreedToTerms = signal<boolean>(false)

          resetForm(form: NgForm) {
            this.agreedToTerms.set(false)
            form.resetForm()
          }
        }
        return SimpleFormComponent
      },
      testCase(component) {
        test(`template forms: reset — ${component.name}`, async () => {
          await render(component)

          const checkbox = page.getByLabelText(labels.label)
          const submitButton = page.getByText("Submit")
          const resetButton = page.getByText("Reset")

          expect(page.getByText(labels.errorText)).not.toBeVisible()
          expect(checkbox).not.toBeChecked()

          await userEvent.click(submitButton)
          await expect.element(page.getByText(labels.errorText)).toBeVisible()

          await userEvent.click(resetButton)
          await expect.element(checkbox).not.toBeChecked()
          await expect
            .element(page.getByText(labels.errorText))
            .not.toBeVisible()
        })
        test(`template forms: validation and reset — ${component.name}`, async () => {
          await render(component)

          const checkbox = page.getByLabelText(labels.label)
          const checkboxLabel = page.getByText(labels.label)
          const submitButton = page.getByText("Submit")
          const resetButton = page.getByText("Reset")

          expect(page.getByText(labels.errorText)).not.toBeVisible()
          expect(checkbox).not.toBeChecked()

          await userEvent.click(submitButton)
          await expect.element(page.getByText(labels.errorText)).toBeVisible()

          await userEvent.click(checkboxLabel)

          await expect
            .element(page.getByText(labels.errorText))
            .not.toBeVisible()
          await expect.element(checkbox).toBeChecked()

          await userEvent.click(checkboxLabel)
          await expect.element(checkbox).not.toBeChecked()
          await expect.element(page.getByText(labels.errorText)).toBeVisible()

          await userEvent.click(resetButton)
          await expect.element(checkbox).not.toBeChecked()
          await expect
            .element(page.getByText(labels.errorText))
            .not.toBeVisible()
        })
      },
    }
  },
  () => {
    return {
      composite() {
        @Component({
          imports: [SwitchModule, ReactiveFormsModule],
          template: `
            <form [formGroup]="termsForm" (ngSubmit)="onSubmit()">
              <label
                data-test-id="terms-checkbox"
                formControlName="terms"
                q-switch
              >
                <input q-switch-hidden-input />
                <div q-switch-control></div>
                <span q-switch-label>{{ labels.label }}</span>
                <span q-switch-error-text>{{ labels.errorText }}</span>
              </label>
              <button data-test-id="submit-button" type="submit">
                {{ labels.submit }}
              </button>
              <button
                data-test-id="reset-button"
                type="button"
                (click)="resetForm()"
              >
                {{ labels.reset }}
              </button>
            </form>
          `,
        })
        class CompositeReactiveFormComponent {
          protected readonly labels = labels
          readonly termsForm = new FormGroup({
            terms: new FormControl(false, Validators.requiredTrue),
          })

          onSubmit() {
            if (this.termsForm.valid) {
              console.log("Form submitted", this.termsForm.value.terms)
            }
          }

          resetForm() {
            this.termsForm.reset()
          }
        }

        return CompositeReactiveFormComponent
      },
      simple() {
        @Component({
          imports: [SwitchModule, ReactiveFormsModule],
          template: `
            <form [formGroup]="termsForm" (ngSubmit)="onSubmit()">
              <label
                data-test-id="terms-checkbox"
                errorText="${labels.errorText}"
                formControlName="terms"
                label="${labels.label}"
                q-switch
              ></label>
              <button data-test-id="submit-button" type="submit">
                {{ labels.submit }}
              </button>
              <button
                data-test-id="reset-button"
                type="button"
                (click)="resetForm()"
              >
                {{ labels.reset }}
              </button>
            </form>
          `,
        })
        class SimpleReactiveFormComponent {
          protected readonly labels = labels
          readonly termsForm = new FormGroup({
            terms: new FormControl(false, Validators.requiredTrue),
          })

          onSubmit() {
            if (this.termsForm.valid) {
              console.log("Form submitted", this.termsForm.value.terms)
            }
          }

          resetForm() {
            this.termsForm.reset()
          }
        }

        return SimpleReactiveFormComponent
      },
      testCase(component) {
        test(`reactive forms: validation and reset — ${component.name}`, async () => {
          await render(component)

          const checkbox = page.getByLabelText(labels.label)
          const submitButton = page.getByText(labels.submit)
          const resetButton = page.getByText(labels.reset)

          expect(page.getByText(labels.errorText)).not.toBeVisible()
          expect(checkbox).not.toBeChecked()

          await userEvent.click(submitButton)
          await expect.element(page.getByText(labels.errorText)).toBeVisible()

          await userEvent.click(page.getByText(labels.label))
          await expect
            .element(page.getByText(labels.errorText))
            .not.toBeVisible()
          await expect.element(checkbox).toBeChecked()

          await userEvent.click(resetButton)
          await expect.element(checkbox).not.toBeChecked()
          await expect
            .element(page.getByText(labels.errorText))
            .not.toBeVisible()
        })
      },
    }
  },
]

describe("checkbox", () => {
  runTests(testCases)
})
