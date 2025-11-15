import {Component, output, signal} from "@angular/core"
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

import {PasswordInputModule} from "@qualcomm-ui/angular/password-input"

import {type MultiComponentTest, runTests} from "~test-utils"

const demoLabel = "Enter your password"
const demoHint = "Optional hint"

const testCases: MultiComponentTest[] = [
  {
    composite() {
      @Component({
        imports: [PasswordInputModule],
        template: `
          <div class="w-72" q-password-input-root>
            <label q-password-input-label>
              {{ label }}
            </label>
            <div q-password-input-input-group>
              <input placeholder="Placeholder text" q-password-input-input />
              <button q-password-input-clear-trigger></button>
              <button q-password-input-visibility-trigger></button>
              <span q-password-input-error-indicator></span>
            </div>
            <span q-password-input-hint>{{ demoHint }}</span>
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
        imports: [PasswordInputModule],
        template: `
          <q-password-input
            class="w-72"
            clearable
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
        await input.fill("SecurePass123!")

        expect(input).toHaveValue("SecurePass123!")
      })
    },
  },
  () => {
    const errorText = "Password is required"
    return {
      composite() {
        @Component({
          imports: [PasswordInputModule, ReactiveFormsModule],
          template: `
            <form [formGroup]="form">
              <div
                formControlName="password"
                q-password-input-root
                [invalid]="isFieldInvalid('password')"
              >
                <label q-password-input-label>Enter your password</label>
                <div q-password-input-input-group>
                  <input placeholder="Enter password" q-password-input-input />
                  <button q-password-input-clear-trigger></button>
                  <button q-password-input-visibility-trigger></button>
                  <span q-password-input-error-indicator></span>
                </div>
                <div q-password-input-error-text>{{ errorText }}</div>
              </div>
            </form>
          `,
        })
        class CompositeComponent {
          protected readonly errorText = errorText
          form = new FormGroup({
            password: new FormControl("", {
              updateOn: "blur",
              validators: [Validators.required, Validators.minLength(8)],
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
          imports: [PasswordInputModule, ReactiveFormsModule],
          template: `
            <form [formGroup]="form">
              <q-password-input
                clearable
                label="Enter your password"
                placeholder="Enter password"
                [errorText]="errorText"
                [formControl]="passwordControl"
              />
            </form>
          `,
        })
        class SimpleComponent {
          protected readonly errorText = errorText

          form = new FormGroup({
            password: new FormControl("", {
              updateOn: "blur",
              validators: [Validators.required, Validators.minLength(8)],
            }),
          })

          get passwordControl() {
            return this.form.get("password") as FormControl
          }
        }
        return SimpleComponent
      },
      testCase(component) {
        test(`integrates with reactive forms — ${component.name}`, async () => {
          await render(component)

          const input = page.getByLabelText("Enter your password")

          await expect.element(page.getByText(errorText)).not.toBeVisible()

          await userEvent.click(input)
          await userEvent.tab()

          await expect.element(page.getByText(errorText)).toBeVisible()

          await userEvent.type(input, "SecurePass123!")
          await userEvent.tab()

          await expect.element(page.getByText(errorText)).not.toBeVisible()
        })
      },
    }
  },
  () => {
    const text = {
      action: "Update Password",
      error: "Password is required",
      label: "Password Field",
    }
    return {
      composite() {
        @Component({
          imports: [PasswordInputModule, FormsModule],
          template: `
            <form #formRef="ngForm">
              <div
                name="password"
                q-password-input-root
                required
                [(ngModel)]="password"
              >
                <label q-password-input-label>{{ text.label }}</label>
                <div q-password-input-input-group>
                  <input q-password-input-input />
                  <button q-password-input-clear-trigger></button>
                  <button q-password-input-visibility-trigger></button>
                  <span q-password-input-error-indicator></span>
                </div>
                <div q-password-input-error-text>{{ text.error }}</div>
              </div>
              <button type="button" (click)="updatePassword()">
                {{ text.action }}
              </button>
            </form>
          `,
        })
        class CompositeComponent {
          protected readonly text = text

          readonly password = signal("")

          updatePassword() {
            this.password.set("UpdatedPassword123!")
          }
        }
        return CompositeComponent
      },
      simple() {
        @Component({
          imports: [PasswordInputModule, FormsModule],
          template: `
            <form #formRef="ngForm">
              <q-password-input
                clearable
                name="password"
                required
                [errorText]="text.error"
                [label]="text.label"
                [(ngModel)]="password"
              />
              <button type="button" (click)="updatePassword()">
                {{ text.action }}
              </button>
            </form>
          `,
        })
        class SimpleComponent {
          protected readonly text = text

          readonly password = signal("")

          updatePassword() {
            this.password.set("UpdatedPassword123!")
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
          await userEvent.type(input, "validpassword")

          await expect.element(page.getByText(text.error)).not.toBeVisible()
        })

        test(`updates programmatically via UI interaction — ${component.name}`, async () => {
          await render(component)

          const input = page.getByLabelText(text.label)
          const updateButton = page.getByText(text.action)

          await userEvent.click(updateButton)

          await expect.element(input).toHaveValue("UpdatedPassword123!")
        })
      },
    }
  },
  {
    composite() {
      @Component({
        imports: [PasswordInputModule],
        template: `
          <div q-password-input-root size="sm">
            <label q-password-input-label>Small Input</label>
            <div q-password-input-input-group>
              <input q-password-input-input />
              <button q-password-input-clear-trigger></button>
              <button q-password-input-visibility-trigger></button>
              <span q-password-input-error-indicator></span>
            </div>
          </div>
          <div q-password-input-root size="md">
            <label q-password-input-label>Medium Input</label>
            <div q-password-input-input-group>
              <input q-password-input-input />
              <button q-password-input-clear-trigger></button>
              <button q-password-input-visibility-trigger></button>
              <span q-password-input-error-indicator></span>
            </div>
          </div>
          <div q-password-input-root size="lg">
            <label q-password-input-label>Large Input</label>
            <div q-password-input-input-group>
              <input q-password-input-input />
              <button q-password-input-clear-trigger></button>
              <button q-password-input-visibility-trigger></button>
              <span q-password-input-error-indicator></span>
            </div>
          </div>
        `,
      })
      class CompositeComponent {}
      return CompositeComponent
    },
    simple() {
      @Component({
        imports: [PasswordInputModule],
        template: `
          <q-password-input clearable label="Small Input" size="sm" />
          <q-password-input clearable label="Medium Input" size="md" />
          <q-password-input clearable label="Large Input" size="lg" />
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
        imports: [PasswordInputModule],
        template: `
          <div disabled q-password-input-root>
            <label q-password-input-label>Disabled Input</label>
            <div q-password-input-input-group>
              <input q-password-input-input />
              <button q-password-input-clear-trigger></button>
              <button q-password-input-visibility-trigger></button>
              <span q-password-input-error-indicator></span>
            </div>
          </div>
          <div defaultValue="ReadOnlyPass123!" q-password-input-root readOnly>
            <label q-password-input-label>Read Only Input</label>
            <div q-password-input-input-group>
              <input q-password-input-input />
              <button q-password-input-clear-trigger></button>
              <button q-password-input-visibility-trigger></button>
              <span q-password-input-error-indicator></span>
            </div>
          </div>
        `,
      })
      class CompositeComponent {}
      return CompositeComponent
    },
    simple() {
      @Component({
        imports: [PasswordInputModule],
        template: `
          <q-password-input clearable disabled label="Disabled Input" />
          <q-password-input
            clearable
            defaultValue="ReadOnlyPass123!"
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
        await expect.element(readonlyInput).toHaveValue("ReadOnlyPass123!")

        // Try to type in disabled input (should not work)
        await userEvent.type(disabledInput, "test")
        await expect.element(disabledInput).toHaveValue("")

        // Try to type in readonly input (should not work)
        await userEvent.type(readonlyInput, "test")
        await expect.element(readonlyInput).toHaveValue("ReadOnlyPass123!")
      })
    },
  },
  {
    composite() {
      @Component({
        imports: [PasswordInputModule, ReactiveFormsModule],
        template: `
          <div
            q-password-input-root
            [formControl]="formControl"
            (valueChanged)="changed.emit($event)"
          >
            <label q-password-input-label>{{ demoLabel }}</label>
            <div q-password-input-input-group>
              <input q-password-input-input />
              <button q-password-input-clear-trigger></button>
              <button q-password-input-visibility-trigger></button>
              <span q-password-input-error-indicator></span>
            </div>
          </div>
        `,
      })
      class CompositeComponent {
        protected readonly demoLabel = demoLabel
        formControl = new FormControl("InitialPass!")

        changed = output<string>()
      }
      return CompositeComponent
    },
    simple() {
      @Component({
        imports: [PasswordInputModule, ReactiveFormsModule],
        template: `
          <q-password-input
            clearable
            [formControl]="formControl"
            [label]="demoLabel"
            (valueChanged)="changed.emit($event)"
          />
        `,
      })
      class SimpleComponent {
        protected readonly demoLabel = demoLabel
        formControl = new FormControl("InitialPass!")

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
        await expect.element(input).toHaveValue("InitialPass!")

        await userEvent.clear(input)
        await userEvent.type(input, "UpdatedPass!")

        await expect.poll(() => instance.formControl.value).toBe("UpdatedPass!")
      })
    },
  },
  {
    composite() {
      @Component({
        imports: [PasswordInputModule, ReactiveFormsModule],
        template: `
          <div q-password-input-root [formControl]="formControl">
            <label q-password-input-label>{{ demoLabel }}</label>
            <div q-password-input-input-group>
              <input q-password-input-input />
              <button q-password-input-clear-trigger></button>
              <button q-password-input-visibility-trigger></button>
              <span q-password-input-error-indicator></span>
            </div>
          </div>
          <button
            data-test-id="set-value"
            (click)="setValue('ProgrammaticPass!')"
          >
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
        imports: [PasswordInputModule, ReactiveFormsModule],
        template: `
          <q-password-input
            clearable
            [formControl]="formControl"
            [label]="demoLabel"
          />
          <button
            data-test-id="set-value"
            (click)="setValue('ProgrammaticPass!')"
          >
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
        await expect.element(input).toHaveValue("ProgrammaticPass!")
      })
    },
  },
  {
    composite() {
      @Component({
        imports: [PasswordInputModule, ReactiveFormsModule],
        template: `
          <form [formGroup]="form">
            <div formControlName="password" q-password-input-root>
              <label q-password-input-label>Enter your password</label>
              <div q-password-input-input-group>
                <input q-password-input-input />
                <button q-password-input-clear-trigger></button>
                <button q-password-input-visibility-trigger></button>
                <span q-password-input-error-indicator></span>
              </div>
            </div>
            <button type="button" (click)="resetForm()">Reset</button>
          </form>
        `,
      })
      class CompositeComponent {
        form = new FormGroup({
          password: new FormControl("InitialPass123!"),
        })

        resetForm() {
          this.form.reset()
          this.form.get("password")?.setValue("")
        }
      }
      return CompositeComponent
    },
    simple() {
      @Component({
        imports: [PasswordInputModule, ReactiveFormsModule],
        template: `
          <form [formGroup]="form">
            <q-password-input
              clearable
              formControlName="password"
              label="Enter your password"
            />
            <button type="button" (click)="resetForm()">Reset</button>
          </form>
        `,
      })
      class SimpleComponent {
        form = new FormGroup({
          password: new FormControl("InitialPass123!"),
        })

        resetForm() {
          this.form.reset()
          this.form.get("password")?.setValue("")
        }
      }
      return SimpleComponent
    },
    testCase(component) {
      test(`form reset — ${component.name}`, async () => {
        await render(component)

        const input = page.getByLabelText("Enter your password")
        await expect.element(input).toHaveValue("InitialPass123!")

        await userEvent.clear(input)
        await userEvent.type(input, "NewPass456!")
        await expect.element(input).toHaveValue("NewPass456!")

        await userEvent.click(page.getByText("Reset"))
        await expect.element(input).toHaveValue("")
      })
    },
  },
  {
    composite() {
      @Component({
        imports: [PasswordInputModule, ReactiveFormsModule],
        template: `
          <button autofocus>focus target</button>
          <div q-password-input-root [formControl]="formControl">
            <label q-password-input-label>{{ demoLabel }}</label>
            <div q-password-input-input-group>
              <input q-password-input-input />
              <button q-password-input-clear-trigger></button>
              <button q-password-input-visibility-trigger></button>
              <span q-password-input-error-indicator></span>
            </div>
            <div q-password-input-error-text>Required</div>
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
        imports: [PasswordInputModule, ReactiveFormsModule],
        template: `
          <button autofocus>focus target</button>
          <q-password-input
            clearable
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
        await userEvent.type(input, "ValidPass123!")
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
        imports: [PasswordInputModule, ReactiveFormsModule],
        template: `
          <div q-password-input-root [formControl]="formControl">
            <label q-password-input-label>{{ demoLabel }}</label>
            <div q-password-input-input-group>
              <input q-password-input-input />
              <button q-password-input-clear-trigger></button>
              <button q-password-input-visibility-trigger></button>
              <span q-password-input-error-indicator></span>
            </div>
          </div>
        `,
      })
      class CompositeComponent {
        protected readonly demoLabel = demoLabel
        formControl = new FormControl({
          disabled: true,
          value: "DisabledPass123!",
        })
      }
      return CompositeComponent
    },
    simple() {
      @Component({
        imports: [PasswordInputModule, ReactiveFormsModule],
        template: `
          <q-password-input
            clearable
            [formControl]="formControl"
            [label]="demoLabel"
          />
        `,
      })
      class SimpleComponent {
        protected readonly demoLabel = demoLabel
        formControl = new FormControl({
          disabled: true,
          value: "DisabledPass123!",
        })
      }
      return SimpleComponent
    },
    testCase(component) {
      test(`reactive forms: disabled form control — ${component.name}`, async () => {
        const {fixture} = await render(component)
        const instance = fixture.componentInstance

        const input = page.getByLabelText(demoLabel)
        await expect.element(input).toBeDisabled()
        await expect.element(input).toHaveValue("DisabledPass123!")

        await userEvent.type(input, "more text")
        await expect.element(input).toHaveValue("DisabledPass123!")

        instance.formControl.enable()
        fixture.detectChanges()

        await expect.element(input).not.toBeDisabled()

        await userEvent.clear(input)
        await userEvent.type(input, "EnabledPass456!")
        await expect.element(input).toHaveValue("EnabledPass456!")
      })
    },
  },
  {
    composite() {
      @Component({
        imports: [PasswordInputModule, FormsModule],
        template: `
          <div disabled q-password-input-root [(ngModel)]="value">
            <label q-password-input-label>{{ demoLabel }}</label>
            <div q-password-input-input-group>
              <input q-password-input-input />
              <button q-password-input-clear-trigger></button>
              <button q-password-input-visibility-trigger></button>
              <span q-password-input-error-indicator></span>
            </div>
          </div>
        `,
      })
      class CompositeComponent {
        protected readonly demoLabel = demoLabel
        readonly value = signal("DisabledValue123!")
      }
      return CompositeComponent
    },
    simple() {
      @Component({
        imports: [PasswordInputModule, FormsModule],
        template: `
          <q-password-input
            clearable
            disabled
            [label]="demoLabel"
            [(ngModel)]="value"
          />
        `,
      })
      class SimpleComponent {
        protected readonly demoLabel = demoLabel
        readonly value = signal("DisabledValue123!")
      }
      return SimpleComponent
    },
    testCase(component) {
      test(`template forms: disabled — ${component.name}`, async () => {
        await render(component)

        const input = page.getByLabelText(demoLabel)
        await expect.element(input).toBeDisabled()
        await expect.element(input).toHaveValue("DisabledValue123!")

        await userEvent.type(input, "more text")
        await expect.element(input).toHaveValue("DisabledValue123!")
      })
    },
  },
  {
    composite() {
      @Component({
        imports: [PasswordInputModule, FormsModule],
        template: `
          <div q-password-input-root readOnly [(ngModel)]="value">
            <label q-password-input-label>{{ demoLabel }}</label>
            <div q-password-input-input-group>
              <input q-password-input-input />
              <button q-password-input-clear-trigger></button>
              <button q-password-input-visibility-trigger></button>
              <span q-password-input-error-indicator></span>
            </div>
          </div>
          <output class="text-neutral-primary m-4 block">
            {{ value() }}
          </output>
        `,
      })
      class CompositeComponent {
        protected readonly demoLabel = demoLabel
        readonly value = signal("ReadOnlyValue123!")
      }
      return CompositeComponent
    },
    simple() {
      @Component({
        imports: [PasswordInputModule, FormsModule],
        template: `
          <q-password-input
            clearable
            readOnly
            [label]="demoLabel"
            [(ngModel)]="value"
          />
          <output class="text-neutral-primary m-4 block">
            {{ value() }}
          </output>
        `,
      })
      class SimpleComponent {
        protected readonly demoLabel = demoLabel
        readonly value = signal("ReadOnlyValue123!")
      }
      return SimpleComponent
    },
    testCase(component) {
      test(`template forms: read-only — ${component.name}`, async () => {
        await render(component)
        const input = page.getByLabelText(demoLabel)
        await expect.element(input).toHaveAttribute("readonly")
        await expect.element(input).toHaveValue("ReadOnlyValue123!")

        await userEvent.type(input, "more text")
        await expect.element(input).toHaveValue("ReadOnlyValue123!")
        await expect
          .element(page.getByRole("status"))
          .toHaveTextContent("ReadOnlyValue123!")
      })
    },
  },
  {
    composite() {
      @Component({
        imports: [PasswordInputModule],
        template: `
          <div defaultValue="DefaultPass123!" q-password-input-root>
            <label q-password-input-label>{{ demoLabel }}</label>
            <div q-password-input-input-group>
              <input q-password-input-input />
              <button q-password-input-clear-trigger></button>
              <button q-password-input-visibility-trigger></button>
              <span q-password-input-error-indicator></span>
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
        imports: [PasswordInputModule],
        template: `
          <q-password-input
            clearable
            defaultValue="DefaultPass123!"
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
      test(`default value — ${component.name}`, async () => {
        await render(component)

        await expect
          .element(page.getByLabelText(demoLabel))
          .toHaveValue("DefaultPass123!")
      })
    },
  },
  {
    composite() {
      @Component({
        imports: [PasswordInputModule],
        template: `
          <div defaultValue="MyPassword!" q-password-input-root>
            <label q-password-input-label>{{ demoLabel }}</label>
            <div q-password-input-input-group>
              <input q-password-input-input />
              <button q-password-input-clear-trigger></button>
              <button q-password-input-visibility-trigger></button>
              <span q-password-input-error-indicator></span>
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
        imports: [PasswordInputModule],
        template: `
          <q-password-input
            clearable
            defaultValue="MyPassword!"
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
      test(`password starts hidden — ${component.name}`, async () => {
        await render(component)

        const input = page.getByLabelText(demoLabel)
        expect(input).toHaveAttribute("type", "password")
      })

      test(`visibility toggle functionality — ${component.name}`, async () => {
        await render(component)

        const input = page.getByLabelText(demoLabel)

        await expect.element(input).toHaveAttribute("type", "password")

        await page.getByRole("button", {name: "Show password"}).click()
        await expect.element(input).toHaveAttribute("type", "text")

        await page.getByRole("button", {name: "Hide password"}).click()
        await expect.element(input).toHaveAttribute("type", "password")
      })
    },
  },
  {
    composite() {
      @Component({
        imports: [PasswordInputModule, ReactiveFormsModule],
        template: `
          <div
            defaultValue="ClearablePassword!"
            q-password-input-root
            [formControl]="formControl"
          >
            <label q-password-input-label>{{ demoLabel }}</label>
            <div q-password-input-input-group>
              <input q-password-input-input />
              <button q-password-input-clear-trigger></button>
              <button q-password-input-visibility-trigger></button>
              <span q-password-input-error-indicator></span>
            </div>
          </div>
        `,
      })
      class CompositeComponent {
        protected readonly demoLabel = demoLabel
        formControl = new FormControl("")
      }
      return CompositeComponent
    },
    simple() {
      @Component({
        imports: [PasswordInputModule, ReactiveFormsModule],
        template: `
          <q-password-input
            clearable
            defaultValue="ClearablePassword!"
            [formControl]="formControl"
            [label]="demoLabel"
          />
        `,
      })
      class SimpleComponent {
        protected readonly demoLabel = demoLabel
        formControl = new FormControl("")
      }
      return SimpleComponent
    },
    testCase(component) {
      test(`clearable button functionality — ${component.name}`, async () => {
        await render(component)

        const input = page.getByLabelText(demoLabel)
        await userEvent.type(input, "TestPassword123!")
        await expect.element(input).toHaveValue("TestPassword123!")

        const clearButton = page.getByRole("button", {name: /Clear input/i})
        await userEvent.click(clearButton, {force: true})

        await expect.element(input).toHaveValue("")
      })

      test(`clearable with reactive forms — ${component.name}`, async () => {
        const {fixture} = await render(component)
        const instance = fixture.componentInstance

        const input = page.getByLabelText(demoLabel)
        await userEvent.type(input, "FormPassword456!")
        await expect.element(input).toHaveValue("FormPassword456!")

        const clearButton = page.getByRole("button", {name: /Clear input/i})
        await userEvent.click(clearButton, {force: true})

        await expect.element(input).toHaveValue("")
        await expect.poll(() => instance.formControl.value).toBe("")
      })
    },
  },
]

describe("PasswordInput", () => {
  runTests(testCases)
})
