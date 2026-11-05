import {Component, output, signal} from "@angular/core"
import {
  FormControl,
  FormGroup,
  FormsModule,
  type NgForm,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms"
import {render} from "@testing-library/angular"
import {describe, expect, test, vi} from "vitest"
import {page, userEvent} from "vitest/browser"

import {RadioModule} from "@qualcomm-ui/angular/radio"

import {type MultiComponentTest, runTests} from "~test-utils"

const groupLabel = "Group Label"
const demoGroupError = "Demo Group Error"
const demoGroupHint = "Demo Group Hint"
const demoHint = "Demo Hint"
const demoLabel1 = "Option 1"
const demoLabel2 = "Option 2"

const labels = {
  demoGroupError,
  demoGroupHint,
  demoHint,
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
              <label
                q-radio
                value="option1"
                [label]="labels.demoLabel1"
              ></label>
              <label
                q-radio
                value="option2"
                [label]="labels.demoLabel2"
              ></label>
            </div>
          </fieldset>
        `,
      })
      class SimpleComponent {
        readonly labels = labels
      }
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
            <div q-radio-group-hint>{{ demoGroupHint }}</div>
          </fieldset>
        `,
      })
      class CompositeComponent {
        protected readonly labels = labels
        protected readonly demoGroupHint = demoGroupHint
      }
      return CompositeComponent
    },
    simple() {
      @Component({
        imports: [RadioModule],
        template: `
          <fieldset name="group" q-radio-group>
            <div q-radio-group-label>{{ labels.groupLabel }}</div>
            <div q-radio-group-items>
              <label
                q-radio
                value="option1"
                [label]="labels.demoLabel1"
              ></label>
              <label
                q-radio
                value="option2"
                [label]="labels.demoLabel2"
              ></label>
            </div>
            <div q-radio-group-hint>{{ labels.demoGroupHint }}</div>
          </fieldset>
        `,
      })
      class SimpleComponent {
        protected readonly labels = labels
      }
      return SimpleComponent
    },
    testCase(component) {
      test(`group hint text describes the radio group while valid — ${component.name}`, async () => {
        await render(component)

        await expect.element(page.getByText(demoGroupHint)).toBeVisible()
        await expect
          .element(page.getByText(demoGroupHint))
          .not.toHaveAttribute("hidden")
        await expect
          .element(page.getByLabelText(groupLabel))
          .not.toHaveAttribute("aria-invalid", "true")
      })
    },
  },
  {
    composite() {
      @Component({
        imports: [RadioModule, ReactiveFormsModule],
        template: `
          <form [formGroup]="form">
            <fieldset
              formControlName="selectedOption"
              name="group"
              q-radio-group
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
              <div q-radio-group-hint>{{ demoGroupHint }}</div>
              <div q-radio-group-error-text>{{ demoGroupError }}</div>
            </fieldset>
            <button type="submit">Submit</button>
          </form>
        `,
      })
      class CompositeComponent {
        protected readonly labels = labels
        protected readonly demoGroupHint = demoGroupHint
        protected readonly demoGroupError = demoGroupError
        form = new FormGroup({
          selectedOption: new FormControl("", Validators.required),
        })
      }
      return CompositeComponent
    },
    simple() {
      @Component({
        imports: [RadioModule, ReactiveFormsModule],
        template: `
          <form [formGroup]="form">
            <fieldset
              formControlName="selectedOption"
              name="group"
              q-radio-group
            >
              <div q-radio-group-label>{{ labels.groupLabel }}</div>
              <div q-radio-group-items>
                <label
                  q-radio
                  value="option1"
                  [label]="labels.demoLabel1"
                ></label>
                <label
                  q-radio
                  value="option2"
                  [label]="labels.demoLabel2"
                ></label>
              </div>
              <div q-radio-group-hint>{{ labels.demoGroupHint }}</div>
              <div q-radio-group-error-text>{{ labels.demoGroupError }}</div>
            </fieldset>
            <button type="submit">Submit</button>
          </form>
        `,
      })
      class SimpleComponent {
        protected readonly labels = labels
        form = new FormGroup({
          selectedOption: new FormControl("", Validators.required),
        })
      }
      return SimpleComponent
    },
    testCase(component) {
      test(`group error text replaces hint while invalid — ${component.name}`, async () => {
        await render(component)

        await expect.element(page.getByText(demoGroupHint)).toBeVisible()
        await expect.element(page.getByText(demoGroupError)).not.toBeVisible()

        await userEvent.click(page.getByText("Submit"))

        await expect.element(page.getByText(demoGroupError)).toBeVisible()
        await expect.element(page.getByText(demoGroupHint)).not.toBeVisible()
        await expect
          .element(page.getByLabelText(groupLabel))
          .toHaveAttribute("aria-invalid", "true")
      })
    },
  },
  {
    composite() {
      @Component({
        imports: [RadioModule, FormsModule],
        template: `
          <fieldset name="group" q-radio-group [(ngModel)]="selectedValue">
            <div q-radio-group-label>{{ labels.groupLabel }}</div>
            <output>{{ selectedValue() || "none" }}</output>
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
          <fieldset name="group" q-radio-group [(ngModel)]="selectedValue">
            <div q-radio-group-label>{{ labels.groupLabel }}</div>
            <output>{{ selectedValue() || "none" }}</output>
            <div q-radio-group-items>
              <label
                q-radio
                value="option1"
                [label]="labels.demoLabel1"
              ></label>
              <label
                q-radio
                value="option2"
                [label]="labels.demoLabel2"
              ></label>
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
      test(`bound selected value reflects radio selection — ${component.name}`, async () => {
        await render(component)

        await expect.element(page.getByText("option1")).toBeVisible()

        await userEvent.click(page.getByText(demoLabel2))

        await expect.element(page.getByText("option2")).toBeVisible()
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
                q-radio
                value="option1"
                [label]="labels.demoLabel1"
              ></label>
              <label
                q-radio
                value="option2"
                [label]="labels.demoLabel2"
              ></label>
            </div>
          </fieldset>
        `,
      })
      class SimpleComponent {
        readonly labels = labels
      }
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
              <label q-radio value="option1" [label]="labels.demoLabel1">
                <input id="radio1" q-radio-hidden-input />
              </label>
              <label q-radio value="option2" [label]="labels.demoLabel2">
                <input id="radio2" q-radio-hidden-input />
              </label>
            </div>
          </fieldset>
        `,
      })
      class SimpleComponent {
        readonly labels = labels
      }
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
              <label
                q-radio
                value="option1"
                [label]="labels.demoLabel1"
              ></label>
              <label
                q-radio
                value="option2"
                [label]="labels.demoLabel2"
              ></label>
            </div>
          </fieldset>
        `,
      })
      class SimpleComponent {
        readonly labels = labels
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
              <label
                q-radio
                value="option1"
                [label]="labels.demoLabel1"
              ></label>
              <label
                q-radio
                value="option2"
                [label]="labels.demoLabel2"
              ></label>
            </div>
            <div q-radio-group-error-text>Please select an option</div>
          </fieldset>
        `,
      })
      class SimpleComponent {
        readonly labels = labels
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
              <label
                q-radio
                value="option1"
                [label]="labels.demoLabel1"
              ></label>
              <label
                q-radio
                value="option2"
                [label]="labels.demoLabel2"
              ></label>
            </div>
          </fieldset>
        `,
      })
      class SimpleComponent {
        readonly labels = labels
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
            <label q-radio value="option1" [label]="labels.demoLabel1"></label>
            <label q-radio value="option2" [label]="labels.demoLabel2"></label>
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
        readonly labels = labels
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
                <label
                  q-radio
                  value="option1"
                  [label]="labels.demoLabel1"
                ></label>
                <label
                  q-radio
                  value="option2"
                  [label]="labels.demoLabel2"
                ></label>
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
        readonly labels = labels
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
            <label q-radio value="option1" [label]="labels.demoLabel1"></label>
            <label q-radio value="option2" [label]="labels.demoLabel2"></label>
          </div>
        `,
      })
      class SimpleComponent {
        readonly labels = labels
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
              <label
                q-radio
                value="option1"
                [label]="labels.demoLabel1"
              ></label>
              <label
                q-radio
                value="option2"
                [label]="labels.demoLabel2"
              ></label>
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
              <label
                q-radio
                value="option1"
                [label]="labels.demoLabel1"
              ></label>
              <label
                q-radio
                value="option2"
                [label]="labels.demoLabel2"
              ></label>
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
            <label q-radio value="option1" [label]="labels.demoLabel1"></label>
            <label q-radio value="option2" [label]="labels.demoLabel2"></label>
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
        readonly labels = labels
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
              <label
                q-radio
                value="option1"
                [label]="labels.demoLabel1"
              ></label>
              <label
                q-radio
                value="option2"
                [label]="labels.demoLabel2"
              ></label>
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
        readonly labels = labels
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
              <label
                q-radio
                value="option1"
                [label]="labels.demoLabel1"
              ></label>
              <label
                q-radio
                value="option2"
                [label]="labels.demoLabel2"
              ></label>
            </div>
          </fieldset>
        `,
      })
      class SimpleComponent {
        readonly labels = labels
      }
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
  {
    composite() {
      @Component({
        imports: [RadioModule],
        template: `
          <fieldset name="group" q-radio-group>
            <label q-radio value="option1">
              <input q-radio-hidden-input />
              <div q-radio-control></div>
              <span q-radio-label>{{ demoLabel1 }}</span>
              <span q-radio-hint>{{ demoHint }}</span>
            </label>
          </fieldset>
        `,
      })
      class CompositeComponent {
        protected readonly demoLabel1 = demoLabel1
        protected readonly demoHint = demoHint
      }
      return CompositeComponent
    },
    simple() {
      @Component({
        imports: [RadioModule],
        template: `
          <fieldset name="group" q-radio-group>
            <label
              hint="${demoHint}"
              q-radio
              value="option1"
              [label]="labels.demoLabel1"
            ></label>
          </fieldset>
        `,
      })
      class SimpleComponent {
        readonly labels = labels
      }
      return SimpleComponent
    },
    testCase(component) {
      test(`hint is visible — ${component.name}`, async () => {
        await render(component)

        await expect.element(page.getByText(demoHint)).toBeVisible()
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
                <label q-radio value="yes" [label]="labels.option1"></label>
                <label q-radio value="no" [label]="labels.option2"></label>
                <label q-radio value="maybe" [label]="labels.option3"></label>
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
                  <label
                    q-radio
                    value="optionA"
                    [label]="labels.option1"
                  ></label>
                  <label
                    q-radio
                    value="optionB"
                    [label]="labels.option2"
                  ></label>
                  <label
                    q-radio
                    value="optionC"
                    [label]="labels.option3"
                  ></label>
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

  test("simple component forwards static aria-label to the generated input only", async () => {
    @Component({
      imports: [RadioModule],
      template: `
        <fieldset name="notifications" q-radio-group>
          <div q-radio-group-items>
            <label
              aria-label="Email notifications"
              q-radio
              value="email"
            ></label>
            <label label="SMS notifications" q-radio value="sms"></label>
          </div>
        </fieldset>
      `,
    })
    class SimpleAriaLabelComponent {}

    const {container} = await render(SimpleAriaLabelComponent)

    await expect
      .element(page.getByRole("radio", {name: "Email notifications"}))
      .toBeVisible()
    expect(container.querySelector("label[q-radio]")).not.toHaveAttribute(
      "aria-label",
    )
  })

  test("simple component forwards static aria-labelledby to the generated input only", async () => {
    @Component({
      imports: [RadioModule],
      template: `
        <span id="external-label">External label</span>
        <fieldset name="notifications" q-radio-group>
          <div q-radio-group-items>
            <label
              aria-labelledby="external-label"
              label="Internal label"
              q-radio
              value="email"
            ></label>
          </div>
        </fieldset>
      `,
    })
    class SimpleAriaLabelledbyComponent {}

    const {container} = await render(SimpleAriaLabelledbyComponent)

    const radio = page.getByRole("radio", {name: "External label"})
    await expect.element(radio).not.toHaveAttribute("aria-label")
    await expect
      .element(radio)
      .toHaveAttribute("aria-labelledby", "external-label")
    expect(container.querySelector("label[q-radio]")).not.toHaveAttribute(
      "aria-labelledby",
    )
  })

  test("simple component forwards dynamic aria-label to the generated input", async () => {
    @Component({
      imports: [RadioModule],
      template: `
        <fieldset name="notifications" q-radio-group>
          <div q-radio-group-items>
            <label q-radio value="email" [aria-label]="radioLabel()"></label>
          </div>
        </fieldset>
        <button (click)="radioLabel.set('Updated label')">Update</button>
      `,
    })
    class DynamicSimpleAriaLabelComponent {
      readonly radioLabel = signal("Initial label")
    }

    await render(DynamicSimpleAriaLabelComponent)

    await expect
      .element(page.getByRole("radio", {name: "Initial label"}))
      .toBeVisible()

    await userEvent.click(page.getByRole("button", {name: "Update"}))

    await expect
      .element(page.getByRole("radio", {name: "Updated label"}))
      .toBeVisible()
  })

  test("hidden input forwards static and dynamic native aria labels", async () => {
    @Component({
      imports: [RadioModule],
      template: `
        <fieldset name="notifications" q-radio-group>
          <div q-radio-group-items>
            <label q-radio value="email">
              <input aria-label="Static label" q-radio-hidden-input />
              <div q-radio-control></div>
            </label>
            <label q-radio value="sms">
              <input q-radio-hidden-input [aria-label]="dynamicLabel()" />
              <div q-radio-control></div>
            </label>
          </div>
        </fieldset>
        <button (click)="dynamicLabel.set('Dynamic label updated')">
          Update
        </button>
      `,
    })
    class HiddenInputAriaLabelComponent {
      readonly dynamicLabel = signal("Dynamic label")
    }

    await render(HiddenInputAriaLabelComponent)

    await expect
      .element(page.getByRole("radio", {name: "Static label"}))
      .toBeVisible()
    await expect
      .element(page.getByRole("radio", {name: "Dynamic label"}))
      .toBeVisible()

    await userEvent.click(page.getByRole("button", {name: "Update"}))

    await expect
      .element(page.getByRole("radio", {name: "Dynamic label updated"}))
      .toBeVisible()
  })
})
