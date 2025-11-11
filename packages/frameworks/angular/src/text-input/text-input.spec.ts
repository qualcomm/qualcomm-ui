import {Component, output, signal} from "@angular/core"
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

import {TextInputModule} from "@qualcomm-ui/angular/text-input"

import {type MultiComponentTest, runTests} from "~test-utils"

const demoLabel = "Demo Label"
const demoHint = "Optional hint"

const testCases: MultiComponentTest[] = [
  {
    composite() {
      @Component({
        imports: [TextInputModule],
        template: `
          <div class="w-72" q-text-input-root>
            <label q-text-input-label>
              {{ label }}
            </label>
            <div q-text-input-input-group>
              <input placeholder="Placeholder text" q-text-input-input />
            </div>
            <span q-text-input-hint>{{ demoHint }}</span>
          </div>
        `,
      })
      class CompositeComponent {
        protected readonly label = demoLabel
        protected readonly demoHint = demoHint
      }
      return CompositeComponent
    },
    simple() {
      @Component({
        imports: [TextInputModule],
        template: `
          <q-text-input
            class="w-72"
            placeholder="Placeholder text"
            [hint]="demoHint"
            [label]="label"
          />
        `,
      })
      class SimpleComponent {
        protected readonly label = demoLabel
        protected readonly demoHint = demoHint
      }
      return SimpleComponent
    },
    testCase(component) {
      test(`renders with label and hint — ${component.name}`, async () => {
        await render(component)

        expect(page.getByText(demoLabel)).toBeVisible()
        expect(page.getByText("Optional hint")).toBeVisible()
        expect(page.getByLabelText(demoLabel)).toHaveAttribute(
          "placeholder",
          "Placeholder text",
        )
      })

      test(`accepts user input — ${component.name}`, async () => {
        await render(component)

        const input = page.getByLabelText(demoLabel)
        await userEvent.type(input, "Hello World")

        expect(input).toHaveValue("Hello World")
      })
    },
  },
  () => {
    const errorText = "Email is required"
    return {
      composite() {
        @Component({
          imports: [TextInputModule, ReactiveFormsModule],
          template: `
            <form [formGroup]="form">
              <div
                formControlName="email"
                q-text-input-root
                [invalid]="isFieldInvalid('email')"
              >
                <label q-text-input-label>Email</label>
                <div q-text-input-input-group>
                  <input placeholder="Enter email" q-text-input-input />
                </div>
                <div q-text-input-error-text>{{ errorText }}</div>
              </div>
            </form>
          `,
        })
        class CompositeComponent {
          protected readonly errorText = errorText
          form = new FormGroup({
            email: new FormControl("", {
              updateOn: "blur",
              validators: [Validators.required, Validators.email],
            }),
          })

          isFieldInvalid(fieldName: string): boolean {
            const field = this.form.get(fieldName)
            return !!(field && field.invalid && (field.dirty || field.touched))
          }
        }
        return CompositeComponent
      },
      simple() {
        @Component({
          imports: [TextInputModule, ReactiveFormsModule],
          template: `
            <form [formGroup]="form">
              <q-text-input
                label="Email"
                placeholder="Enter email"
                [errorText]="errorText"
                [formControl]="emailControl"
              />
            </form>
          `,
        })
        class SimpleComponent {
          protected readonly errorText = errorText

          form = new FormGroup({
            email: new FormControl("", {
              updateOn: "blur",
              validators: [Validators.required, Validators.email],
            }),
          })

          get emailControl() {
            return this.form.get("email") as FormControl
          }
        }
        return SimpleComponent
      },
      testCase(component) {
        test(`integrates with reactive forms — ${component.name}`, async () => {
          await render(component)

          const input = page.getByLabelText("Email")

          await expect.element(page.getByText(errorText)).not.toBeVisible()

          await userEvent.click(input)
          await userEvent.tab()

          await expect.element(page.getByText(errorText)).toBeVisible()

          await userEvent.type(input, "test@example.com")
          await userEvent.tab()

          await expect.element(page.getByText(errorText)).not.toBeVisible()
        })
      },
    }
  },
  () => {
    const text = {
      action: "Update Username",
      error: "Username is required",
      label: "Username Field",
    }
    return {
      composite() {
        @Component({
          imports: [TextInputModule, FormsModule],
          template: `
            <form #formRef="ngForm">
              <div
                name="username"
                q-text-input-root
                required
                [(ngModel)]="username"
              >
                <label q-text-input-label>{{ text.label }}</label>
                <div q-text-input-input-group>
                  <input q-text-input-input />
                </div>
                <div q-text-input-error-text>{{ text.error }}</div>
              </div>
              <button type="button" (click)="updateUsername()">
                {{ text.action }}
              </button>
            </form>
          `,
        })
        class CompositeComponent {
          protected readonly text = text

          readonly username = signal("")

          updateUsername() {
            this.username.set("updated-username")
          }
        }
        return CompositeComponent
      },
      simple() {
        @Component({
          imports: [TextInputModule, FormsModule],
          template: `
            <form #formRef="ngForm">
              <q-text-input
                name="username"
                required
                [errorText]="text.error"
                [label]="text.label"
                [(ngModel)]="username"
              />
              <button type="button" (click)="updateUsername()">
                {{ text.action }}
              </button>
            </form>
          `,
        })
        class SimpleComponent {
          protected readonly text = text

          readonly username = signal("")

          updateUsername() {
            this.username.set("updated-username")
          }
        }
        return SimpleComponent
      },
      testCase(component) {
        test(`integrates with template-driven forms — ${component.name}`, async () => {
          await render(component)

          const input = page.getByLabelText(text.label)

          // Enter and clear input to trigger validation
          await userEvent.type(input, "test")
          await userEvent.clear(input)
          await userEvent.tab()

          await expect.element(page.getByText(text.label)).toBeVisible()

          // Enter valid input
          await userEvent.type(input, "validuser")

          await expect.element(page.getByText(text.error)).not.toBeVisible()
        })

        test(`updates programmatically via UI interaction — ${component.name}`, async () => {
          await render(component)

          const input = page.getByLabelText(text.label)
          const updateButton = page.getByText(text.action)

          await userEvent.click(updateButton)

          await expect.element(input).toHaveValue("updated-username")
        })
      },
    }
  },
  {
    composite() {
      @Component({
        imports: [TextInputModule],
        template: `
          <div q-text-input-root size="sm">
            <label q-text-input-label>Small Input</label>
            <div q-text-input-input-group>
              <input q-text-input-input />
            </div>
          </div>
          <div q-text-input-root size="md">
            <label q-text-input-label>Medium Input</label>
            <div q-text-input-input-group>
              <input q-text-input-input />
            </div>
          </div>
          <div q-text-input-root size="lg">
            <label q-text-input-label>Large Input</label>
            <div q-text-input-input-group>
              <input q-text-input-input />
            </div>
          </div>
        `,
      })
      class CompositeComponent {}
      return CompositeComponent
    },
    simple() {
      @Component({
        imports: [TextInputModule],
        template: `
          <q-text-input label="Small Input" size="sm" />
          <q-text-input label="Medium Input" size="md" />
          <q-text-input label="Large Input" size="lg" />
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
        imports: [TextInputModule],
        template: `
          <div disabled q-text-input-root>
            <label q-text-input-label>Disabled Input</label>
            <div q-text-input-input-group>
              <input q-text-input-input />
            </div>
          </div>
          <div defaultValue="Read only value" q-text-input-root readOnly>
            <label q-text-input-label>Read Only Input</label>
            <div q-text-input-input-group>
              <input q-text-input-input />
            </div>
          </div>
        `,
      })
      class CompositeComponent {}
      return CompositeComponent
    },
    simple() {
      @Component({
        imports: [TextInputModule],
        template: `
          <q-text-input disabled label="Disabled Input" />
          <q-text-input
            defaultValue="Read only value"
            label="Read Only Input"
            readOnly
          />
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
        await expect.element(readonlyInput).toHaveValue("Read only value")

        // Try to type in disabled input (should not work)
        await userEvent.type(disabledInput, "test")
        await expect.element(disabledInput).toHaveValue("")

        // Try to type in readonly input (should not work)
        await userEvent.type(readonlyInput, "test")
        await expect.element(readonlyInput).toHaveValue("Read only value")
      })
    },
  },
  {
    composite() {
      @Component({
        imports: [TextInputModule, ReactiveFormsModule],
        template: `
          <div
            q-text-input-root
            [formControl]="formControl"
            (valueChanged)="changed.emit($event)"
          >
            <label q-text-input-label>{{ demoLabel }}</label>
            <div q-text-input-input-group>
              <input q-text-input-input />
            </div>
          </div>
        `,
      })
      class CompositeComponent {
        protected readonly demoLabel = demoLabel
        formControl = new FormControl("initial")

        changed = output<string>()
      }
      return CompositeComponent
    },
    simple() {
      @Component({
        imports: [TextInputModule, ReactiveFormsModule],
        template: `
          <q-text-input
            [formControl]="formControl"
            [label]="demoLabel"
            (valueChanged)="changed.emit($event)"
          />
        `,
      })
      class SimpleComponent {
        protected readonly demoLabel = demoLabel
        formControl = new FormControl("initial")

        changed = output<string>()
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
        await expect.element(input).toHaveValue("initial")

        await userEvent.clear(input)
        await userEvent.type(input, "updated text")

        await expect.poll(() => instance.formControl.value).toBe("updated text")
      })
    },
  },
  {
    composite() {
      @Component({
        imports: [TextInputModule, ReactiveFormsModule],
        template: `
          <div q-text-input-root [formControl]="formControl">
            <label q-text-input-label>{{ demoLabel }}</label>
            <div q-text-input-input-group>
              <input q-text-input-input />
            </div>
          </div>
          <button data-test-id="set-value" (click)="setValue('programmatic')">
            Set Value
          </button>
        `,
      })
      class CompositeComponent {
        protected readonly demoLabel = demoLabel
        formControl = new FormControl("")

        setValue(value: string) {
          this.formControl.setValue(value)
        }
      }
      return CompositeComponent
    },
    simple() {
      @Component({
        imports: [TextInputModule, ReactiveFormsModule],
        template: `
          <q-text-input [formControl]="formControl" [label]="demoLabel" />
          <button data-test-id="set-value" (click)="setValue('programmatic')">
            Set Value
          </button>
        `,
      })
      class SimpleComponent {
        protected readonly demoLabel = demoLabel
        formControl = new FormControl("")

        setValue(value: string) {
          this.formControl.setValue(value)
        }
      }
      return SimpleComponent
    },
    testCase(component) {
      test(`programmatic value changes — ${component.name}`, async () => {
        await render(component)

        const input = page.getByLabelText(demoLabel)
        await expect.element(input).toHaveValue("")

        await userEvent.click(page.getByTestId("set-value"))
        await expect.element(input).toHaveValue("programmatic")
      })
    },
  },
  {
    composite() {
      @Component({
        imports: [TextInputModule, ReactiveFormsModule],
        template: `
          <form [formGroup]="form">
            <div formControlName="username" q-text-input-root>
              <label q-text-input-label>Username</label>
              <div q-text-input-input-group>
                <input q-text-input-input />
              </div>
            </div>
            <button type="button" (click)="resetForm()">Reset</button>
          </form>
        `,
      })
      class CompositeComponent {
        form = new FormGroup({
          username: new FormControl("john_doe"),
        })

        resetForm() {
          this.form.reset()
          this.form.get("username")?.setValue("")
        }
      }
      return CompositeComponent
    },
    simple() {
      @Component({
        imports: [TextInputModule, ReactiveFormsModule],
        template: `
          <form [formGroup]="form">
            <q-text-input formControlName="username" label="Username" />
            <button type="button" (click)="resetForm()">Reset</button>
          </form>
        `,
      })
      class SimpleComponent {
        form = new FormGroup({
          username: new FormControl("john_doe"),
        })

        resetForm() {
          this.form.reset()
          this.form.get("username")?.setValue("")
        }
      }
      return SimpleComponent
    },
    testCase(component) {
      test(`form reset — ${component.name}`, async () => {
        await render(component)

        const input = page.getByLabelText("Username")
        await expect.element(input).toHaveValue("john_doe")

        await userEvent.clear(input)
        await userEvent.type(input, "jane_smith")
        await expect.element(input).toHaveValue("jane_smith")

        await userEvent.click(page.getByText("Reset"))
        await expect.element(input).toHaveValue("")
      })
    },
  },
  {
    composite() {
      @Component({
        imports: [TextInputModule, ReactiveFormsModule],
        template: `
          <button autofocus>focus target</button>
          <div q-text-input-root [formControl]="formControl">
            <label q-text-input-label>{{ demoLabel }}</label>
            <div q-text-input-input-group>
              <input q-text-input-input />
            </div>
            <div q-text-input-error-text>Required</div>
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
        formControl = new FormControl("", [Validators.required])
      }
      return CompositeComponent
    },
    simple() {
      @Component({
        imports: [TextInputModule, ReactiveFormsModule],
        template: `
          <button autofocus>focus target</button>
          <q-text-input
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
        formControl = new FormControl("", [Validators.required])
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
        await userEvent.type(input, "valid text")
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
        imports: [TextInputModule, ReactiveFormsModule],
        template: `
          <div q-text-input-root [formControl]="formControl">
            <label q-text-input-label>{{ demoLabel }}</label>
            <div q-text-input-input-group>
              <input q-text-input-input />
            </div>
          </div>
        `,
      })
      class CompositeComponent {
        protected readonly demoLabel = demoLabel
        formControl = new FormControl({disabled: true, value: "disabled text"})
      }
      return CompositeComponent
    },
    simple() {
      @Component({
        imports: [TextInputModule, ReactiveFormsModule],
        template: `
          <q-text-input [formControl]="formControl" [label]="demoLabel" />
        `,
      })
      class SimpleComponent {
        protected readonly demoLabel = demoLabel
        formControl = new FormControl({disabled: true, value: "disabled text"})
      }
      return SimpleComponent
    },
    testCase(component) {
      test(`reactive forms: disabled form control — ${component.name}`, async () => {
        const {fixture} = await render(component)
        const instance = fixture.componentInstance

        const input = page.getByLabelText(demoLabel)
        await expect.element(input).toBeDisabled()
        await expect.element(input).toHaveValue("disabled text")

        await userEvent.type(input, "more text")
        await expect.element(input).toHaveValue("disabled text")

        instance.formControl.enable()
        fixture.detectChanges()

        await expect.element(input).not.toBeDisabled()

        await userEvent.clear(input)
        await userEvent.type(input, "enabled text")
        await expect.element(input).toHaveValue("enabled text")
      })
    },
  },
  {
    composite() {
      @Component({
        imports: [TextInputModule, FormsModule],
        template: `
          <div disabled q-text-input-root [(ngModel)]="value">
            <label q-text-input-label>{{ demoLabel }}</label>
            <div q-text-input-input-group>
              <input q-text-input-input />
            </div>
          </div>
        `,
      })
      class CompositeComponent {
        protected readonly demoLabel = demoLabel
        readonly value = signal("disabled value")
      }
      return CompositeComponent
    },
    simple() {
      @Component({
        imports: [TextInputModule, FormsModule],
        template: `
          <q-text-input disabled [label]="demoLabel" [(ngModel)]="value" />
        `,
      })
      class SimpleComponent {
        protected readonly demoLabel = demoLabel
        readonly value = signal("disabled value")
      }
      return SimpleComponent
    },
    testCase(component) {
      test(`template forms: disabled — ${component.name}`, async () => {
        await render(component)

        const input = page.getByLabelText(demoLabel)
        await expect.element(input).toBeDisabled()
        await expect.element(input).toHaveValue("disabled value")

        await userEvent.type(input, "more text")
        await expect.element(input).toHaveValue("disabled value")
      })
    },
  },
  {
    composite() {
      @Component({
        imports: [TextInputModule, FormsModule],
        template: `
          <div q-text-input-root readOnly [(ngModel)]="value">
            <label q-text-input-label>{{ demoLabel }}</label>
            <div q-text-input-input-group>
              <input q-text-input-input />
            </div>
          </div>
          <output class="text-neutral-primary m-4 block">
            {{ value() }}
          </output>
        `,
      })
      class CompositeComponent {
        protected readonly demoLabel = demoLabel
        readonly value = signal("readonly value")
      }
      return CompositeComponent
    },
    simple() {
      @Component({
        imports: [TextInputModule, FormsModule],
        template: `
          <q-text-input readOnly [label]="demoLabel" [(ngModel)]="value" />
          <output class="text-neutral-primary m-4 block">
            {{ value() }}
          </output>
        `,
      })
      class SimpleComponent {
        protected readonly demoLabel = demoLabel
        readonly value = signal("readonly value")
      }
      return SimpleComponent
    },
    testCase(component) {
      test(`template forms: read-only — ${component.name}`, async () => {
        await render(component)
        const input = page.getByLabelText(demoLabel)
        await expect.element(input).toHaveAttribute("readonly")
        await expect.element(input).toHaveValue("readonly value")

        await userEvent.type(input, "more text")
        await expect.element(input).toHaveValue("readonly value")
        await expect
          .element(page.getByRole("status"))
          .toHaveTextContent("readonly value")
      })
    },
  },
  {
    composite() {
      @Component({
        imports: [TextInputModule],
        template: `
          <div defaultValue="default text" q-text-input-root>
            <label q-text-input-label>{{ demoLabel }}</label>
            <div q-text-input-input-group>
              <input q-text-input-input />
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
        imports: [TextInputModule],
        template: `
          <q-text-input defaultValue="default text" [label]="demoLabel" />
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

        await expect
          .element(page.getByLabelText(demoLabel))
          .toHaveValue("default text")
      })
    },
  },
]

describe("TextInput", () => {
  runTests(testCases)
})
