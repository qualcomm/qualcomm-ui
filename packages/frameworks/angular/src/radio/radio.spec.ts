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

import {RadioModule} from "@qualcomm-ui/angular/radio"

import {type MultiComponentTest, runTests} from "~test-utils"

const groupLabel = "Group Label"
const demoLabel1 = "Option 1"
const demoLabel2 = "Option 2"

const labels = {
  demoLabel1,
  demoLabel2,
  groupLabel,
}

const testCases: MultiComponentTest[] = [
  {
    composite() {
      @Component({
        imports: [RadioModule],
        template: `
          <fieldset name="group" q-radio-group>
            <div q-radio-group-items>
              <label q-radio value="option1">
                <input q-radio-hidden-input />
                <div q-radio-control></div>
                <span q-radio-label>{{ labels.demoLabel1 }}</span>
              </label>
              <label q-radio value="option2">
                <input q-radio-hidden-input />
                <div q-radio-control></div>
                <span q-radio-label>{{ labels.demoLabel2 }}</span>
              </label>
            </div>
          </fieldset>
        `,
      })
      class CompositeComponent {
        protected readonly labels = labels
      }
      return CompositeComponent
    },
    simple() {
      @Component({
        imports: [RadioModule],
        template: `
          <fieldset name="group" q-radio-group>
            <div q-radio-group-items>
              <label label="${demoLabel1}" q-radio value="option1"></label>
              <label label="${demoLabel2}" q-radio value="option2"></label>
            </div>
          </fieldset>
        `,
      })
      class SimpleComponent {}
      return SimpleComponent
    },
    testCase(component) {
      test(`radio selection/deselection — ${component.name}`, async () => {
        await render(component)

        const radio1 = page.getByLabelText(demoLabel1)
        const radio2 = page.getByLabelText(demoLabel2)

        expect(radio1).not.toBeChecked()
        expect(radio2).not.toBeChecked()

        await userEvent.click(page.getByText(demoLabel1))
        expect(radio1).toBeChecked()
        expect(radio2).not.toBeChecked()

        await userEvent.click(page.getByText(demoLabel2))
        expect(radio1).not.toBeChecked()
        expect(radio2).toBeChecked()
      })
    },
  },
  {
    composite() {
      @Component({
        imports: [RadioModule],
        template: `
          <fieldset name="group" q-radio-group>
            <div q-radio-group-items>
              <label disabled q-radio value="option1">
                <input q-radio-hidden-input />
                <div q-radio-control></div>
                <span q-radio-label>{{ labels.demoLabel1 }}</span>
              </label>
              <label q-radio value="option2">
                <input q-radio-hidden-input />
                <div q-radio-control></div>
                <span q-radio-label>{{ labels.demoLabel2 }}</span>
              </label>
            </div>
          </fieldset>
        `,
      })
      class CompositeComponent {
        protected readonly labels = labels
      }
      return CompositeComponent
    },
    simple() {
      @Component({
        imports: [RadioModule],
        template: `
          <fieldset name="group" q-radio-group>
            <div q-radio-group-items>
              <label
                disabled
                label="${demoLabel1}"
                q-radio
                value="option1"
              ></label>
              <label label="${demoLabel2}" q-radio value="option2"></label>
            </div>
          </fieldset>
        `,
      })
      class SimpleComponent {}
      return SimpleComponent
    },
    testCase(component) {
      test(`disabled radio — ${component.name}`, async () => {
        await render(component)

        const radio1 = page.getByLabelText(demoLabel1)
        const radio2 = page.getByLabelText(demoLabel2)

        expect(radio1).toBeDisabled()
        expect(radio2).not.toBeDisabled()

        await userEvent.click(page.getByText(demoLabel2))
        expect(radio2).toBeChecked()
        expect(radio1).not.toBeChecked()
      })
    },
  },
  {
    composite() {
      @Component({
        imports: [RadioModule],
        template: `
          <fieldset name="group" q-radio-group>
            <div q-radio-group-items>
              <label q-radio value="option1">
                <input id="radio1" q-radio-hidden-input />
                <div q-radio-control></div>
                <span q-radio-label>{{ labels.demoLabel1 }}</span>
              </label>
              <label q-radio value="option2">
                <input id="radio2" q-radio-hidden-input />
                <div q-radio-control></div>
                <span q-radio-label>{{ labels.demoLabel2 }}</span>
              </label>
            </div>
          </fieldset>
        `,
      })
      class CompositeComponent {
        protected readonly labels = labels
      }
      return CompositeComponent
    },
    simple() {
      @Component({
        imports: [RadioModule],
        template: `
          <fieldset q-radio-group>
            <div q-radio-group-items>
              <label label="${demoLabel1}" q-radio value="option1">
                <input id="radio1" q-radio-hidden-input />
              </label>
              <label label="${demoLabel2}" q-radio value="option2">
                <input id="radio2" q-radio-hidden-input />
              </label>
            </div>
          </fieldset>
        `,
      })
      class SimpleComponent {}
      return SimpleComponent
    },
    testCase(component) {
      test(`controlled id — ${component.name}`, async () => {
        await render(component)

        expect(page.getByLabelText(demoLabel1)).toHaveAttribute("id", "radio1")
        expect(page.getByLabelText(demoLabel2)).toHaveAttribute("id", "radio2")
      })
    },
  },
  {
    composite() {
      @Component({
        imports: [RadioModule, ReactiveFormsModule],
        template: `
          <fieldset
            q-radio-group
            [formControl]="formControl"
            (valueChanged)="changed.emit($event)"
          >
            <div q-radio-group-items>
              <label q-radio value="option1">
                <input q-radio-hidden-input />
                <div q-radio-control></div>
                <span q-radio-label>{{ demoLabel1 }}</span>
              </label>
              <label q-radio value="option2">
                <input q-radio-hidden-input />
                <div q-radio-control></div>
                <span q-radio-label>{{ demoLabel2 }}</span>
              </label>
            </div>
          </fieldset>
        `,
      })
      class CompositeComponent {
        protected readonly demoLabel1 = demoLabel1
        protected readonly demoLabel2 = demoLabel2
        formControl = new FormControl("option1")
        changed = output<string>()
      }
      return CompositeComponent
    },
    simple() {
      @Component({
        imports: [RadioModule, ReactiveFormsModule],
        template: `
          <fieldset
            q-radio-group
            [formControl]="formControl"
            (valueChanged)="changed.emit($event)"
          >
            <div q-radio-group-items>
              <label label="${demoLabel1}" q-radio value="option1"></label>
              <label label="${demoLabel2}" q-radio value="option2"></label>
            </div>
          </fieldset>
        `,
      })
      class SimpleComponent {
        formControl = new FormControl("option1")
        changed = output<string>()
      }
      return SimpleComponent
    },
    testCase(component) {
      test(`reactive forms — ${component.name}`, async () => {
        const changeWatcher = vi.fn()
        await render(component, {
          on: {changed: (value) => changeWatcher(value)},
        })

        const radio1 = page.getByLabelText(demoLabel1)
        const radio2 = page.getByLabelText(demoLabel2)

        expect(radio1).toBeChecked()
        expect(radio2).not.toBeChecked()

        await userEvent.click(page.getByText(demoLabel2))
        await expect.element(radio2).toBeChecked()
        await expect.element(radio1).not.toBeChecked()
        expect(changeWatcher).toHaveBeenCalledWith("option2")

        await userEvent.click(page.getByText(demoLabel1))
        await expect.element(radio1).toBeChecked()
        await expect.element(radio2).not.toBeChecked()
        expect(changeWatcher).toHaveBeenLastCalledWith("option1")
      })
    },
  },
  {
    composite() {
      @Component({
        imports: [RadioModule, ReactiveFormsModule],
        template: `
          <fieldset q-radio-group [formControl]="formControl">
            <div q-radio-group-items>
              <label q-radio value="option1">
                <input q-radio-hidden-input />
                <div q-radio-control></div>
                <span q-radio-label>{{ labels.demoLabel1 }}</span>
              </label>
              <label q-radio value="option2">
                <input q-radio-hidden-input />
                <div q-radio-control></div>
                <span q-radio-label>{{ labels.demoLabel2 }}</span>
              </label>
            </div>
            <div q-radio-group-error-text>Please select an option</div>
          </fieldset>
        `,
      })
      class CompositeComponent {
        protected readonly labels = labels
        formControl = new FormControl("", Validators.required)
      }
      return CompositeComponent
    },
    simple() {
      @Component({
        imports: [RadioModule, ReactiveFormsModule],
        template: `
          <fieldset q-radio-group [formControl]="formControl">
            <div q-radio-group-items>
              <label label="${demoLabel1}" q-radio value="option1"></label>
              <label label="${demoLabel2}" q-radio value="option2"></label>
            </div>
            <div q-radio-group-error-text>Please select an option</div>
          </fieldset>
        `,
      })
      class SimpleComponent {
        formControl = new FormControl("", Validators.required)
      }
      return SimpleComponent
    },
    testCase(component) {
      test(`reactive forms: required / errors — ${component.name}`, async () => {
        const {fixture} = await render(component)
        const instance = fixture.componentInstance

        expect(page.getByText("Please select an option")).not.toBeVisible()

        instance.formControl.markAsTouched()
        fixture.detectChanges()

        await expect
          .element(page.getByText("Please select an option"))
          .toBeInTheDocument()

        await userEvent.click(page.getByText(demoLabel1))
        await expect
          .element(page.getByText("Please select an option"))
          .not.toBeVisible()
      })
    },
  },
  {
    composite() {
      @Component({
        imports: [RadioModule, ReactiveFormsModule],
        template: `
          <fieldset q-radio-group [formControl]="formControl">
            <div q-radio-group-items>
              <label q-radio value="option1">
                <input q-radio-hidden-input />
                <div q-radio-control></div>
                <span q-radio-label>{{ labels.demoLabel1 }}</span>
              </label>
              <label q-radio value="option2">
                <input q-radio-hidden-input />
                <div q-radio-control></div>
                <span q-radio-label>{{ labels.demoLabel2 }}</span>
              </label>
            </div>
          </fieldset>
        `,
      })
      class CompositeComponent {
        protected readonly labels = labels
        formControl = new FormControl({disabled: true, value: "option1"})
      }
      return CompositeComponent
    },
    simple() {
      @Component({
        imports: [RadioModule, ReactiveFormsModule],
        template: `
          <fieldset q-radio-group [formControl]="formControl">
            <div q-radio-group-items>
              <label label="${demoLabel1}" q-radio value="option1"></label>
              <label label="${demoLabel2}" q-radio value="option2"></label>
            </div>
          </fieldset>
        `,
      })
      class SimpleComponent {
        formControl = new FormControl({disabled: true, value: "option1"})
      }
      return SimpleComponent
    },
    testCase(component) {
      test(`reactive forms: disabled form control — ${component.name}`, async () => {
        const {fixture} = await render(component)
        const instance = fixture.componentInstance

        const radio1 = page.getByLabelText(demoLabel1)
        const radio2 = page.getByLabelText(demoLabel2)

        expect(radio1).toBeDisabled()
        expect(radio2).toBeDisabled()
        expect(radio1).toBeChecked()

        await userEvent.click(page.getByText(demoLabel2), {force: true})
        await expect.element(radio1).toBeChecked()
        expect(radio2).not.toBeChecked()

        instance.formControl.enable()
        fixture.detectChanges()

        await expect.element(radio1).not.toBeDisabled()
        await expect.element(radio2).not.toBeDisabled()

        await userEvent.click(page.getByText(demoLabel2))
        await expect.element(radio2).toBeChecked()
        expect(radio1).not.toBeChecked()
      })
    },
  },
  {
    composite() {
      @Component({
        imports: [RadioModule, ReactiveFormsModule],
        template: `
          <div
            q-radio-group
            [formControl]="formControl"
            (valueChanged)="changed.emit($event)"
          >
            <label q-radio value="option1">
              <input q-radio-hidden-input />
              <div q-radio-control></div>
              <span q-radio-label>{{ labels.demoLabel1 }}</span>
            </label>
            <label q-radio value="option2">
              <input q-radio-hidden-input />
              <div q-radio-control></div>
              <span q-radio-label>{{ labels.demoLabel2 }}</span>
            </label>
          </div>
          <button data-test-id="set-option1" (click)="setValue('option1')">
            Set Option 1
          </button>
          <button data-test-id="set-option2" (click)="setValue('option2')">
            Set Option 2
          </button>
        `,
      })
      class CompositeComponent {
        protected readonly labels = labels
        formControl = new FormControl("")
        changed = output<string>()

        setValue(value: string) {
          this.formControl.setValue(value)
        }
      }
      return CompositeComponent
    },
    simple() {
      @Component({
        imports: [RadioModule, ReactiveFormsModule],
        template: `
          <div
            q-radio-group
            [formControl]="formControl"
            (valueChanged)="changed.emit($event)"
          >
            <label label="${demoLabel1}" q-radio value="option1"></label>
            <label label="${demoLabel2}" q-radio value="option2"></label>
          </div>
          <button data-test-id="set-option1" (click)="setValue('option1')">
            Set Option 1
          </button>
          <button data-test-id="set-option2" (click)="setValue('option2')">
            Set Option 2
          </button>
        `,
      })
      class SimpleComponent {
        formControl = new FormControl("")
        changed = output<string>()

        setValue(value: string) {
          this.formControl.setValue(value)
        }
      }
      return SimpleComponent
    },
    testCase(component) {
      test(`programmatic changes — ${component.name}`, async () => {
        const changeWatcher = vi.fn()
        await render(component, {
          on: {changed: (value) => changeWatcher(value)},
        })

        const radio1 = page.getByLabelText(demoLabel1)
        const radio2 = page.getByLabelText(demoLabel2)

        expect(radio1).not.toBeChecked()
        expect(radio2).not.toBeChecked()

        await userEvent.click(page.getByTestId("set-option1"))
        await expect.element(radio1).toBeChecked()
        expect(radio2).not.toBeChecked()

        await userEvent.click(page.getByTestId("set-option2"))
        await expect.element(radio2).toBeChecked()
        expect(radio1).not.toBeChecked()
      })
    },
  },
  {
    composite() {
      @Component({
        imports: [RadioModule, ReactiveFormsModule],
        template: `
          <form [formGroup]="form" (ngSubmit)="onSubmit()">
            <fieldset formControlName="selectedOption" q-radio-group>
              <div q-radio-group-items>
                <label q-radio value="option1">
                  <input q-radio-hidden-input />
                  <div q-radio-control></div>
                  <span q-radio-label>{{ labels.demoLabel1 }}</span>
                </label>
                <label q-radio value="option2">
                  <input q-radio-hidden-input />
                  <div q-radio-control></div>
                  <span q-radio-label>{{ labels.demoLabel2 }}</span>
                </label>
              </div>
            </fieldset>
            <button data-test-id="reset" type="button" (click)="resetForm()">
              Reset
            </button>
            <button data-test-id="submit" type="submit">Submit</button>
          </form>
        `,
      })
      class CompositeComponent {
        protected readonly labels = labels
        form = new FormGroup({
          selectedOption: new FormControl("option1", Validators.required),
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
        imports: [RadioModule, ReactiveFormsModule],
        template: `
          <form [formGroup]="form">
            <fieldset formControlName="selectedOption" q-radio-group>
              <div q-radio-group-items>
                <label label="${demoLabel1}" q-radio value="option1"></label>
                <label label="${demoLabel2}" q-radio value="option2"></label>
              </div>
            </fieldset>
            <button data-test-id="reset" type="button" (click)="resetForm()">
              Reset
            </button>
            <button data-test-id="submit" type="submit">Submit</button>
          </form>
        `,
      })
      class SimpleComponent {
        form = new FormGroup({
          selectedOption: new FormControl("option1", Validators.required),
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

        const radio1 = page.getByLabelText(demoLabel1)
        const radio2 = page.getByLabelText(demoLabel2)

        expect(radio1).toBeChecked()
        expect(radio2).not.toBeChecked()

        await userEvent.click(page.getByText(demoLabel2))
        await expect.element(radio2).toBeChecked()
        expect(radio1).not.toBeChecked()

        await userEvent.click(page.getByTestId("reset"))
        await expect.element(radio1).not.toBeChecked()
        await expect.element(radio2).not.toBeChecked()
      })
    },
  },
  {
    composite() {
      @Component({
        imports: [RadioModule, FormsModule],
        template: `
          <div
            q-radio-group
            [(ngModel)]="selectedValue"
            (valueChanged)="changed.emit($event)"
          >
            <label q-radio value="option1">
              <input q-radio-hidden-input />
              <div q-radio-control></div>
              <span q-radio-label>{{ labels.demoLabel1 }}</span>
            </label>
            <label q-radio value="option2">
              <input q-radio-hidden-input />
              <div q-radio-control></div>
              <span q-radio-label>{{ labels.demoLabel2 }}</span>
            </label>
          </div>
        `,
      })
      class CompositeComponent {
        protected readonly labels = labels
        selectedValue = "option1"
        changed = output<string>()
      }
      return CompositeComponent
    },
    simple() {
      @Component({
        imports: [RadioModule, FormsModule],
        template: `
          <div
            q-radio-group
            [(ngModel)]="selectedValue"
            (valueChanged)="changed.emit($event)"
          >
            <label label="${demoLabel1}" q-radio value="option1"></label>
            <label label="${demoLabel2}" q-radio value="option2"></label>
          </div>
        `,
      })
      class SimpleComponent {
        selectedValue = "option1"
        changed = output<string>()
      }
      return SimpleComponent
    },
    testCase(component) {
      test(`template forms: change handler — ${component.name}`, async () => {
        const changeWatcher = vi.fn()
        await render(component, {
          on: {changed: (value) => changeWatcher(value)},
        })

        const radio1 = page.getByLabelText(demoLabel1)
        const radio2 = page.getByLabelText(demoLabel2)

        await expect.element(radio1).toBeChecked()
        expect(radio2).not.toBeChecked()

        await userEvent.click(page.getByText(demoLabel2))
        await expect.element(radio2).toBeChecked()
        expect(radio1).not.toBeChecked()
        expect(changeWatcher).toHaveBeenCalledWith("option2")

        await userEvent.click(page.getByText(demoLabel1))
        await expect.element(radio1).toBeChecked()
        expect(radio2).not.toBeChecked()
        expect(changeWatcher).toHaveBeenLastCalledWith("option1")
      })
    },
  },
  {
    composite() {
      @Component({
        imports: [RadioModule, FormsModule],
        template: `
          <fieldset
            disabled
            name="group"
            q-radio-group
            [attr.data-value]="selectedValue()"
            [(ngModel)]="selectedValue"
          >
            <div q-radio-group-label>{{ labels.groupLabel }}</div>
            <div q-radio-group-items>
              <label q-radio value="option1">
                <input q-radio-hidden-input />
                <div q-radio-control></div>
                <span q-radio-label>{{ labels.demoLabel1 }}</span>
              </label>
              <label q-radio value="option2">
                <input q-radio-hidden-input />
                <div q-radio-control></div>
                <span q-radio-label>{{ labels.demoLabel2 }}</span>
              </label>
            </div>
          </fieldset>
        `,
      })
      class CompositeComponent {
        protected readonly labels = labels
        readonly selectedValue = signal("option1")
      }
      return CompositeComponent
    },
    simple() {
      @Component({
        imports: [RadioModule, FormsModule],
        template: `
          <fieldset
            disabled
            name="group"
            q-radio-group
            [attr.data-value]="selectedValue()"
            [(ngModel)]="selectedValue"
          >
            <div q-radio-group-label>{{ labels.groupLabel }}</div>
            <div q-radio-group-items>
              <label label="${demoLabel1}" q-radio value="option1"></label>
              <label label="${demoLabel2}" q-radio value="option2"></label>
            </div>
          </fieldset>
        `,
      })
      class SimpleComponent {
        protected readonly labels = labels
        readonly selectedValue = signal("option1")
      }
      return SimpleComponent
    },
    testCase(component) {
      test(`template forms: disabled — ${component.name}`, async () => {
        await render(component)

        const radio1 = page.getByLabelText(demoLabel1)
        const radio2 = page.getByLabelText(demoLabel2)

        await expect.element(radio1).toBeDisabled()
        await expect.element(radio2).toBeDisabled()
        await expect.element(radio1).toBeChecked()

        await userEvent.click(page.getByText(demoLabel2), {force: true})
        await expect.element(radio1).toBeChecked()
        await expect.element(radio2).not.toBeChecked()
        await expect
          .element(page.getByLabelText(groupLabel))
          .toHaveAttribute("data-value", "option1")
      })
    },
  },
  {
    composite() {
      @Component({
        imports: [RadioModule, FormsModule],
        template: `
          <fieldset
            name="group"
            q-radio-group
            readOnly
            [attr.data-value]="selectedValue()"
            [(ngModel)]="selectedValue"
          >
            <div q-radio-group-label>{{ labels.groupLabel }}</div>
            <div q-radio-group-items>
              <label q-radio value="option1">
                <input q-radio-hidden-input />
                <div q-radio-control></div>
                <span q-radio-label>{{ labels.demoLabel1 }}</span>
              </label>
              <label q-radio value="option2">
                <input q-radio-hidden-input />
                <div q-radio-control></div>
                <span q-radio-label>{{ labels.demoLabel2 }}</span>
              </label>
            </div>
          </fieldset>
        `,
      })
      class CompositeComponent {
        protected readonly labels = labels
        readonly selectedValue = signal("option1")
      }
      return CompositeComponent
    },
    simple() {
      @Component({
        imports: [RadioModule, FormsModule],
        template: `
          <fieldset
            name="group"
            q-radio-group
            readOnly
            [attr.data-value]="selectedValue()"
            [(ngModel)]="selectedValue"
          >
            <div q-radio-group-label>{{ labels.groupLabel }}</div>
            <div q-radio-group-items>
              <label label="${demoLabel1}" q-radio value="option1"></label>
              <label label="${demoLabel2}" q-radio value="option2"></label>
            </div>
          </fieldset>
        `,
      })
      class SimpleComponent {
        protected readonly labels = labels
        readonly selectedValue = signal("option1")
      }
      return SimpleComponent
    },
    testCase(component) {
      test(`template forms: read-only — ${component.name}`, async () => {
        await render(component)

        const radio1 = page.getByLabelText(demoLabel1)
        const radio2 = page.getByLabelText(demoLabel2)

        await expect.element(radio1).toBeChecked()
        expect(radio2).not.toBeChecked()

        await userEvent.click(page.getByText(demoLabel2))
        await expect.element(radio1).toBeChecked()
        expect(radio2).not.toBeChecked()
        expect(page.getByLabelText(groupLabel)).toHaveAttribute(
          "data-value",
          "option1",
        )
      })
    },
  },
  {
    composite() {
      @Component({
        imports: [RadioModule, FormsModule],
        template: `
          <div
            name="group"
            q-radio-group
            [(ngModel)]="selectedValue"
            (valueChanged)="changed.emit($event)"
          >
            <div q-radio-group-label>{{ labels.groupLabel }}</div>
            <label q-radio value="option1">
              <input q-radio-hidden-input />
              <div q-radio-control></div>
              <span q-radio-label>{{ labels.demoLabel1 }}</span>
            </label>
            <label q-radio value="option2">
              <input q-radio-hidden-input />
              <div q-radio-control></div>
              <span q-radio-label>{{ labels.demoLabel2 }}</span>
            </label>
          </div>
          <button data-test-id="set-option1" (click)="setValue('option1')">
            Set Option 1
          </button>
          <button data-test-id="set-option2" (click)="setValue('option2')">
            Set Option 2
          </button>
        `,
      })
      class CompositeComponent {
        protected readonly labels = labels
        selectedValue = ""
        changed = output<string>()
        setValue(value: string) {
          this.selectedValue = value
        }
      }
      return CompositeComponent
    },
    simple() {
      @Component({
        imports: [RadioModule, FormsModule],
        template: `
          <div
            name="group"
            q-radio-group
            [(ngModel)]="selectedValue"
            (valueChanged)="changed.emit($event)"
          >
            <label label="${demoLabel1}" q-radio value="option1"></label>
            <label label="${demoLabel2}" q-radio value="option2"></label>
          </div>
          <button data-test-id="set-option1" (click)="setValue('option1')">
            Set Option 1
          </button>
          <button data-test-id="set-option2" (click)="setValue('option2')">
            Set Option 2
          </button>
        `,
      })
      class SimpleComponent {
        selectedValue = ""
        changed = output<string>()
        setValue(value: string) {
          this.selectedValue = value
        }
      }
      return SimpleComponent
    },
    testCase(component) {
      test(`template forms: programmatic changes — ${component.name}`, async () => {
        const changeWatcher = vi.fn()
        await render(component, {
          on: {changed: (value) => changeWatcher(value)},
        })

        const radio1 = page.getByLabelText(demoLabel1)
        const radio2 = page.getByLabelText(demoLabel2)

        await expect.element(radio1).not.toBeChecked()
        await expect.element(radio2).not.toBeChecked()

        await userEvent.click(page.getByTestId("set-option1"))
        await expect.element(radio1).toBeChecked()
        expect(radio2).not.toBeChecked()

        await userEvent.click(page.getByTestId("set-option2"))
        await expect.element(radio2).toBeChecked()
        expect(radio1).not.toBeChecked()
      })
    },
  },
  {
    composite() {
      @Component({
        imports: [RadioModule, FormsModule],
        template: `
          <form #form="ngForm">
            <div
              #radioGroup="ngModel"
              name="selectedOption"
              q-radio-group
              required
              [ngModelOptions]="{updateOn: 'blur'}"
              [(ngModel)]="selectedValue"
            >
              <label q-radio value="option1">
                <input q-radio-hidden-input />
                <div q-radio-control></div>
                <span q-radio-label>{{ labels.demoLabel1 }}</span>
              </label>
              <label q-radio value="option2">
                <input q-radio-hidden-input />
                <div q-radio-control></div>
                <span q-radio-label>{{ labels.demoLabel2 }}</span>
              </label>
              <div q-radio-group-error-text>Please select an option</div>
            </div>
            <div data-test-id="status">
              Touched: {{ radioGroup.touched }} | Dirty:
              {{ radioGroup.dirty }} | Valid: {{ radioGroup.valid }}
            </div>
          </form>
        `,
      })
      class CompositeComponent {
        protected readonly labels = labels
        readonly selectedValue = signal("")
      }
      return CompositeComponent
    },
    simple() {
      @Component({
        imports: [RadioModule, FormsModule],
        template: `
          <form #form="ngForm">
            <div
              #radioGroup="ngModel"
              name="selectedOption"
              q-radio-group
              required
              [ngModelOptions]="{updateOn: 'blur'}"
              [(ngModel)]="selectedValue"
            >
              <label label="${demoLabel1}" q-radio value="option1"></label>
              <label label="${demoLabel2}" q-radio value="option2"></label>
              <div q-radio-group-error-text>Please select an option</div>
            </div>
            <div data-test-id="status">
              Touched: {{ radioGroup.touched }} | Dirty:
              {{ radioGroup.dirty }} | Valid: {{ radioGroup.valid }}
            </div>
          </form>
        `,
      })
      class SimpleComponent {
        readonly selectedValue = signal("")
      }
      return SimpleComponent
    },
    testCase(component) {
      test(`template forms: validation states — ${component.name}`, async () => {
        await render(component)

        expect(page.getByTestId("status")).toHaveTextContent(
          "Touched: false | Dirty: false | Valid: true",
        )
        expect(page.getByText("Please select an option")).not.toBeVisible()

        await userEvent.tab()
        await userEvent.tab()

        await expect
          .element(page.getByTestId("status"))
          .toHaveTextContent("Touched: true | Dirty: false | Valid: false")

        await userEvent.click(page.getByText(demoLabel1))
        await userEvent.tab()
        await userEvent.tab()
        await expect.element(page.getByLabelText(demoLabel1)).toBeChecked()
        await expect
          .element(page.getByTestId("status"))
          .toHaveTextContent("Touched: true | Dirty: true | Valid: true")

        await expect
          .element(page.getByText("Please select an option"))
          .not.toBeVisible()
      })
    },
  },
  {
    composite() {
      @Component({
        imports: [RadioModule],
        template: `
          <fieldset defaultValue="option2" name="group" q-radio-group>
            <div q-radio-group-items>
              <label q-radio value="option1">
                <input q-radio-hidden-input />
                <div q-radio-control></div>
                <span q-radio-label>{{ labels.demoLabel1 }}</span>
              </label>
              <label q-radio value="option2">
                <input q-radio-hidden-input />
                <div q-radio-control></div>
                <span q-radio-label>{{ labels.demoLabel2 }}</span>
              </label>
            </div>
          </fieldset>
        `,
      })
      class CompositeComponent {
        protected readonly labels = labels
      }
      return CompositeComponent
    },
    simple() {
      @Component({
        imports: [RadioModule],
        template: `
          <fieldset defaultValue="option2" q-radio-group>
            <div q-radio-group-items>
              <label label="${demoLabel1}" q-radio value="option1"></label>
              <label label="${demoLabel2}" q-radio value="option2"></label>
            </div>
          </fieldset>
        `,
      })
      class SimpleComponent {}
      return SimpleComponent
    },
    testCase(component) {
      test(`radio default value — ${component.name}`, async () => {
        await render(component)

        const radio1 = page.getByLabelText(demoLabel1)
        const radio2 = page.getByLabelText(demoLabel2)

        await expect.element(radio1).not.toBeChecked()
        await expect.element(radio2).toBeChecked()
      })
    },
  },
  () => {
    const option1 = "Yes"
    const option2 = "No"
    const option3 = "Maybe"
    const errorText = "You must select an option"
    const submit = "Submit"
    const reset = "Reset"
    const labels = {
      errorText,
      option1,
      option2,
      option3,
      reset,
      submit,
    }
    return {
      composite() {
        @Component({
          imports: [RadioModule, FormsModule],
          template: `
            <form #surveyForm="ngForm">
              <div
                #surveyQuestion="ngModel"
                data-test-id="survey-question"
                name="surveyAnswer"
                q-radio-group
                required
                [(ngModel)]="selectedAnswer"
              >
                <label q-radio value="yes">
                  <input q-radio-hidden-input />
                  <div q-radio-control></div>
                  <span q-radio-label>{{ labels.option1 }}</span>
                </label>
                <label q-radio value="no">
                  <input q-radio-hidden-input />
                  <div q-radio-control></div>
                  <span q-radio-label>{{ labels.option2 }}</span>
                </label>
                <label q-radio value="maybe">
                  <input q-radio-hidden-input />
                  <div q-radio-control></div>
                  <span q-radio-label>{{ labels.option3 }}</span>
                </label>
                <div q-radio-group-error-text>{{ labels.errorText }}</div>
              </div>
              <button data-test-id="submit-button" type="submit">
                {{ labels.submit }}
              </button>
              <button
                data-test-id="reset-button"
                type="button"
                (click)="resetForm(surveyForm)"
              >
                {{ labels.reset }}
              </button>
            </form>
          `,
        })
        class CompositeFormComponent {
          protected readonly labels = labels
          readonly selectedAnswer = signal<string>("")

          resetForm(form: NgForm) {
            this.selectedAnswer.set("")
            form.resetForm()
          }
        }
        return CompositeFormComponent
      },
      simple() {
        @Component({
          imports: [RadioModule, FormsModule],
          template: `
            <form #simpleForm="ngForm">
              <div
                #surveyQuestion="ngModel"
                data-test-id="survey-question"
                name="surveyAnswer"
                q-radio-group
                required
                [(ngModel)]="selectedAnswer"
              >
                <label label="${option1}" q-radio value="yes"></label>
                <label label="${option2}" q-radio value="no"></label>
                <label label="${option3}" q-radio value="maybe"></label>
                <div q-radio-group-error-text>{{ labels.errorText }}</div>
              </div>
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
          readonly selectedAnswer = signal<string>("")

          resetForm(form: NgForm) {
            this.selectedAnswer.set("")
            form.resetForm()
          }
        }
        return SimpleFormComponent
      },
      testCase(component) {
        test(`template forms: complex validation — ${component.name}`, async () => {
          await render(component)

          const radio1 = page.getByLabelText(option1)
          const radio2 = page.getByLabelText(option2)
          const radio3 = page.getByLabelText(option3)
          const submitButton = page.getByText(submit)
          const resetButton = page.getByText(reset)

          expect(page.getByText(errorText)).not.toBeVisible()
          expect(radio1).not.toBeChecked()
          expect(radio2).not.toBeChecked()
          expect(radio3).not.toBeChecked()

          await userEvent.click(submitButton)
          await expect.element(page.getByText(errorText)).toBeVisible()

          await userEvent.click(page.getByText(option2))
          await expect.element(page.getByText(errorText)).not.toBeVisible()
          await expect.element(radio2).toBeChecked()

          await userEvent.click(page.getByText(option3))
          await expect.element(radio3).toBeChecked()
          await expect.element(radio2).not.toBeChecked()

          await userEvent.click(resetButton)
          await expect.element(radio1).not.toBeChecked()
          await expect.element(radio2).not.toBeChecked()
          await expect.element(radio3).not.toBeChecked()
          await expect.element(page.getByText(errorText)).not.toBeVisible()
        })
      },
    }
  },
  () => {
    const option1 = "Option A"
    const option2 = "Option B"
    const option3 = "Option C"
    const errorText = "Please select an option"
    const submit = "Submit"
    const reset = "Reset"
    const labels = {
      errorText,
      option1,
      option2,
      option3,
      reset,
      submit,
    }
    return {
      composite() {
        @Component({
          imports: [RadioModule, ReactiveFormsModule],
          template: `
            <form [formGroup]="surveyForm" (ngSubmit)="onSubmit()">
              <div
                data-test-id="survey-question"
                formControlName="selectedOption"
                name="group"
                q-radio-group
              >
                <label q-radio value="optionA">
                  <input q-radio-hidden-input />
                  <div q-radio-control></div>
                  <span q-radio-label>{{ labels.option1 }}</span>
                </label>
                <label q-radio value="optionB">
                  <input q-radio-hidden-input />
                  <div q-radio-control></div>
                  <span q-radio-label>{{ labels.option2 }}</span>
                </label>
                <label q-radio value="optionC">
                  <input q-radio-hidden-input />
                  <div q-radio-control></div>
                  <span q-radio-label>{{ labels.option3 }}</span>
                </label>
                <div q-radio-group-error-text>{{ labels.errorText }}</div>
              </div>
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
          readonly surveyForm = new FormGroup({
            selectedOption: new FormControl("", Validators.required),
          })

          onSubmit() {
            if (this.surveyForm.valid) {
              console.log(
                "Form submitted",
                this.surveyForm.value.selectedOption,
              )
            }
          }

          resetForm() {
            this.surveyForm.reset()
          }
        }

        return CompositeReactiveFormComponent
      },
      simple() {
        @Component({
          imports: [RadioModule, ReactiveFormsModule],
          template: `
            <form [formGroup]="surveyForm" (ngSubmit)="onSubmit()">
              <div
                data-test-id="survey-question"
                formControlName="selectedOption"
                name="group"
                q-radio-group
              >
                <div q-radio-group-items>
                  <label label="${option1}" q-radio value="optionA"></label>
                  <label label="${option2}" q-radio value="optionB"></label>
                  <label label="${option3}" q-radio value="optionC"></label>
                </div>
                <div q-radio-group-error-text>{{ labels.errorText }}</div>
              </div>
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
          readonly surveyForm = new FormGroup({
            selectedOption: new FormControl("", Validators.required),
          })

          onSubmit() {
            if (this.surveyForm.valid) {
              console.log(
                "Form submitted",
                this.surveyForm.value.selectedOption,
              )
            }
          }

          resetForm() {
            this.surveyForm.reset()
          }
        }

        return SimpleReactiveFormComponent
      },
      testCase(component) {
        test(`reactive forms: complex validation and reset — ${component.name}`, async () => {
          await render(component)

          const radio1 = page.getByLabelText(option1)
          const radio2 = page.getByLabelText(option2)
          const radio3 = page.getByLabelText(option3)
          const submitButton = page.getByText(submit)
          const resetButton = page.getByText(reset)

          expect(page.getByText(errorText)).not.toBeVisible()
          expect(radio1).not.toBeChecked()
          expect(radio2).not.toBeChecked()
          expect(radio3).not.toBeChecked()

          await userEvent.click(submitButton)
          await expect.element(page.getByText(errorText)).toBeVisible()

          await userEvent.click(page.getByText(option1))
          await expect.element(page.getByText(errorText)).not.toBeVisible()
          await expect.element(radio1).toBeChecked()

          await userEvent.click(page.getByText(option3))
          await expect.element(radio3).toBeChecked()
          await expect.element(radio1).not.toBeChecked()

          await userEvent.click(resetButton)
          await expect.element(radio1).not.toBeChecked()
          await expect.element(radio2).not.toBeChecked()
          await expect.element(radio3).not.toBeChecked()
          await expect.element(page.getByText(errorText)).not.toBeVisible()
        })
      },
    }
  },
]

describe("radio", () => {
  runTests(testCases)
})
