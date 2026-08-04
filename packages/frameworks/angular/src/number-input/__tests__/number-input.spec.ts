import {Component, Directive, output, signal} from "@angular/core"
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms"
import {render} from "@testing-library/angular"
import {describe, expect, test, vi} from "vitest"
import {page, userEvent} from "vitest/browser"

import {requiredNumberValidator} from "@qualcomm-ui/angular-core/number-input"
import {
  NumberInputModule,
  type UnitOption,
} from "@qualcomm-ui/angular/number-input"
import type {
  NumberInputValueChangeDetails,
  NumberInputValueInvalidDetails,
} from "@qualcomm-ui/core/number-input"

import {type MultiComponentTest, runTests} from "~test-utils"

const demoLabel = "Demo Label"
const demoHint = "Optional hint"
const demoErrorText = "Value must be between 2 and 10"
const unitOptions: UnitOption[] = [
  {displayText: "$ (USD)", label: "$", value: "USD"},
  {displayText: "€ (EUR)", label: "€", value: "EUR"},
]

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
    simple() {
      @Component({
        imports: [NumberInputModule],
        template: `
          <q-number-input [aria-label]="inputLabel" />
        `,
      })
      class SimpleComponent {
        protected readonly inputLabel = "Amount"
      }
      return SimpleComponent
    },
    testCase(component) {
      test(`simple component applies aria-label to the input — ${component.name}`, async () => {
        await render(component)

        await expect
          .element(page.getByRole("spinbutton", {name: "Amount"}))
          .toBeVisible()
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
  {
    composite() {
      @Component({
        imports: [NumberInputModule],
        template: `
          <div invalid q-number-input-root>
            <label q-number-input-label>{{ demoLabel }}</label>
            <div q-number-input-input-group>
              <input q-number-input-input />
              <div q-number-input-control></div>
              <span q-number-input-error-indicator></span>
            </div>
            <div q-number-input-error-text>{{ demoErrorText }}</div>
          </div>
        `,
      })
      class CompositeComponent {
        protected readonly demoLabel = demoLabel
        protected readonly demoErrorText = demoErrorText
      }
      return CompositeComponent
    },
    simple() {
      @Component({
        imports: [NumberInputModule],
        template: `
          <q-number-input
            invalid
            [errorText]="demoErrorText"
            [label]="demoLabel"
          />
        `,
      })
      class SimpleComponent {
        protected readonly demoLabel = demoLabel
        protected readonly demoErrorText = demoErrorText
      }
      return SimpleComponent
    },
    testCase(component) {
      test(`manual invalid state shows error text and aria-invalid — ${component.name}`, async () => {
        await render(component)

        await expect
          .element(page.getByLabelText(demoLabel))
          .toHaveAttribute("aria-invalid", "true")
        await expect.element(page.getByText(demoErrorText)).toBeVisible()
      })
    },
  },
  {
    composite() {
      @Component({
        imports: [NumberInputModule],
        template: `
          <div defaultValue="5" q-number-input-root>
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
          <q-number-input defaultValue="5" [label]="demoLabel" />
        `,
      })
      class SimpleComponent {
        protected readonly demoLabel = demoLabel
      }
      return SimpleComponent
    },
    testCase(component) {
      test(`arrow keys increment and decrement the value — ${component.name}`, async () => {
        await render(component)

        const input = page.getByLabelText(demoLabel)
        await input.click()

        await userEvent.keyboard("{ArrowUp}")
        await expect.element(input).toHaveValue("6")

        await userEvent.keyboard("{ArrowDown}")
        await expect.element(input).toHaveValue("5")
      })
    },
  },
  {
    composite() {
      @Component({
        imports: [NumberInputModule],
        template: `
          <div defaultValue="5" max="10" min="2" q-number-input-root>
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
          <q-number-input
            defaultValue="5"
            max="10"
            min="2"
            [label]="demoLabel"
          />
        `,
      })
      class SimpleComponent {
        protected readonly demoLabel = demoLabel
      }
      return SimpleComponent
    },
    testCase(component) {
      test(`home and end keys move the value to range boundaries — ${component.name}`, async () => {
        await render(component)

        const input = page.getByLabelText(demoLabel)
        await input.click()

        await userEvent.keyboard("{Home}")
        await expect.element(input).toHaveValue("2")

        await userEvent.keyboard("{End}")
        await expect.element(input).toHaveValue("10")
      })
    },
  },
  {
    composite() {
      @Component({
        imports: [NumberInputModule],
        template: `
          <div defaultValue="5" max="10" min="2" q-number-input-root>
            <label q-number-input-label>{{ demoLabel }}</label>
            <div q-number-input-input-group>
              <input q-number-input-input />
              <div q-number-input-control></div>
            </div>
            <div q-number-input-error-text>{{ demoErrorText }}</div>
          </div>
          <button type="button">Blur target</button>
        `,
      })
      class CompositeComponent {
        protected readonly demoLabel = demoLabel
        protected readonly demoErrorText = demoErrorText
      }
      return CompositeComponent
    },
    simple() {
      @Component({
        imports: [NumberInputModule],
        template: `
          <q-number-input
            defaultValue="5"
            max="10"
            min="2"
            [errorText]="demoErrorText"
            [label]="demoLabel"
          />
          <button type="button">Blur target</button>
        `,
      })
      class SimpleComponent {
        protected readonly demoLabel = demoLabel
        protected readonly demoErrorText = demoErrorText
      }
      return SimpleComponent
    },
    testCase(component) {
      test(`out-of-range typed values clamp to the nearest boundary on blur — ${component.name}`, async () => {
        await render(component)

        const input = page.getByLabelText(demoLabel)
        await input.fill("99")

        await expect.element(input).toHaveAttribute("aria-invalid", "true")

        await page.getByRole("button", {name: "Blur target"}).click()
        await expect.element(input).toHaveValue("10")
        await expect.element(page.getByText(demoErrorText)).not.toBeVisible()
      })
    },
  },
  {
    composite() {
      @Component({
        imports: [NumberInputModule],
        template: `
          <div
            allowOverflow
            defaultValue="5"
            max="10"
            min="2"
            q-number-input-root
            (valueInvalid)="isInvalid.emit($event)"
          >
            <label q-number-input-label>{{ demoLabel }}</label>
            <div q-number-input-input-group>
              <input q-number-input-input />
              <div q-number-input-control></div>
            </div>
          </div>
          <button type="button">Blur target</button>
        `,
      })
      class CompositeComponent {
        protected readonly demoLabel = demoLabel
        protected readonly isInvalid = output<NumberInputValueInvalidDetails>()
      }
      return CompositeComponent
    },
    simple() {
      @Component({
        imports: [NumberInputModule],
        template: `
          <q-number-input
            allowOverflow
            defaultValue="5"
            max="10"
            min="2"
            [label]="demoLabel"
            (valueInvalid)="isInvalid.emit($event)"
          />
          <button type="button">Blur target</button>
        `,
      })
      class SimpleComponent {
        protected readonly demoLabel = demoLabel
        protected readonly isInvalid = output<NumberInputValueInvalidDetails>()
      }
      return SimpleComponent
    },
    testCase(component) {
      test(`valueInvalid reports the range reason when overflow is allowed — ${component.name}`, async () => {
        const invalidSpy = vi.fn()
        await render(component, {
          on: {
            isInvalid: invalidSpy,
          },
        })

        const input = page.getByLabelText(demoLabel)
        await input.fill("1")
        await page.getByRole("button", {name: "Blur target"}).click()

        await expect.element(input).toHaveValue("1")
        await expect
          .poll(() => invalidSpy)
          .toHaveBeenCalledWith({
            reason: "rangeUnderflow",
            value: "1",
            valueAsNumber: 1,
          })
      })
    },
  },
  {
    composite() {
      @Component({
        imports: [NumberInputModule],
        template: `
          <div
            defaultValue="4"
            q-number-input-root
            step="2"
            [translations]="{
              incrementLabel: 'Increment',
              decrementLabel: 'Decrement',
            }"
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
        changed = output<NumberInputValueChangeDetails>()
      }
      return CompositeComponent
    },
    simple() {
      @Component({
        imports: [NumberInputModule],
        template: `
          <q-number-input
            defaultValue="4"
            step="2"
            [label]="demoLabel"
            [translations]="{
              incrementLabel: 'Increment',
              decrementLabel: 'Decrement',
            }"
            (valueChanged)="changed.emit($event)"
          />
        `,
      })
      class SimpleComponent {
        protected readonly demoLabel = demoLabel
        changed = output<NumberInputValueChangeDetails>()
      }
      return SimpleComponent
    },
    testCase(component) {
      test(`valueChanged emits parsed details from triggers and typing — ${component.name}`, async () => {
        const changedSpy = vi.fn()
        await render(component, {
          on: {
            changed: changedSpy,
          },
        })

        const input = page.getByLabelText(demoLabel)

        await page.getByRole("button", {name: "Increment"}).click()
        await expect
          .poll(() => changedSpy)
          .toHaveBeenCalledWith({
            value: "6",
            valueAsNumber: 6,
          })

        await input.fill("12.5")
        await expect
          .poll(() => changedSpy)
          .toHaveBeenLastCalledWith({
            value: "12.5",
            valueAsNumber: 12.5,
          })
      })
    },
  },
  {
    composite() {
      @Component({
        imports: [NumberInputModule],
        template: `
          <div
            defaultUnit="USD"
            defaultValue="0"
            q-number-input-root
            [unitOptions]="unitOptions"
            (unitChanged)="selectedUnit.set($event)"
          >
            <label q-number-input-label>{{ demoLabel }}</label>
            <div q-number-input-input-group>
              <q-number-input-unit-select />
              <input q-number-input-input />
              <div q-number-input-control></div>
            </div>
          </div>
          <output
            aria-label="selected unit"
            class="text-neutral-primary m-4 block"
          >
            {{ selectedUnit() }}
          </output>
        `,
      })
      class CompositeComponent {
        protected readonly demoLabel = demoLabel
        protected readonly unitOptions = unitOptions
        readonly selectedUnit = signal("USD")
      }
      return CompositeComponent
    },
    simple() {
      @Component({
        imports: [NumberInputModule],
        template: `
          <q-number-input
            defaultUnit="USD"
            defaultValue="0"
            [label]="demoLabel"
            [unitOptions]="unitOptions"
            (unitChanged)="selectedUnit.set($event)"
          />
          <output
            aria-label="selected unit"
            class="text-neutral-primary m-4 block"
          >
            {{ selectedUnit() }}
          </output>
        `,
      })
      class SimpleComponent {
        protected readonly demoLabel = demoLabel
        protected readonly unitOptions = unitOptions
        readonly selectedUnit = signal("USD")
      }
      return SimpleComponent
    },
    testCase(component) {
      test(`unit selector shows the default unit and emits selection changes — ${component.name}`, async () => {
        await render(component)

        const unitTrigger = page.getByRole("button").filter({hasText: "$"})
        await expect.element(unitTrigger).toBeVisible()

        await unitTrigger.click()
        await page.getByRole("menuitemradio", {name: "€ (EUR)"}).click()

        await expect
          .element(page.getByRole("button").filter({hasText: "€"}))
          .toBeVisible()
        await expect
          .element(page.getByLabelText("selected unit"))
          .toHaveTextContent("EUR")
      })
    },
  },
  {
    composite() {
      @Component({
        imports: [NumberInputModule],
        template: `
          <div
            defaultUnit="USD"
            q-number-input-root
            readOnly
            [unitOptions]="unitOptions"
          >
            <label q-number-input-label>{{ demoLabel }}</label>
            <div q-number-input-input-group>
              <q-number-input-unit-select />
              <input q-number-input-input />
              <div q-number-input-control></div>
            </div>
          </div>
        `,
      })
      class CompositeComponent {
        protected readonly demoLabel = demoLabel
        protected readonly unitOptions = unitOptions
      }
      return CompositeComponent
    },
    simple() {
      @Component({
        imports: [NumberInputModule],
        template: `
          <q-number-input
            defaultUnit="USD"
            readOnly
            [label]="demoLabel"
            [unitOptions]="unitOptions"
          />
        `,
      })
      class SimpleComponent {
        protected readonly demoLabel = demoLabel
        protected readonly unitOptions = unitOptions
      }
      return SimpleComponent
    },
    testCase(component) {
      test(`read-only state disables the unit selector — ${component.name}`, async () => {
        await render(component)

        await expect
          .element(page.getByRole("button").filter({hasText: "$"}))
          .toBeDisabled()
      })
    },
  },
  {
    composite() {
      @Component({
        imports: [NumberInputModule],
        template: `
          <form (reset)="handleReset()" (submit)="handleSubmit($event)">
            <div defaultValue="2" name="quantity" q-number-input-root>
              <label q-number-input-label>{{ demoLabel }}</label>
              <div q-number-input-input-group>
                <input q-number-input-input />
                <div q-number-input-control></div>
              </div>
            </div>
            <button type="submit">Submit form</button>
            <button type="reset">Reset form</button>
          </form>
          <output
            aria-label="submitted value"
            class="text-neutral-primary m-4 block"
          >
            {{ submittedValue() }}
          </output>
        `,
      })
      class CompositeComponent {
        protected readonly demoLabel = demoLabel
        readonly submittedValue = signal<string | null>(null)

        handleSubmit(event: SubmitEvent) {
          event.preventDefault()
          this.submittedValue.set(
            new FormData(event.currentTarget as HTMLFormElement).get(
              "quantity",
            ) as string | null,
          )
        }

        handleReset() {
          this.submittedValue.set(null)
        }
      }
      return CompositeComponent
    },
    simple() {
      @Component({
        imports: [NumberInputModule],
        template: `
          <form (reset)="handleReset()" (submit)="handleSubmit($event)">
            <q-number-input
              defaultValue="2"
              name="quantity"
              [label]="demoLabel"
            />
            <button type="submit">Submit form</button>
            <button type="reset">Reset form</button>
          </form>
          <output
            aria-label="submitted value"
            class="text-neutral-primary m-4 block"
          >
            {{ submittedValue() }}
          </output>
        `,
      })
      class SimpleComponent {
        protected readonly demoLabel = demoLabel
        readonly submittedValue = signal<string | null>(null)

        handleSubmit(event: SubmitEvent) {
          event.preventDefault()
          this.submittedValue.set(
            new FormData(event.currentTarget as HTMLFormElement).get(
              "quantity",
            ) as string | null,
          )
        }

        handleReset() {
          this.submittedValue.set(null)
        }
      }
      return SimpleComponent
    },
    testCase(component) {
      test(`native form submission uses the current value and reset restores the default — ${component.name}`, async () => {
        await render(component)

        const input = page.getByLabelText(demoLabel)
        await input.fill("9")
        await page.getByRole("button", {name: "Submit form"}).click()
        await expect
          .element(page.getByLabelText("submitted value"))
          .toHaveTextContent("9")

        await page.getByRole("button", {name: "Reset form"}).click()
        await expect.element(input).toHaveValue("2")
        await expect
          .element(page.getByLabelText("submitted value"))
          .toHaveTextContent("")
      })
    },
  },
]

describe("NumberInput", () => {
  runTests(testCases)
})
