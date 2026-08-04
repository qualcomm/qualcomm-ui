import {Component, input, output, signal} from "@angular/core"
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms"
import {render} from "@testing-library/angular"
import {describe, expect, test} from "vitest"
import {page, userEvent} from "vitest/browser"

import {TextAreaModule} from "@qualcomm-ui/angular/text-area"
import type {Direction} from "@qualcomm-ui/utils/direction"

import {type MultiComponentTest, runTests} from "~test-utils"

const demoLabel = "Demo Label"
const demoPlaceholder = "Enter text here"
const demoHint = "This is a helpful hint"
const demoErrorText = "This field is required"

const testIds = {
  counter: "text-area-counter",
  errorText: "text-area-error-text",
  focusTarget: "focus-target",
  hint: "text-area-hint",
  input: "text-area-input",
  label: "text-area-label",
  root: "text-area-root",
} as const

async function clickFocusTarget() {
  return page.getByTestId(testIds.focusTarget).click()
}

// a short helper that makes TS happy
function $(container: Element, selector: string) {
  return container.querySelector<HTMLElement>(selector)
}

@Component({
  imports: [TextAreaModule],
  template: `
    <button type="button" [attr.data-test-id]="testIds.focusTarget">
      Focus target
    </button>
    <q-text-area
      [attr.data-test-id]="testIds.root"
      [counter]="counter()"
      [defaultValue]="defaultValue()"
      [dir]="dir()"
      [disabled]="disabled()"
      [errorText]="errorText()"
      [hint]="hint()"
      [invalid]="invalid()"
      [label]="label()"
      [maxLength]="maxLength()"
      [name]="name()"
      [placeholder]="placeholder()"
      [readOnly]="readOnly()"
      [required]="required()"
      [size]="size()"
      (valueChanged)="valueChanged.emit($event)"
    />
  `,
})
class SimpleTextAreaComponent {
  readonly testIds = testIds

  readonly counter = input<boolean | undefined>(undefined)
  readonly defaultValue = input<string | undefined>(undefined)
  readonly dir = input<Direction | undefined>(undefined)
  readonly disabled = input<boolean | undefined>(undefined)
  readonly errorText = input<string | undefined>(undefined)
  readonly hint = input<string | undefined>(undefined)
  readonly invalid = input<boolean | undefined>(undefined)
  readonly label = input<string | undefined>(undefined)
  readonly maxLength = input<number | undefined>(undefined)
  readonly name = input<string | undefined>(undefined)
  readonly placeholder = input<string | undefined>(undefined)
  readonly readOnly = input<boolean | undefined>(undefined)
  readonly required = input<boolean | undefined>(undefined)
  readonly size = input<"sm" | "md" | "lg" | undefined>(undefined)

  readonly valueChanged = output<string>()
}

@Component({
  imports: [TextAreaModule],
  template: `
    <button type="button" [attr.data-test-id]="testIds.focusTarget">
      Focus target
    </button>
    <div
      q-text-area-root
      [attr.data-test-id]="testIds.root"
      [defaultValue]="defaultValue()"
      [dir]="dir()"
      [disabled]="disabled()"
      [invalid]="invalid()"
      [maxLength]="maxLength()"
      [name]="name()"
      [readOnly]="readOnly()"
      [required]="required()"
      [size]="size()"
      (valueChanged)="valueChanged.emit($event)"
    >
      @if (label()) {
        <label q-text-area-label [attr.data-test-id]="testIds.label">
          {{ label() }}
        </label>
      }
      @if (counter() ?? maxLength() !== undefined) {
        <div q-text-area-counter [attr.data-test-id]="testIds.counter"></div>
      }
      <textarea
        q-text-area-input
        [attr.data-test-id]="testIds.input"
        [maxLength]="maxLength()"
        [placeholder]="placeholder()"
      ></textarea>
      @if (hint()) {
        <span q-text-area-hint [attr.data-test-id]="testIds.hint">
          {{ hint() }}
        </span>
      }
      @if (errorText()) {
        <div q-text-area-error-text [attr.data-test-id]="testIds.errorText">
          {{ errorText() }}
        </div>
      }
    </div>
  `,
})
class CompositeTextAreaComponent {
  readonly testIds = testIds

