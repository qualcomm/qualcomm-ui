import {Component, Directive, output, signal} from "@angular/core"
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms"
import {render} from "@testing-library/angular"
import {page, userEvent} from "@vitest/browser/context"
import {describe, expect, test, vi} from "vitest"

import {NumberInputModule} from "@qualcomm-ui/angular/number-input"
import {requiredNumberValidator} from "@qualcomm-ui/angular-core/number-input"
import type {NumberInputValueChangeDetails} from "@qualcomm-ui/core/number-input"

import {type MultiComponentTest, runTests} from "~test-utils"

const demoLabel = "Demo Label"
const demoHint = "Optional hint"

const testCases: MultiComponentTest[] = [
  {
    composite() {
      @Component({
        imports: [NumberInputModule],
        template: `
          <div class="w-72" q-number-input-root>
            <label q-number-input-label>{{ label }}</label>
            <div q-number-input-input-group>
              <input placeholder="Enter a number" q-number-input-input />
              <div q-number-input-control></div>
            </div>
            <span q-number-input-hint>{{ hint }}</span>
          </div>
        `,
      })
      class CompositeComponent {
        protected readonly label = demoLabel
        protected readonly hint = demoHint
      }
      return CompositeComponent
    },
    simple() {
      @Component({
        imports: [NumberInputModule],
        template: `
          <q-number-input
            class="w-72"
            placeholder="Enter a number"
            [hint]="hint"
            [label]="label"
          />
        `,
      })
      class SimpleComponent {
        protected readonly label = demoLabel
        protected readonly hint = demoHint
      }
      return SimpleComponent
    },
    testCase(component) {
      test(`renders with label, hint, and placeholder — ${component.name}`, async () => {
        await render(component)

        expect(page.getByText(demoLabel)).toBeVisible()
        expect(page.getByText(demoHint)).toBeVisible()
        expect(page.getByLabelText(demoLabel)).toHaveAttribute(
          "placeholder",
          "Enter a number",
        )
      })
    },
  },
  {
    composite() {
      @Component({
        imports: [NumberInputModule],
        template: `
          <div class="w-72" q-number-input-root>
            <label q-number-input-label>{{ label }}</label>
            <div q-number-input-input-group>
              <input placeholder="Enter a number" q-number-input-input />
              <div q-number-input-control></div>
            </div>
            <span q-number-input-hint>{{ hint }}</span>
          </div>
        `,
      })
      class CompositeComponent {
        protected readonly label = demoLabel
        protected readonly hint = demoHint
      }
      return CompositeComponent
    },
    simple() {
      @Component({
        imports: [NumberInputModule],
        template: `
          <q-number-input
            class="w-72"
            placeholder="Enter a number"
            [hint]="hint"
            [label]="label"
          />
        `,
      })
      class SimpleComponent {
        protected readonly label = demoLabel
        protected readonly hint = demoHint
      }
      return SimpleComponent
    },
    testCase(component) {
      test(`accepts numeric user input — ${component.name}`, async () => {
        await render(component)

        await page.getByLabelText(demoLabel).fill("42.5")
        await expect.element(page.getByLabelText(demoLabel)).toHaveValue("42.5")
      })
    },
  },
  {
    composite() {
      @Component({
        imports: [NumberInputModule],
        template: `
          <div max="100" min="0" q-number-input-root>
            <label q-number-input-label>Value (0-100)</label>
            <div q-number-input-input-group>
              <input q-number-input-input />
              <div q-number-input-control></div>
            </div>
          </div>
        `,
      })
      class CompositeComponent {}
      return CompositeComponent
    },
    simple() {
      @Component({
        imports: [NumberInputModule],
        template: `
          <q-number-input label="Value (0-100)" max="100" min="0" />
        `,
      })
      class SimpleComponent {}
      return SimpleComponent
    },
    testCase(component) {
      test(`min/max constraints — ${component.name}`, async () => {
        await render(component)

        const input = page.getByLabelText("Value (0-100)")
        await expect.element(input).toHaveAttribute("aria-valuemin", "0")
        await expect.element(input).toHaveAttribute("aria-valuemax", "100")
      })
    },
  },
  {
    composite() {
      @Component({
        imports: [NumberInputModule],
        template: `
          <div
            defaultValue="25"
            q-number-input-root
            step="5"
            [translations]="{
              incrementLabel: 'Increment',
              decrementLabel: 'Decrement',
            }"
          >
            <label q-number-input-label>Quantity</label>
            <div q-number-input-input-group>
              <input q-number-input-input />
              <div q-number-input-control>
                <button q-number-input-decrement-trigger></button>
                <button q-number-input-increment-trigger></button>
              </div>
            </div>
          </div>
        `,
      })
      class CompositeComponent {}
      return CompositeComponent
    },
    simple() {
      @Component({
        imports: [NumberInputModule],
        template: `
          <q-number-input
            defaultValue="25"
            label="Quantity"
            step="5"
            [translations]="{
              incrementLabel: 'Increment',
              decrementLabel: 'Decrement',
            }"
          >
            <div q-number-input-control>
              <button q-number-input-decrement-trigger></button>
              <button q-number-input-increment-trigger></button>
            </div>
          </q-number-input>
        `,
      })
      class SimpleComponent {}
      return SimpleComponent
    },
    testCase(component) {
      test(`increment and decrement with step — ${component.name}`, async () => {
        await render(component)

        const input = page.getByLabelText("Quantity")
        await expect.element(input).toHaveValue("25")

        await userEvent.click(page.getByRole("button", {name: "Increment"}))
        await expect.element(input).toHaveValue("30")

        await userEvent.click(page.getByRole("button", {name: "Increment"}))
        await expect.element(input).toHaveValue("35")

        await userEvent.click(page.getByRole("button", {name: "Decrement"}))
        await expect.element(input).toHaveValue("30")

        await userEvent.click(page.getByRole("button", {name: "Decrement"}))
        await expect.element(input).toHaveValue("25")
      })
    },
  },
  () => {
    const errorText = "Value must be between 1 and 100"

    @Directive()
    class BaseTestComponent {
      protected readonly errorText = errorText
      form = new FormGroup({
        value: new FormControl<number | null>(null, [
          Validators.min(1),
          Validators.max(100),
          requiredNumberValidator,
        ]),
      })
    }
    return {
      composite() {
        @Component({
          imports: [NumberInputModule, ReactiveFormsModule],
          template: `
            <form [formGroup]="form">
              <div formControlName="value" q-number-input-root>
                <label q-number-input-label>Demo Label</label>
                <div q-number-input-input-group>
                  <input q-number-input-input />
                  <div q-number-input-control></div>
                </div>
                <div q-number-input-error-text>{{ errorText }}</div>
              </div>
            </form>

            <output class="text-neutral-primary m-4 block">
              {{ form.valid }}
            </output>
          `,
        })
        class CompositeComponent extends BaseTestComponent {}
        return CompositeComponent
      },
      simple() {
        @Component({
          imports: [NumberInputModule, ReactiveFormsModule],
          template: `
            <form [formGroup]="form">
              <q-number-input
                formControlName="value"
                label="Demo Label"
                [errorText]="errorText"
              />
            </form>

            <output class="text-neutral-primary m-4 block">
              {{ form.valid }}
            </output>
          `,
        })
        class SimpleComponent extends BaseTestComponent {}
        return SimpleComponent
      },
      testCase(component) {
        test(`reactive forms integration with validation — ${component.name}`, async () => {
          await render(component)

          const input = page.getByLabelText("Demo Label")

          await expect.element(page.getByText(errorText)).not.toBeVisible()

          await userEvent.type(input, "150")
          await expect
            .element(page.getByRole("status"))
            .toHaveTextContent("false")

          await expect.element(page.getByText(errorText)).toBeVisible()

          await userEvent.clear(input)
          await userEvent.type(input, "50")
          await expect
            .element(page.getByRole("status"))
            .toHaveTextContent("true")
          await expect.element(page.getByText(errorText)).not.toBeVisible()
        })
      },
    }
  },
  () => {
    const errorText = "Value is required"
    return {
      composite() {
        @Component({
          imports: [NumberInputModule, FormsModule],
          template: `
            <form #formRef="ngForm">
              <div
                name="amount"
                q-number-input-root
                required
                [(ngModel)]="amount"
              >
                <label q-number-input-label>Amount</label>
                <div q-number-input-input-group>
                  <input q-number-input-input />
                  <div q-number-input-control></div>
                </div>
                <div q-number-input-error-text>{{ errorText }}</div>
              </div>
            </form>
          `,
        })
        class CompositeComponent {
          protected readonly errorText = errorText
          readonly amount = signal<number | undefined>(undefined)
        }
        return CompositeComponent
      },
      simple() {
        @Component({
          imports: [NumberInputModule, FormsModule],
          template: `
            <form #formRef="ngForm">
              <q-number-input
                name="amount"
                required
                [errorText]="errorText"
                [label]="'Amount'"
                [(ngModel)]="amount"
              />
            </form>
          `,
        })
        class SimpleComponent {
          protected readonly errorText = errorText
          readonly amount = signal<number | undefined>(undefined)
        }
        return SimpleComponent
      },
      testCase(component) {
        test(`template-driven forms integration — ${component.name}`, async () => {
          await render(component)

          const input = page.getByLabelText("Amount")

          await userEvent.type(input, "100")
          await expect.element(input).toHaveValue("100")

          await userEvent.clear(input)
          await userEvent.tab()

          await expect.element(page.getByText(errorText)).toBeVisible()

          await userEvent.type(input, "50")
          await expect.element(page.getByText(errorText)).not.toBeVisible()
        })
      },
    }
  },
  {
    composite() {
      @Component({
        imports: [NumberInputModule],
        template: `
          <div
            disabled
            q-number-input-root
            [translations]="{
              incrementLabel: 'Increment 1',
              decrementLabel: 'Decrement 1',
            }"
          >
            <label q-number-input-label>Disabled Input</label>
            <div q-number-input-input-group>
              <input q-number-input-input />
              <div q-number-input-control>
                <button q-number-input-decrement-trigger></button>
                <button q-number-input-increment-trigger></button>
              </div>
            </div>
          </div>
          <div defaultValue="100" q-number-input-root readOnly>
            <label q-number-input-label>Read Only Input</label>
            <div q-number-input-input-group>
              <input q-number-input-input />
              <div q-number-input-control></div>
            </div>
          </div>
        `,
      })
      class CompositeComponent {}
      return CompositeComponent
    },
    simple() {
      @Component({
        imports: [NumberInputModule],
        template: `
          <q-number-input
            disabled
            label="Disabled Input"
            [translations]="{
              incrementLabel: 'Increment 1',
              decrementLabel: 'Decrement 1',
            }"
          />
          <q-number-input defaultValue="100" label="Read Only Input" readOnly />
        `,
      })
      class SimpleComponent {}
      return SimpleComponent
    },
    testCase(component) {
      test(`handles disabled and readonly states — ${component.name}`, async () => {
        await render(component)

        const disabledInput = page.getByLabelText("Disabled Input")
        const readonlyInput = page.getByLabelText("Read Only Input")

        await expect.element(disabledInput).toBeDisabled()
        await expect.element(readonlyInput).toHaveAttribute("readonly")
        await expect.element(readonlyInput).toHaveValue("100")

        await userEvent.type(disabledInput, "123")
        await expect.element(disabledInput).toHaveValue("")

        const decrementButton = page.getByRole("button", {name: "Decrement 1"})
        const incrementButton = page.getByRole("button", {name: "Increment 1"})

        await expect.element(decrementButton).toBeDisabled()
        await expect.element(incrementButton).toBeDisabled()

        await userEvent.type(readonlyInput, "999")
        await expect.element(readonlyInput).toHaveValue("100")
      })
    },
  },
  {
    composite() {
      @Component({
        imports: [NumberInputModule],
        template: `
          <div q-number-input-root size="sm">
            <label q-number-input-label>Small Input</label>
            <div q-number-input-input-group>
              <input q-number-input-input />
              <div q-number-input-control></div>
            </div>
          </div>
          <div q-number-input-root size="md">
            <label q-number-input-label>Medium Input</label>
            <div q-number-input-input-group>
              <input q-number-input-input />
              <div q-number-input-control></div>
            </div>
          </div>
          <div q-number-input-root size="lg">
            <label q-number-input-label>Large Input</label>
            <div q-number-input-input-group>
              <input q-number-input-input />
              <div q-number-input-control></div>
            </div>
          </div>
        `,
      })
      class CompositeComponent {}
      return CompositeComponent
    },
    simple() {
      @Component({
        imports: [NumberInputModule],
        template: `
          <q-number-input label="Small Input" size="sm" />
          <q-number-input label="Medium Input" size="md" />
          <q-number-input label="Large Input" size="lg" />
        `,
      })
      class SimpleComponent {}
      return SimpleComponent
    },
    testCase(component) {
      test(`renders different sizes — ${component.name}`, async () => {
        await render(component)

        expect(page.getByLabelText("Small Input")).toBeInTheDocument()
        expect(page.getByLabelText("Medium Input")).toBeInTheDocument()
        expect(page.getByLabelText("Large Input")).toBeInTheDocument()
      })
    },
  },
  {
    composite() {
      @Component({
        imports: [NumberInputModule, ReactiveFormsModule],
        template: `
          <div
            q-number-input-root
            [formControl]="formControl"
            (valueChanged)="changed.emit($event)"
          >
            <label q-number-input-label>{{ demoLabel }}</label>
            <div q-number-input-input-group>
              <input q-number-input-input />
              <div q-number-input-control></div>
            </div>
          </div>
        `,
      })
      class CompositeComponent {
        protected readonly demoLabel = demoLabel
        formControl = new FormControl(10)

        changed = output<NumberInputValueChangeDetails>()
      }
      return CompositeComponent
    },
    simple() {
      @Component({
        imports: [NumberInputModule, ReactiveFormsModule],
        template: `
          <q-number-input
            [formControl]="formControl"
            [label]="demoLabel"
            (valueChanged)="changed.emit($event)"
          />
        `,
      })
      class SimpleComponent {
        protected readonly demoLabel = demoLabel
        formControl = new FormControl(10)

        changed = output<NumberInputValueChangeDetails>()
      }
      return SimpleComponent
    },
    testCase(component) {
      test(`reactive forms: value changes — ${component.name}`, async () => {
        const {fixture} = await render(component, {
          on: {
            changed: vi.fn(),
          },
        })
        const instance = fixture.componentInstance

        const input = page.getByLabelText(demoLabel)
        await expect.element(input).toHaveValue("10")

        await userEvent.clear(input)
        await userEvent.type(input, "25")

        await expect.poll(() => instance.formControl.value).toBe(25)
      })
    },
  },
  {
    composite() {
      @Component({
        imports: [NumberInputModule, ReactiveFormsModule],
        template: `
          <div q-number-input-root [formControl]="formControl">
            <label q-number-input-label>{{ demoLabel }}</label>
            <div q-number-input-input-group>
              <input q-number-input-input />
              <div q-number-input-control></div>
            </div>
          </div>
          <button data-test-id="set-value" (click)="setValue(99)">
            Set Value
          </button>
        `,
      })
      class CompositeComponent {
        protected readonly demoLabel = demoLabel
        formControl = new FormControl(0)

        setValue(value: number) {
          this.formControl.setValue(value)
        }
      }
      return CompositeComponent
    },
    simple() {
      @Component({
        imports: [NumberInputModule, ReactiveFormsModule],
        template: `
          <q-number-input [formControl]="formControl" [label]="demoLabel" />
          <button data-test-id="set-value" (click)="setValue(99)">
            Set Value
          </button>
        `,
      })
      class SimpleComponent {
        protected readonly demoLabel = demoLabel
        formControl = new FormControl(0)

        setValue(value: number) {
          this.formControl.setValue(value)
        }
      }
      return SimpleComponent
    },
    testCase(component) {
      test(`programmatic value changes — ${component.name}`, async () => {
        await render(component)

        const input = page.getByLabelText(demoLabel)
        await expect.element(input).toHaveValue("0")

        await userEvent.click(page.getByTestId("set-value"))
        await expect.element(input).toHaveValue("99")
      })
    },
  },
  {
    composite() {
      @Component({
        imports: [NumberInputModule, ReactiveFormsModule],
        template: `
          <form [formGroup]="form">
            <div formControlName="quantity" q-number-input-root>
              <label q-number-input-label>Quantity</label>
              <div q-number-input-input-group>
                <input q-number-input-input />
                <div q-number-input-control></div>
              </div>
            </div>
            <button type="button" (click)="resetForm()">Reset</button>
          </form>
        `,
      })
      class CompositeComponent {
        form = new FormGroup({
          quantity: new FormControl(50),
        })

        resetForm() {
          this.form.reset()
          this.form.get("quantity")?.setValue(0)
        }
      }
      return CompositeComponent
    },
    simple() {
      @Component({
        imports: [NumberInputModule, ReactiveFormsModule],
        template: `
          <form [formGroup]="form">
            <q-number-input formControlName="quantity" label="Quantity" />
            <button type="button" (click)="resetForm()">Reset</button>
          </form>
        `,
      })
      class SimpleComponent {
        form = new FormGroup({
          quantity: new FormControl(50),
        })

        resetForm() {
          this.form.reset()
          this.form.get("quantity")?.setValue(0)
        }
      }
      return SimpleComponent
    },
    testCase(component) {
      test(`form reset — ${component.name}`, async () => {
        await render(component)

        const input = page.getByLabelText("Quantity")
        await expect.element(input).toHaveValue("50")

        await userEvent.clear(input)
        await userEvent.type(input, "100")
        await expect.element(input).toHaveValue("100")

        await userEvent.click(page.getByText("Reset"))
        await expect.element(input).toHaveValue("0")
      })
    },
  },
  {
    composite() {
      @Component({
        imports: [NumberInputModule, ReactiveFormsModule],
        template: `
          <button autofocus>focus target</button>
          <div q-number-input-root [formControl]="formControl">
            <label q-number-input-label>{{ demoLabel }}</label>
            <div q-number-input-input-group>
              <input q-number-input-input />
              <div q-number-input-control></div>
            </div>
            <div q-number-input-error-text>Required</div>
          </div>
          <output aria-label="touched" class="text-neutral-primary m-4 block">
            {{ formControl.touched }}
          </output>
          <output aria-label="dirty" class="text-neutral-primary m-4 block">
            {{ formControl.dirty }}
          </output>
          <output aria-label="valid" class="text-neutral-primary m-4 block">
            {{ formControl.valid }}
          </output>
        `,
      })
      class CompositeComponent {
        protected readonly demoLabel = demoLabel
        formControl = new FormControl<number | null>(null, [
          requiredNumberValidator,
        ])
      }
      return CompositeComponent
    },
    simple() {
      @Component({
        imports: [NumberInputModule, ReactiveFormsModule],
        template: `
          <button autofocus>focus target</button>
          <q-number-input
            errorText="Required"
            [formControl]="formControl"
            [label]="demoLabel"
          />
          <output aria-label="touched" class="text-neutral-primary m-4 block">
            {{ formControl.touched }}
          </output>
          <output aria-label="dirty" class="text-neutral-primary m-4 block">
            {{ formControl.dirty }}
          </output>
          <output aria-label="valid" class="text-neutral-primary m-4 block">
            {{ formControl.valid }}
          </output>
        `,
      })
      class SimpleComponent {
        protected readonly demoLabel = demoLabel
        formControl = new FormControl<number | null>(null, [
          requiredNumberValidator,
        ])
      }
      return SimpleComponent
    },
    testCase(component) {
      test(`reactive forms: validation states — ${component.name}`, async () => {
        await render(component)

        await expect
          .element(page.getByLabelText("touched"))
          .toHaveTextContent("false")
        await expect
          .element(page.getByLabelText("dirty"))
          .toHaveTextContent("false")
        await expect
          .element(page.getByLabelText("valid"))
          .toHaveTextContent("false")

        await userEvent.click(page.getByText("focus target"))
        await userEvent.tab()
        await expect.element(page.getByLabelText(demoLabel)).toHaveFocus()
        await page.getByText("focus target").click()

        await expect
          .element(page.getByLabelText("touched"))
          .toHaveTextContent("true")
        await expect.element(page.getByText("Required")).not.toBeVisible()

        const input = page.getByLabelText(demoLabel)
        await userEvent.type(input, "42")
        await expect
          .element(page.getByLabelText("dirty"))
          .toHaveTextContent("true")
        await expect
          .element(page.getByLabelText("valid"))
          .toHaveTextContent("true")

        await expect.element(page.getByText("Required")).not.toBeVisible()

        await userEvent.clear(input)
        await expect.element(page.getByText("Required")).toBeVisible()
      })
    },
  },
  {
    composite() {
      @Component({
        imports: [NumberInputModule, ReactiveFormsModule],
        template: `
          <div q-number-input-root [formControl]="formControl">
            <label q-number-input-label>{{ demoLabel }}</label>
            <div q-number-input-input-group>
              <input q-number-input-input />
              <div q-number-input-control></div>
            </div>
          </div>
        `,
      })
      class CompositeComponent {
        protected readonly demoLabel = demoLabel
        formControl = new FormControl({disabled: true, value: 75})
      }
      return CompositeComponent
    },
    simple() {
      @Component({
        imports: [NumberInputModule, ReactiveFormsModule],
        template: `
          <q-number-input [formControl]="formControl" [label]="demoLabel" />
        `,
      })
      class SimpleComponent {
        protected readonly demoLabel = demoLabel
        formControl = new FormControl({disabled: true, value: 75})
      }
      return SimpleComponent
    },
    testCase(component) {
      test(`reactive forms: disabled form control — ${component.name}`, async () => {
        const {fixture} = await render(component)
        const instance = fixture.componentInstance

        const input = page.getByLabelText(demoLabel)
        await expect.element(input).toBeDisabled()
        await expect.element(input).toHaveValue("75")

        await userEvent.type(input, "123")
        await expect.element(input).toHaveValue("75")

        instance.formControl.enable()
        fixture.detectChanges()

        await expect.element(input).not.toBeDisabled()

        await userEvent.clear(input)
        await userEvent.type(input, "42")
        await expect.element(input).toHaveValue("42")
      })
    },
  },
  () => {
    @Directive()
    class BaseTestComponent {
      protected readonly demoLabel = demoLabel
      readonly value = signal(10)

      setValue(value: number) {
        this.value.set(value)
      }
    }
    return {
      composite() {
        @Component({
          imports: [NumberInputModule, FormsModule],
          template: `
            <div q-number-input-root [(ngModel)]="value">
              <label q-number-input-label>{{ demoLabel }}</label>
              <div q-number-input-input-group>
                <input q-number-input-input />
                <div q-number-input-control></div>
              </div>
            </div>
            <button data-test-id="set-value" (click)="setValue(88)">
              Set Value
            </button>
          `,
        })
        class CompositeComponent extends BaseTestComponent {}
        return CompositeComponent
      },
      simple() {
        @Component({
          imports: [NumberInputModule, FormsModule],
          template: `
            <q-number-input [label]="demoLabel" [(ngModel)]="value" />
            <button data-test-id="set-value" (click)="setValue(88)">
              Set Value
            </button>
          `,
        })
        class SimpleComponent extends BaseTestComponent {}
        return SimpleComponent
      },
      testCase(component) {
        test(`template forms: programmatic changes — ${component.name}`, async () => {
          await render(component)

          const input = page.getByLabelText(demoLabel)
          await expect.element(input).toHaveValue("10")

          await userEvent.click(page.getByTestId("set-value"))
          await expect.element(input).toHaveValue("88")
        })
      },
    }
  },
  {
    composite() {
      @Component({
        imports: [NumberInputModule, FormsModule],
        template: `
          <div disabled q-number-input-root [(ngModel)]="value">
            <label q-number-input-label>{{ demoLabel }}</label>
            <div q-number-input-input-group>
              <input q-number-input-input />
              <div q-number-input-control></div>
            </div>
          </div>
        `,
      })
      class CompositeComponent {
        protected readonly demoLabel = demoLabel
        readonly value = signal(50)
      }
      return CompositeComponent
    },
    simple() {
      @Component({
        imports: [NumberInputModule, FormsModule],
        template: `
          <q-number-input disabled [label]="demoLabel" [(ngModel)]="value" />
        `,
      })
      class SimpleComponent {
        protected readonly demoLabel = demoLabel
        readonly value = signal(50)
      }
      return SimpleComponent
    },
    testCase(component) {
      test(`template forms: disabled — ${component.name}`, async () => {
        await render(component)

        const input = page.getByLabelText(demoLabel)
        await expect.element(input).toBeDisabled()
        // disabled Angular form controls do not have a value
        await expect.element(input).toHaveValue("50")

        await userEvent.type(input, "999")
        await expect.element(input).toHaveValue("50")
      })
    },
  },
  {
    composite() {
      @Component({
        imports: [NumberInputModule, FormsModule],
        template: `
          <div q-number-input-root readOnly [(ngModel)]="value">
            <label q-number-input-label>{{ demoLabel }}</label>
            <div q-number-input-input-group>
              <input q-number-input-input />
              <div q-number-input-control></div>
            </div>
          </div>
          <output class="text-neutral-primary m-4 block">
            {{ value() }}
          </output>
        `,
      })
      class CompositeComponent {
        protected readonly demoLabel = demoLabel
        readonly value = signal(33)
      }
      return CompositeComponent
    },
    simple() {
      @Component({
        imports: [NumberInputModule, FormsModule],
        template: `
          <q-number-input readOnly [label]="demoLabel" [(ngModel)]="value" />
          <output class="text-neutral-primary m-4 block">
            {{ value() }}
          </output>
        `,
      })
      class SimpleComponent {
        protected readonly demoLabel = demoLabel
        readonly value = signal(33)
      }
      return SimpleComponent
    },
    testCase(component) {
      test(`template forms: read-only — ${component.name}`, async () => {
        await render(component)
        const input = page.getByLabelText(demoLabel)
        await expect.element(input).toHaveAttribute("readonly")
        await expect.element(input).toHaveValue("33")

        await userEvent.type(input, "999")
        await expect.element(input).toHaveValue("33")
        await expect.element(page.getByRole("status")).toHaveTextContent("33")
      })
    },
  },
  {
    composite() {
      @Component({
        imports: [NumberInputModule],
        template: `
          <div defaultValue="42" q-number-input-root>
            <label q-number-input-label>{{ demoLabel }}</label>
            <div q-number-input-input-group>
              <input q-number-input-input />
              <div q-number-input-control></div>
            </div>
          </div>
        `,
      })
      class CompositeComponent {
        protected readonly demoLabel = demoLabel
      }
      return CompositeComponent
    },
    simple() {
      @Component({
        imports: [NumberInputModule],
        template: `
          <q-number-input defaultValue="42" [label]="demoLabel" />
        `,
      })
      class SimpleComponent {
        protected readonly demoLabel = demoLabel
      }
      return SimpleComponent
    },
    testCase(component) {
      test(`default value — ${component.name}`, async () => {
        await render(component)

        await expect.element(page.getByLabelText(demoLabel)).toHaveValue("42")
      })
    },
  },
  {
    composite() {
      @Component({
        imports: [NumberInputModule],
        template: `
          <div
            defaultValue="10"
            max="100"
            min="0"
            q-number-input-root
            step="10"
            [translations]="{
              incrementLabel: 'Increment',
              decrementLabel: 'Decrement',
            }"
          >
            <label q-number-input-label>Volume</label>
            <div q-number-input-input-group>
              <input q-number-input-input />
              <div q-number-input-control></div>
            </div>
          </div>
        `,
      })
      class CompositeComponent {}
      return CompositeComponent
    },
    simple() {
      @Component({
        imports: [NumberInputModule],
        template: `
          <q-number-input
            defaultValue="10"
            label="Volume"
            max="100"
            min="0"
            step="10"
            [translations]="{
              incrementLabel: 'Increment',
              decrementLabel: 'Decrement',
            }"
          />
        `,
      })
      class SimpleComponent {}
      return SimpleComponent
    },
    testCase(component) {
      test(`stepper buttons with min/max boundaries — ${component.name}`, async () => {
        await render(component)

        const input = page.getByLabelText("Volume")
        await expect.element(input).toHaveValue("10")

        await userEvent.click(page.getByRole("button", {name: "Decrement"}))
        await expect.element(input).toHaveValue("0")

        await userEvent.click(page.getByRole("button", {name: "Decrement"}), {
          force: true,
        })
        await expect.element(input).toHaveValue("0")

        for (let i = 0; i < 10; i++) {
          await userEvent.click(page.getByRole("button", {name: "Increment"}))
        }
        await expect.element(input).toHaveValue("100")

        await userEvent.click(page.getByRole("button", {name: "Increment"}), {
          force: true,
        })
        await expect.element(input).toHaveValue("100")
      })
    },
  },
  {
    composite() {
      @Component({
        imports: [NumberInputModule, ReactiveFormsModule],
        template: `
          <div
            max="50"
            min="1"
            q-number-input-root
            step="1"
            [formControl]="formControl"
            [translations]="{
              incrementLabel: 'Increment',
              decrementLabel: 'Decrement',
            }"
          >
            <label q-number-input-label>Age</label>
            <div q-number-input-input-group>
              <input q-number-input-input />
              <div q-number-input-control>
                <button q-number-input-decrement-trigger></button>
                <button q-number-input-increment-trigger></button>
              </div>
            </div>
            <div q-number-input-error-text>Age must be between 1 and 50</div>
          </div>
        `,
      })
      class CompositeComponent {
        formControl = new FormControl(25, [
          Validators.min(1),
          Validators.max(50),
        ])
      }
      return CompositeComponent
    },
    simple() {
      @Component({
        imports: [NumberInputModule, ReactiveFormsModule],
        template: `
          <q-number-input
            errorText="Age must be between 1 and 50"
            label="Age"
            max="50"
            min="1"
            step="1"
            [formControl]="formControl"
            [translations]="{
              incrementLabel: 'Increment',
              decrementLabel: 'Decrement',
            }"
          >
            <div q-number-input-control>
              <button q-number-input-decrement-trigger></button>
              <button q-number-input-increment-trigger></button>
            </div>
          </q-number-input>
        `,
      })
      class SimpleComponent {
        formControl = new FormControl(25, [
          Validators.min(1),
          Validators.max(50),
        ])
      }
      return SimpleComponent
    },
    testCase(component) {
      test(`stepper buttons with reactive forms — ${component.name}`, async () => {
        const {fixture} = await render(component)
        const instance = fixture.componentInstance

        const input = page.getByLabelText("Age")
        await expect.element(input).toHaveValue("25")

        await userEvent.click(page.getByRole("button", {name: "Increment"}))
        await expect.element(input).toHaveValue("26")
        await expect.poll(() => instance.formControl.value).toBe(26)

        await userEvent.click(page.getByRole("button", {name: "Decrement"}))
        await expect.element(input).toHaveValue("25")
        await expect.poll(() => instance.formControl.value).toBe(25)
      })
    },
  },
]

describe("NumberInput", () => {
  runTests(testCases)
})
