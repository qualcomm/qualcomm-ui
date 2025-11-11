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
import {page, userEvent} from "@vitest/browser/context"
import {describe, expect, test, vi} from "vitest"

import {CheckboxModule} from "@qualcomm-ui/angular/checkbox"

import {type MultiComponentTest, runTests} from "~test-utils"

const demoLabel = "Demo Label"

const testCases: MultiComponentTest[] = [
  {
    composite() {
      @Component({
        imports: [CheckboxModule],
        template: `
          <label q-checkbox-root>
            <input q-checkbox-hidden-input />
            <div q-checkbox-control></div>
            <span q-checkbox-label>{{ demoLabel }}</span>
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
        imports: [CheckboxModule],
        template: `
          <label label="${demoLabel}" q-checkbox></label>
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
        imports: [CheckboxModule],
        template: `
          <label disabled q-checkbox-root>
            <input q-checkbox-hidden-input />
            <div q-checkbox-control></div>
            A
            <span q-checkbox-label>{{ demoLabel }}</span>
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
        imports: [CheckboxModule],
        template: `
          <label disabled label="${demoLabel}" q-checkbox></label>
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
        imports: [CheckboxModule],
        template: `
          <label q-checkbox-root>
            <input q-checkbox-hidden-input />
            <div q-checkbox-control>
              <div data-test-id="checkbox-indicator" q-checkbox-indicator></div>
            </div>
            <span q-checkbox-label>{{ demoLabel }}</span>
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
        imports: [CheckboxModule],
        template: `
          <label label="${demoLabel}" q-checkbox>
            <div q-checkbox-control>
              <div data-test-id="checkbox-indicator" q-checkbox-indicator></div>
            </div>
          </label>
        `,
      })
      class SimpleComponent {}
      return SimpleComponent
    },
    testCase(component) {
      test(`indicator — ${component.name}`, async () => {
        await render(component)

        expect(page.getByTestId("checkbox-indicator")).not.toBeVisible()
        await userEvent.click(page.getByText(demoLabel))
        await expect.element(page.getByLabelText(demoLabel)).toBeChecked()
        await expect
          .element(page.getByTestId("checkbox-indicator"))
          .toBeVisible()
      })
    },
  },
  {
    composite() {
      @Component({
        imports: [CheckboxModule],
        template: `
          <label indeterminate q-checkbox-root>
            <input q-checkbox-hidden-input />
            <div q-checkbox-control></div>
            <span q-checkbox-label>{{ demoLabel }}</span>
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
        imports: [CheckboxModule],
        template: `
          <label indeterminate label="${demoLabel}" q-checkbox></label>
        `,
      })
      class SimpleComponent {}
      return SimpleComponent
    },
    testCase(component) {
      test(`indeterminate — ${component.name}`, async () => {
        await render(component)

        expect(page.getByLabelText(demoLabel)).toHaveAttribute(
          "data-state",
          "indeterminate",
        )
      })
    },
  },
  {
    composite() {
      @Component({
        imports: [CheckboxModule],
        template: `
          <label indeterminate q-checkbox-root>
            <input id="hidden-input-id" q-checkbox-hidden-input />
            <div q-checkbox-control></div>
            <span q-checkbox-label>{{ demoLabel }}</span>
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
        imports: [CheckboxModule],
        template: `
          <label label="${demoLabel}" q-checkbox>
            <input id="hidden-input-id" q-checkbox-hidden-input />
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
        imports: [CheckboxModule, ReactiveFormsModule],
        template: `
          <label
            q-checkbox-root
            [formControl]="formControl"
            (checkedChanged)="changed.emit($event)"
          >
            <input q-checkbox-hidden-input />
            <div q-checkbox-control></div>
            <span q-checkbox-label>{{ demoLabel }}</span>
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
        imports: [CheckboxModule, ReactiveFormsModule],
        template: `
          <label
            label="${demoLabel}"
            q-checkbox
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
        imports: [CheckboxModule, ReactiveFormsModule],
        template: `
          <label q-checkbox-root [formControl]="formControl">
            <input q-checkbox-hidden-input />
            <div q-checkbox-control></div>
            <span q-checkbox-label>{{ demoLabel }}</span>
            <span q-checkbox-error-text>Error</span>
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
        imports: [CheckboxModule, ReactiveFormsModule],
        template: `
          <label
            errorText="Error"
            label="${demoLabel}"
            q-checkbox
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
        imports: [CheckboxModule, ReactiveFormsModule],
        template: `
          <label q-checkbox-root [formControl]="formControl">
            <input q-checkbox-hidden-input />
            <div q-checkbox-control></div>
            <span q-checkbox-label>{{ demoLabel }}</span>
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
        imports: [CheckboxModule, ReactiveFormsModule],
        template: `
          <label
            label="${demoLabel}"
            q-checkbox
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
        imports: [CheckboxModule, ReactiveFormsModule],
        template: `
          <label
            q-checkbox-root
            [formControl]="formControl"
            (checkedChanged)="changed.emit($event)"
          >
            <input q-checkbox-hidden-input />
            <div q-checkbox-control></div>
            <span q-checkbox-label>{{ demoLabel }}</span>
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
        imports: [CheckboxModule, ReactiveFormsModule],
        template: `
          <label
            label="${demoLabel}"
            q-checkbox
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
        imports: [CheckboxModule, ReactiveFormsModule],
        template: `
          <form [formGroup]="form" (ngSubmit)="onSubmit()">
            <label formControlName="checkbox" q-checkbox-root>
              <input q-checkbox-hidden-input />
              <div q-checkbox-control></div>
              <span q-checkbox-label>{{ demoLabel }}</span>
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
        imports: [CheckboxModule, ReactiveFormsModule],
        template: `
          <form [formGroup]="form">
            <label
              formControlName="checkbox"
              label="${demoLabel}"
              q-checkbox
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
        imports: [CheckboxModule, ReactiveFormsModule],
        template: `
          <button autofocus>focus target</button>
          <label q-checkbox-root [formControl]="formControl">
            <input q-checkbox-hidden-input />
            <div q-checkbox-control></div>
            <span q-checkbox-label>{{ demoLabel }}</span>
            <span q-checkbox-error-text>Required</span>
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
        imports: [CheckboxModule, ReactiveFormsModule],
        template: `
          <button autofocus>focus target</button>
          <label
            errorText="Required"
            label="${demoLabel}"
            q-checkbox
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

        await userEvent.click(page.getByText(demoLabel))
        await expect.element(page.getByText("Required")).toBeVisible()
      })
    },
  },
  {
    composite() {
      @Component({
        imports: [CheckboxModule, FormsModule],
        template: `
          <label
            q-checkbox-root
            [(ngModel)]="checked"
            (checkedChanged)="changed.emit($event)"
          >
            <input q-checkbox-hidden-input />
            <div q-checkbox-control></div>
            <span q-checkbox-label>{{ demoLabel }}</span>
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
        imports: [CheckboxModule, FormsModule],
        template: `
          <label
            label="${demoLabel}"
            q-checkbox
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
        imports: [CheckboxModule, FormsModule],
        template: `
          <label disabled q-checkbox-root [(ngModel)]="checked">
            <input q-checkbox-hidden-input />
            <div q-checkbox-control></div>
            <span q-checkbox-label>{{ demoLabel }}</span>
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
        imports: [CheckboxModule, FormsModule],
        template: `
          <label
            disabled
            label="${demoLabel}"
            q-checkbox
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
        imports: [CheckboxModule, FormsModule],
        template: `
          <label q-checkbox-root readOnly [(ngModel)]="checked">
            <input q-checkbox-hidden-input />
            <div q-checkbox-control></div>
            <span q-checkbox-label>{{ demoLabel }}</span>
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
        imports: [CheckboxModule, FormsModule],
        template: `
          <label
            label="${demoLabel}"
            q-checkbox
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
        imports: [CheckboxModule, FormsModule],
        template: `
          <label
            q-checkbox-root
            [(ngModel)]="checked"
            (checkedChanged)="changed.emit($event)"
          >
            <input q-checkbox-hidden-input />
            <div q-checkbox-control></div>
            <span q-checkbox-label>{{ demoLabel }}</span>
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
        imports: [CheckboxModule, FormsModule],
        template: `
          <label
            label="${demoLabel}"
            q-checkbox
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
        imports: [CheckboxModule, FormsModule],
        template: `
          <form #form="ngForm">
            <label
              #checkboxControl="ngModel"
              name="checkbox"
              q-checkbox-root
              required
              [(ngModel)]="checked"
            >
              <input q-checkbox-hidden-input />
              <div q-checkbox-control></div>
              <span q-checkbox-label>{{ demoLabel }}</span>
              <span q-checkbox-error-text>Required</span>
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
        imports: [CheckboxModule, FormsModule],
        template: `
          <form #form="ngForm">
            <label
              #checkboxControl="ngModel"
              errorText="Required"
              label="${demoLabel}"
              name="checkbox"
              q-checkbox
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
        imports: [CheckboxModule],
        template: `
          <label defaultChecked q-checkbox-root>
            <input q-checkbox-hidden-input />
            <div q-checkbox-control></div>
            <span q-checkbox-label>{{ demoLabel }}</span>
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
        imports: [CheckboxModule],
        template: `
          <label defaultChecked label="${demoLabel}" q-checkbox></label>
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
    const label = "I agree to the terms and conditions"
    const errorText = "You must agree to the terms and conditions"
    const submit = "Submit"
    const reset = "Reset"
    return {
      composite() {
        @Component({
          imports: [CheckboxModule, FormsModule],
          template: `
            <form #termsForm="ngForm">
              <label
                #terms="ngModel"
                data-test-id="terms-checkbox"
                name="terms"
                q-checkbox-root
                required
                [(ngModel)]="agreedToTerms"
              >
                <input q-checkbox-hidden-input />
                <div q-checkbox-control></div>
                <span q-checkbox-label>{{ label }}</span>
                <span q-checkbox-error-text>{{ errorText }}</span>
              </label>
              <button data-test-id="submit-button" type="submit">
                {{ submit }}
              </button>
              <button
                data-test-id="reset-button"
                type="button"
                (click)="resetForm(termsForm)"
              >
                {{ reset }}
              </button>
            </form>
          `,
        })
        class CompositeFormComponent {
          protected readonly errorText = errorText
          protected readonly reset = reset
          protected readonly submit = submit
          protected readonly label = label

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
          imports: [CheckboxModule, FormsModule],
          template: `
            <form #simpleForm="ngForm">
              <label
                #terms="ngModel"
                data-test-id="terms-checkbox"
                errorText="${errorText}"
                label="I agree to the terms and conditions"
                name="terms"
                q-checkbox
                required
                [(ngModel)]="agreedToTerms"
              ></label>
              <button data-test-id="submit-button" type="submit">
                {{ submit }}
              </button>
              <button
                data-test-id="reset-button"
                type="button"
                (click)="resetForm(simpleForm)"
              >
                {{ reset }}
              </button>
            </form>
          `,
        })
        class SimpleFormComponent {
          protected readonly reset = reset
          protected readonly submit = submit
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

          const checkbox = page.getByLabelText(label)
          const submitButton = page.getByText("Submit")
          const resetButton = page.getByText("Reset")

          expect(page.getByText(errorText)).not.toBeVisible()
          expect(checkbox).not.toBeChecked()

          await userEvent.click(submitButton)
          await expect.element(page.getByText(errorText)).toBeVisible()

          await userEvent.click(resetButton)

          await expect.element(checkbox).not.toBeChecked()
          await expect.element(page.getByText(errorText)).not.toBeVisible()
        })
        test(`template forms: validation and reset — ${component.name}`, async () => {
          await render(component)

          const checkbox = page.getByLabelText(label)
          const checkboxLabel = page.getByText(label)
          const submitButton = page.getByText("Submit")
          const resetButton = page.getByText("Reset")

          expect(page.getByText(errorText)).not.toBeVisible()
          expect(checkbox).not.toBeChecked()

          await userEvent.click(submitButton)
          await expect.element(page.getByText(errorText)).toBeVisible()

          await userEvent.click(checkboxLabel)

          await expect.element(page.getByText(errorText)).not.toBeVisible()
          await expect.element(checkbox).toBeChecked()

          await userEvent.click(checkboxLabel)
          await expect.element(checkbox).not.toBeChecked()
          await expect.element(page.getByText(errorText)).toBeVisible()

          await userEvent.click(resetButton)
          await expect.element(checkbox).not.toBeChecked()
          await expect.element(page.getByText(errorText)).not.toBeVisible()
        })
      },
    }
  },
  () => {
    const label = "I agree to the terms and conditions"
    const errorText = "You must agree to the terms and conditions"
    const submit = "Submit"
    const reset = "Reset"
    return {
      composite() {
        @Component({
          imports: [CheckboxModule, ReactiveFormsModule],
          template: `
            <form [formGroup]="termsForm" (ngSubmit)="onSubmit()">
              <label
                data-test-id="terms-checkbox"
                formControlName="terms"
                q-checkbox-root
              >
                <input q-checkbox-hidden-input />
                <div q-checkbox-control></div>
                <span q-checkbox-label>{{ label }}</span>
                <span q-checkbox-error-text>{{ errorText }}</span>
              </label>
              <button data-test-id="submit-button" type="submit">
                {{ submit }}
              </button>
              <button
                data-test-id="reset-button"
                type="button"
                (click)="resetForm()"
              >
                {{ reset }}
              </button>
            </form>
          `,
        })
        class CompositeReactiveFormComponent {
          protected readonly label = label
          protected readonly errorText = errorText
          protected readonly reset = reset
          protected readonly submit = submit
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
          imports: [CheckboxModule, ReactiveFormsModule],
          template: `
            <form [formGroup]="termsForm" (ngSubmit)="onSubmit()">
              <label
                data-test-id="terms-checkbox"
                formControlName="terms"
                q-checkbox
                [errorText]="errorText"
                [label]="label"
              ></label>
              <button data-test-id="submit-button" type="submit">
                {{ submit }}
              </button>
              <button
                data-test-id="reset-button"
                type="button"
                (click)="resetForm()"
              >
                {{ reset }}
              </button>
            </form>
          `,
        })
        class SimpleReactiveFormComponent {
          protected readonly label = label
          protected readonly errorText = errorText
          protected readonly reset = reset
          protected readonly submit = submit
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

          const checkbox = page.getByLabelText(label)
          const submitButton = page.getByText(submit)
          const resetButton = page.getByText(reset)

          expect(page.getByText(errorText)).not.toBeVisible()
          expect(checkbox).not.toBeChecked()

          await userEvent.click(submitButton)
          await expect.element(page.getByText(errorText)).toBeVisible()

          await userEvent.click(page.getByText(label))
          await expect.element(page.getByText(errorText)).not.toBeVisible()
          await expect.element(checkbox).toBeChecked()

          await userEvent.click(resetButton)
          await expect.element(checkbox).not.toBeChecked()
          await expect.element(page.getByText(errorText)).not.toBeVisible()
        })
      },
    }
  },
]

describe("checkbox", () => {
  runTests(testCases)
})