  readonly counter = input<boolean | undefined>(undefined)
  readonly defaultValue = input<string | undefined>(undefined)
  readonly dir = input<string | undefined>(undefined)
  readonly disabled = input<boolean | undefined>(undefined)
  readonly errorText = input<string | undefined>(undefined)
  readonly hint = input<string | undefined>(undefined)
  readonly invalid = input<boolean | undefined>(undefined)
  readonly label = input<string | undefined>(undefined)
  readonly maxLength = input<number | undefined>(undefined)
  readonly name = input<string | undefined>(undefined)
  readonly placeholder = input<string | undefined>(undefined)
  readonly readOnly = input<boolean | undefined>(undefined)
  readonly required = input<boolean | undefined>(undefined)
  readonly size = input<"sm" | "md" | "lg" | undefined>(undefined)

  readonly valueChanged = output<string>()
}

const tests: MultiComponentTest[] = [
  {
    composite: () => CompositeTextAreaComponent,
    simple: () => SimpleTextAreaComponent,
    testCase(component) {
      test(`label association and focus - ${component.name}`, async () => {
        const {container} = await render(component, {
          inputs: {label: demoLabel, placeholder: demoPlaceholder},
        })

        const label =
          component === SimpleTextAreaComponent
            ? $(container, '[data-text-area-part="label"]')
            : page.getByTestId(testIds.label)
        const input =
          component === SimpleTextAreaComponent
            ? $(container, "textarea")
            : page.getByTestId(testIds.input)

        await expect.element(label).toBeVisible()
        await expect.element(label).toHaveTextContent(demoLabel)
        await label?.click()
        await expect.element(input).toHaveFocus()
        await expect
          .element(input)
          .toHaveAttribute("placeholder", demoPlaceholder)
      })
    },
  },
  {
    composite: () => CompositeTextAreaComponent,
    simple: () => SimpleTextAreaComponent,
    testCase(component) {
      test(`hint text display - ${component.name}`, async () => {
        const {container} = await render(component, {
          inputs: {hint: demoHint, label: demoLabel},
        })

        const hint =
          component === SimpleTextAreaComponent
            ? $(container, '[data-text-area-part="hint"]')
            : page.getByTestId(testIds.hint)

        await expect.element(hint).toBeVisible()
        await expect.element(hint).toHaveTextContent(demoHint)
      })
    },
  },
  {
    composite: () => CompositeTextAreaComponent,
    simple: () => SimpleTextAreaComponent,
    testCase(component) {
      test(`hint hidden when invalid - ${component.name}`, async () => {
        const {container} = await render(component, {
          inputs: {hint: demoHint, invalid: true, label: demoLabel},
        })

        const hint =
          component === SimpleTextAreaComponent
            ? $(container, '[data-text-area-part="hint"]')
            : page.getByTestId(testIds.hint)

        await expect.element(hint).not.toBeVisible()
      })
    },
  },
  {
    composite: () => CompositeTextAreaComponent,
    simple: () => SimpleTextAreaComponent,
    testCase(component) {
      test(`error state and error text - ${component.name}`, async () => {
        const {container} = await render(component, {
          inputs: {errorText: demoErrorText, invalid: true, label: demoLabel},
        })

        const errorText =
          component === SimpleTextAreaComponent
            ? $(container, '[data-text-area-part="error-text"]')
            : page.getByTestId(testIds.errorText)
        const input =
          component === SimpleTextAreaComponent
            ? $(container, "textarea")
            : page.getByTestId(testIds.input)

        await expect.element(errorText).toBeVisible()
        await expect.element(errorText).toHaveTextContent(demoErrorText)
        await expect.element(input).toHaveAttribute("aria-invalid", "true")
      })
    },
  },
  {
    composite: () => CompositeTextAreaComponent,
    simple: () => SimpleTextAreaComponent,
    testCase(component) {
      test(`error text hidden when not invalid - ${component.name}`, async () => {
        const {container} = await render(component, {
          inputs: {errorText: demoErrorText, label: demoLabel},
        })

        const errorText =
          component === SimpleTextAreaComponent
            ? $(container, '[data-text-area-part="error-text"]')
            : page.getByTestId(testIds.errorText)

        await expect.element(errorText).not.toBeVisible()
      })
    },
  },
  {
    composite: () => CompositeTextAreaComponent,
    simple: () => SimpleTextAreaComponent,
    testCase(component) {
      test(`disabled state - ${component.name}`, async () => {
        const {container} = await render(component, {
          inputs: {disabled: true, label: demoLabel},
        })

        const root =
          component === SimpleTextAreaComponent
            ? $(container, '[data-text-area-part="root"]')
            : page.getByTestId(testIds.root)
        const input =
          component === SimpleTextAreaComponent
            ? $(container, "textarea")
            : page.getByTestId(testIds.input)

        await expect.element(input).toBeDisabled()
        await expect.element(root).toHaveAttribute("data-disabled")
      })
    },
  },
  {
    composite: () => CompositeTextAreaComponent,
    simple: () => SimpleTextAreaComponent,
    testCase(component) {
      test(`required state - ${component.name}`, async () => {
        const {container} = await render(component, {
          inputs: {label: demoLabel, required: true},
        })

        const input =
          component === SimpleTextAreaComponent
            ? $(container, "textarea")
            : page.getByTestId(testIds.input)

        await expect.element(input).toBeRequired()
      })
    },
  },
  {
    composite: () => CompositeTextAreaComponent,
    simple: () => SimpleTextAreaComponent,
    testCase(component) {
      test(`read-only state - ${component.name}`, async () => {
        const {container} = await render(component, {
          inputs: {
            defaultValue: "Read only value",
            label: demoLabel,
            readOnly: true,
          },
        })

        const input =
          component === SimpleTextAreaComponent
            ? $(container, "textarea")
            : page.getByTestId(testIds.input)

        await expect.element(input).toHaveAttribute("readonly")
        await expect.element(input).toHaveValue("Read only value")

        await userEvent.type(input!, "extra text")
        await expect.element(input).toHaveValue("Read only value")
      })
    },
  },
  {
    composite: () => CompositeTextAreaComponent,
    simple: () => SimpleTextAreaComponent,
    testCase(component) {
      test(`RTL direction - ${component.name}`, async () => {
        const {container} = await render(component, {
          inputs: {dir: "rtl", label: demoLabel},
        })

        const root =
          component === SimpleTextAreaComponent
            ? $(container, '[data-text-area-part="root"]')
            : page.getByTestId(testIds.root)

        await expect.element(root).toHaveAttribute("dir", "rtl")
      })
    },
  },
]

const counterTests: MultiComponentTest[] = [
  {
    composite: () => CompositeTextAreaComponent,
    simple: () => SimpleTextAreaComponent,
    testCase(component) {
      test(`counter shows current/max with maxLength - ${component.name}`, async () => {
        const {container} = await render(component, {
          inputs: {defaultValue: "Hello", label: demoLabel, maxLength: 100},
        })

        const counter =
          component === SimpleTextAreaComponent
            ? $(container, '[data-text-area-part="counter"]')
            : page.getByTestId(testIds.counter)

        await expect.element(counter).toBeVisible()
        await expect.element(counter).toHaveTextContent("5/100")
      })
    },
  },
  {
    composite: () => CompositeTextAreaComponent,
    simple: () => SimpleTextAreaComponent,
    testCase(component) {
      test(`counter shows count only without maxLength - ${component.name}`, async () => {
        const {container} = await render(component, {
          inputs: {counter: true, defaultValue: "Hello", label: demoLabel},
        })

        const counter =
          component === SimpleTextAreaComponent
            ? $(container, '[data-text-area-part="counter"]')
            : page.getByTestId(testIds.counter)

        await expect.element(counter).toBeVisible()
        await expect.element(counter).toHaveTextContent("5")
      })
    },
  },
  {
    composite: () => CompositeTextAreaComponent,
    simple: () => SimpleTextAreaComponent,
    testCase(component) {
      test(`counter hidden when counter=false - ${component.name}`, async () => {
        const {container} = await render(component, {
          inputs: {counter: false, label: demoLabel, maxLength: 100},
        })

        const counter =
          component === SimpleTextAreaComponent
            ? $(container, '[data-text-area-part="counter"]')
            : page.getByTestId(testIds.counter)

        if (component === SimpleTextAreaComponent) {
          expect(counter).toBeNull()
        } else {
          await expect.element(counter).not.toBeInTheDocument()
        }
      })
    },
  },
  {
    composite: () => CompositeTextAreaComponent,
    simple: () => SimpleTextAreaComponent,
    testCase(component) {
      test(`counter updates as user types - ${component.name}`, async () => {
        const {container} = await render(component, {
          inputs: {label: demoLabel, maxLength: 50},
        })

        const counter =
          component === SimpleTextAreaComponent
            ? $(container, '[data-text-area-part="counter"]')
            : page.getByTestId(testIds.counter)
        const input =
          component === SimpleTextAreaComponent
            ? $(container, "textarea")
            : page.getByTestId(testIds.input)

        await expect.element(counter).toHaveTextContent("0/50")
        await userEvent.type(input!, "Test")
        await expect.element(counter).toHaveTextContent("4/50")
      })
    },
  },
]

const keyboardTests: MultiComponentTest[] = [
  {
    composite: () => CompositeTextAreaComponent,
    simple: () => SimpleTextAreaComponent,
    testCase(component) {
      test(`tab focuses input - ${component.name}`, async () => {
        const {container} = await render(component, {
          inputs: {label: demoLabel},
        })

        await clickFocusTarget()
        await userEvent.tab()

        const input =
          component === SimpleTextAreaComponent
            ? $(container, "textarea")
            : page.getByTestId(testIds.input)

        await expect.element(input).toHaveFocus()
      })
    },
  },
  {
    composite: () => CompositeTextAreaComponent,
    simple: () => SimpleTextAreaComponent,
    testCase(component) {
      test(`multiline input - ${component.name}`, async () => {
        const {container} = await render(component, {
          inputs: {label: demoLabel},
        })

        const input =
          component === SimpleTextAreaComponent
            ? $(container, "textarea")
            : page.getByTestId(testIds.input)

        await userEvent.type(input!, "Line 1{Enter}Line 2{Enter}Line 3")
        await expect.element(input).toHaveValue("Line 1\nLine 2\nLine 3")
      })
    },
  },
]

const formTests: MultiComponentTest[] = [
  () => ({
    composite() {
      @Component({
        imports: [TextAreaModule, ReactiveFormsModule],
        template: `
          <button data-test-id="focus-target" type="button">
            Focus target
          </button>
          <div
            q-text-area-root
            [formControl]="formControl"
            [invalid]="formControl.invalid && formControl.touched"
          >
            <label q-text-area-label>{{ label }}</label>
            <textarea q-text-area-input></textarea>
            <div q-text-area-error-text>Required</div>
          </div>
          <output data-test-id="touched">{{ formControl.touched }}</output>
          <output data-test-id="dirty">{{ formControl.dirty }}</output>
          <output data-test-id="valid">{{ formControl.valid }}</output>
        `,
      })
      class CompositeComponent {
        protected readonly label = demoLabel
        formControl = new FormControl("", [Validators.required])
      }
      return CompositeComponent
    },
    simple() {
      @Component({
        imports: [TextAreaModule, ReactiveFormsModule],
        template: `
          <button data-test-id="focus-target" type="button">
            Focus target
          </button>
          <q-text-area
            errorText="Required"
            [formControl]="formControl"
            [label]="label"
          />
          <output data-test-id="touched">{{ formControl.touched }}</output>
          <output data-test-id="dirty">{{ formControl.dirty }}</output>
          <output data-test-id="valid">{{ formControl.valid }}</output>
        `,
      })
      class SimpleComponent {
        protected readonly label = demoLabel
        formControl = new FormControl("", [Validators.required])
      }
      return SimpleComponent
    },
    testCase(component) {
      test(`reactive forms validation states - ${component.name}`, async () => {
        await render(component)

        await expect
          .element(page.getByTestId("touched"))
          .toHaveTextContent("false")
        await expect
          .element(page.getByTestId("dirty"))
          .toHaveTextContent("false")
        await expect
          .element(page.getByTestId("valid"))
          .toHaveTextContent("false")

        await clickFocusTarget()
        await userEvent.tab()
        await clickFocusTarget()

        await expect
          .element(page.getByTestId("touched"))
          .toHaveTextContent("true")

        const input = page.getByLabelText(demoLabel)
        await userEvent.type(input, "valid text")

        await expect
          .element(page.getByTestId("dirty"))
          .toHaveTextContent("true")
        await expect
          .element(page.getByTestId("valid"))
          .toHaveTextContent("true")
      })
    },
  }),
  () => ({
    composite() {
      @Component({
        imports: [TextAreaModule, ReactiveFormsModule],
        template: `
          <div q-text-area-root [formControl]="formControl">
            <label q-text-area-label>{{ label }}</label>
            <textarea q-text-area-input></textarea>
          </div>
          <button data-test-id="set-value" (click)="setValue('programmatic')">
            Set Value
          </button>
        `,
      })
      class CompositeComponent {
        protected readonly label = demoLabel
        formControl = new FormControl("")

        setValue(value: string) {
          this.formControl.setValue(value)
        }
      }
      return CompositeComponent
    },
    simple() {
      @Component({
        imports: [TextAreaModule, ReactiveFormsModule],
        template: `
          <q-text-area [formControl]="formControl" [label]="label" />
          <button data-test-id="set-value" (click)="setValue('programmatic')">
            Set Value
          </button>
        `,
      })
      class SimpleComponent {
        protected readonly label = demoLabel
        formControl = new FormControl("")

        setValue(value: string) {
          this.formControl.setValue(value)
        }
      }
      return SimpleComponent
    },
    testCase(component) {
      test(`programmatic value changes - ${component.name}`, async () => {
        await render(component)

        const input = page.getByLabelText(demoLabel)
        await expect.element(input).toHaveValue("")

        await userEvent.click(page.getByTestId("set-value"))
        await expect.element(input).toHaveValue("programmatic")
      })
    },
  }),
  () => ({
    composite() {
      @Component({
        imports: [TextAreaModule, FormsModule],
        template: `
          <div q-text-area-root [(ngModel)]="value">
            <label q-text-area-label>{{ label }}</label>
            <textarea q-text-area-input></textarea>
          </div>
          <button data-test-id="update-btn" (click)="value.set('updated')">
            Update
          </button>
          <output data-test-id="output">{{ value() }}</output>
        `,
      })
      class CompositeComponent {
        protected readonly label = demoLabel
        readonly value = signal("initial")
      }
      return CompositeComponent
    },
    simple() {
      @Component({
        imports: [TextAreaModule, FormsModule],
        template: `
          <q-text-area [label]="label" [(ngModel)]="value" />
          <button data-test-id="update-btn" (click)="value.set('updated')">
            Update
          </button>
          <output data-test-id="output">{{ value() }}</output>
        `,
      })
      class SimpleComponent {
        protected readonly label = demoLabel
        readonly value = signal("initial")
      }
      return SimpleComponent
    },
    testCase(component) {
      test(`template-driven forms two-way binding - ${component.name}`, async () => {
        await render(component)

        const input = page.getByLabelText(demoLabel)
        await expect.element(input).toHaveValue("initial")

        await userEvent.click(page.getByTestId("update-btn"))
        await expect.element(input).toHaveValue("updated")

        await userEvent.clear(input)
        await userEvent.type(input, "typed value")
        await expect
          .element(page.getByTestId("output"))
          .toHaveTextContent("typed value")
      })
    },
  }),
  () => ({
    composite() {
      @Component({
        imports: [TextAreaModule, ReactiveFormsModule],
        template: `
          <div q-text-area-root [formControl]="formControl">
            <label q-text-area-label>{{ label }}</label>
            <textarea q-text-area-input></textarea>
          </div>
        `,
      })
      class CompositeComponent {
        protected readonly label = demoLabel
        formControl = new FormControl({disabled: true, value: "disabled text"})
      }
      return CompositeComponent
    },
    simple() {
      @Component({
        imports: [TextAreaModule, ReactiveFormsModule],
        template: `
          <q-text-area [formControl]="formControl" [label]="label" />
        `,
      })
      class SimpleComponent {
        protected readonly label = demoLabel
        formControl = new FormControl({disabled: true, value: "disabled text"})
      }
      return SimpleComponent
    },
    testCase(component) {
      test(`reactive forms disabled form control - ${component.name}`, async () => {
        const {fixture} = await render(component)
        const instance = fixture.componentInstance

        const input = page.getByLabelText(demoLabel)
        await expect.element(input).toBeDisabled()
        await expect.element(input).toHaveValue("disabled text")

        instance.formControl.enable()
        fixture.detectChanges()

        await expect.element(input).not.toBeDisabled()
      })
    },
  }),
  () => ({
    composite() {
      @Component({
        imports: [TextAreaModule],
        template: `
          <div q-text-area-root (valueChanged)="onValueChanged($event)">
            <label q-text-area-label>{{ label }}</label>
            <textarea q-text-area-input></textarea>
          </div>
        `,
      })
      class CompositeComponent {
        protected readonly label = demoLabel
        values: string[] = []

        onValueChanged(value: string) {
          this.values.push(value)
        }
      }
      return CompositeComponent
    },
    simple() {
      @Component({
        imports: [TextAreaModule],
        template: `
          <q-text-area
            [label]="label"
            (valueChanged)="onValueChanged($event)"
          />
        `,
      })
      class SimpleComponent {
        protected readonly label = demoLabel
        values: string[] = []

        onValueChanged(value: string) {
          this.values.push(value)
        }
      }
      return SimpleComponent
    },
    testCase(component) {
      test(`valueChanged event - ${component.name}`, async () => {
        const {fixture} = await render(component)
        const instance = fixture.componentInstance

        const input = page.getByLabelText(demoLabel)
        await userEvent.type(input, "test")

        await expect.poll(() => instance.values.at(-1)).toBe("test")
      })
    },
  }),
]

describe("TextArea", () => {
  runTests(tests)
  runTests(counterTests)
  runTests(keyboardTests)
  runTests(formTests)
})
