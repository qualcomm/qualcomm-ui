import {Component, signal} from "@angular/core"
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms"
import {render} from "@testing-library/angular"
import {describe, expect, test} from "vitest"
import {page} from "vitest/browser"

import {SelectModule} from "@qualcomm-ui/angular/select"
import {PortalDirective} from "@qualcomm-ui/angular-core/portal"
import {selectCollection} from "@qualcomm-ui/core/select"

import {type MultiComponentTest, runTests} from "~test-utils"

const cityItems = [
  "San Diego",
  "Nashville",
  "Denver",
  "Miami",
  "Las Vegas",
  "New York City",
  "San Francisco",
]

const countryItems = [
  {code: "US", name: "United States"},
  {code: "CA", name: "Canada"},
  {code: "MX", name: "Mexico"},
]

const testCases: MultiComponentTest[] = [
  {
    composite() {
      @Component({
        imports: [SelectModule, PortalDirective, ReactiveFormsModule],
        template: `
          <div
            placeholder="Select a city"
            q-select-root
            [collection]="cityCollection"
            [formControl]="formControl"
          >
            <div q-select-control>
              <span q-select-value-text></span>
              <button q-select-indicator></button>
            </div>

            <select q-select-hidden-select></select>

            <ng-template qPortal>
              <div q-select-positioner>
                <div q-select-content>
                  @for (item of cityCollection.items; track item) {
                    <div q-select-item [item]="item">
                      <span q-select-item-text>
                        {{ cityCollection.stringifyItem(item) }}
                      </span>
                      <span q-select-item-indicator></span>
                    </div>
                  }
                </div>
              </div>
            </ng-template>
          </div>
        `,
      })
      class CompositeComponent {
        cityCollection = selectCollection({items: cityItems})
        formControl = new FormControl(["Denver"])
      }
      return CompositeComponent
    },
    simple() {
      @Component({
        imports: [SelectModule, ReactiveFormsModule],
        template: `
          <q-select
            placeholder="Select a city"
            [collection]="cityCollection"
            [formControl]="formControl"
          />
        `,
      })
      class SimpleComponent {
        cityCollection = selectCollection({items: cityItems})
        formControl = new FormControl(["Denver"])
      }
      return SimpleComponent
    },
    testCase(component) {
      test(`reactive forms: single selection with FormControl — ${component.name}`, async () => {
        await render(component)

        const trigger = page.getByRole("combobox")
        await expect.element(trigger).toHaveTextContent("Denver")

        await trigger.click()
        await page.getByRole("option", {name: "Miami"}).click()

        await expect.element(trigger).toHaveTextContent("Miami")
      })
    },
  },
  {
    composite() {
      @Component({
        imports: [SelectModule, PortalDirective, ReactiveFormsModule],
        template: `
          <div
            multiple
            placeholder="Select cities"
            q-select-root
            [collection]="cityCollection"
            [formControl]="formControl"
          >
            <div q-select-control>
              <span q-select-value-text></span>
              <button q-select-indicator></button>
            </div>

            <select q-select-hidden-select></select>

            <ng-template qPortal>
              <div q-select-positioner>
                <div q-select-content>
                  @for (item of cityCollection.items; track item) {
                    <div q-select-item [item]="item">
                      <span q-select-item-text>
                        {{ cityCollection.stringifyItem(item) }}
                      </span>
                      <span q-select-item-indicator></span>
                    </div>
                  }
                </div>
              </div>
            </ng-template>
          </div>
        `,
      })
      class CompositeComponent {
        cityCollection = selectCollection({items: cityItems})
        formControl = new FormControl(["Denver", "Miami"])
      }
      return CompositeComponent
    },
    simple() {
      @Component({
        imports: [SelectModule, ReactiveFormsModule],
        template: `
          <q-select
            multiple
            placeholder="Select cities"
            [collection]="cityCollection"
            [formControl]="formControl"
          />
        `,
      })
      class SimpleComponent {
        cityCollection = selectCollection({items: cityItems})
        formControl = new FormControl(["Denver", "Miami"])
      }
      return SimpleComponent
    },
    testCase(component) {
      test(`reactive forms: multiple selection — ${component.name}`, async () => {
        await render(component)

        const trigger = page.getByRole("combobox")
        await expect.element(trigger).toHaveTextContent("Denver Miami")

        await trigger.click()
        await page.getByRole("option", {name: "Nashville"}).click()

        await expect
          .element(trigger)
          .toHaveTextContent("Denver Miami Nashville")
      })
    },
  },
  {
    composite() {
      @Component({
        imports: [SelectModule, PortalDirective, ReactiveFormsModule],
        template: `
          <button data-test-id="focus-target">Focus Target</button>
          <div
            placeholder="Select a city"
            q-select-root
            [collection]="cityCollection"
            [formControl]="formControl"
          >
            <div q-select-control>
              <span q-select-value-text></span>
              <button q-select-indicator></button>
            </div>

            <select q-select-hidden-select></select>

            <div q-select-error-text>Selection is required</div>

            <ng-template qPortal>
              <div q-select-positioner>
                <div q-select-content>
                  @for (item of cityCollection.items; track item) {
                    <div q-select-item [item]="item">
                      <span q-select-item-text>
                        {{ cityCollection.stringifyItem(item) }}
                      </span>
                      <span q-select-item-indicator></span>
                    </div>
                  }
                </div>
              </div>
            </ng-template>
          </div>
        `,
      })
      class CompositeComponent {
        cityCollection = selectCollection({items: cityItems})
        formControl = new FormControl([], {
          updateOn: "blur",
          validators: [Validators.required, Validators.minLength(1)],
        })
      }
      return CompositeComponent
    },
    simple() {
      @Component({
        imports: [SelectModule, ReactiveFormsModule],
        template: `
          <button data-test-id="focus-target">Focus Target</button>
          <q-select
            errorText="Selection is required"
            placeholder="Select a city"
            [collection]="cityCollection"
            [formControl]="formControl"
          />
        `,
      })
      class SimpleComponent {
        cityCollection = selectCollection({items: cityItems})
        formControl = new FormControl([], {
          updateOn: "blur",
          validators: [Validators.required, Validators.minLength(1)],
        })
      }
      return SimpleComponent
    },
    testCase(component) {
      test(`reactive forms: required validation with updateOn blur — ${component.name}`, async () => {
        await render(component)

        const trigger = page.getByRole("combobox")
        const errorText = page.getByText("Selection is required")

        expect(errorText).not.toBeVisible()

        await trigger.click()
        await page.getByTestId("focus-target").click()

        await expect.element(errorText).toBeVisible()

        await trigger.click()
        await page.getByRole("option", {name: "Denver"}).click()

        await expect.element(errorText).not.toBeVisible()
      })
    },
  },
  {
    composite() {
      @Component({
        imports: [SelectModule, PortalDirective, ReactiveFormsModule],
        template: `
          <div
            placeholder="Select a city"
            q-select-root
            [collection]="cityCollection"
            [formControl]="formControl"
          >
            <div q-select-control>
              <span q-select-value-text></span>
              <button q-select-indicator></button>
            </div>

            <select q-select-hidden-select></select>

            <ng-template qPortal>
              <div q-select-positioner>
                <div q-select-content>
                  @for (item of cityCollection.items; track item) {
                    <div q-select-item [item]="item">
                      <span q-select-item-text>
                        {{ cityCollection.stringifyItem(item) }}
                      </span>
                      <span q-select-item-indicator></span>
                    </div>
                  }
                </div>
              </div>
            </ng-template>
          </div>
        `,
      })
      class CompositeComponent {
        cityCollection = selectCollection({items: cityItems})
        formControl = new FormControl({disabled: true, value: ["Denver"]})
      }
      return CompositeComponent
    },
    simple() {
      @Component({
        imports: [SelectModule, ReactiveFormsModule],
        template: `
          <q-select
            placeholder="Select a city"
            [collection]="cityCollection"
            [formControl]="formControl"
          />
        `,
      })
      class SimpleComponent {
        cityCollection = selectCollection({items: cityItems})
        formControl = new FormControl({disabled: true, value: ["Denver"]})
      }
      return SimpleComponent
    },
    testCase(component) {
      test(`reactive forms: disabled state — ${component.name}`, async () => {
        await render(component)

        const trigger = page.getByRole("combobox")
        expect(trigger).toHaveAttribute("data-disabled", "")

        await trigger.click({force: true})
        await expect.element(trigger).toHaveAttribute("aria-expanded", "false")
      })
    },
  },
  {
    composite() {
      @Component({
        imports: [SelectModule, PortalDirective, ReactiveFormsModule],
        template: `
          <div
            placeholder="Select a city"
            q-select-root
            [collection]="cityCollection"
            [formControl]="formControl"
          >
            <div q-select-control>
              <span q-select-value-text></span>
              <button q-select-indicator></button>
            </div>

            <select q-select-hidden-select></select>

            <ng-template qPortal>
              <div q-select-positioner>
                <div q-select-content>
                  @for (item of cityCollection.items; track item) {
                    <div q-select-item [item]="item">
                      <span q-select-item-text>
                        {{ cityCollection.stringifyItem(item) }}
                      </span>
                      <span q-select-item-indicator></span>
                    </div>
                  }
                </div>
              </div>
            </ng-template>
          </div>
        `,
      })
      class CompositeComponent {
        cityCollection = selectCollection({items: cityItems})
        formControl = new FormControl(["Denver"])
      }
      return CompositeComponent
    },
    simple() {
      @Component({
        imports: [SelectModule, ReactiveFormsModule],
        template: `
          <q-select
            placeholder="Select a city"
            [collection]="cityCollection"
            [formControl]="formControl"
          />
        `,
      })
      class SimpleComponent {
        cityCollection = selectCollection({items: cityItems})
        formControl = new FormControl(["Denver"])
      }
      return SimpleComponent
    },
    testCase(component) {
      test(`reactive forms: programmatic value updates — ${component.name}`, async () => {
        const {fixture} = await render(component)
        const instance = fixture.componentInstance

        const trigger = page.getByRole("combobox")
        await expect.element(trigger).toHaveTextContent("Denver")

        instance.formControl.setValue(["Miami"])
        fixture.detectChanges()

        await expect.element(trigger).toHaveTextContent("Miami")
      })
    },
  },
  {
    composite() {
      @Component({
        imports: [SelectModule, PortalDirective, ReactiveFormsModule],
        template: `
          <div
            placeholder="Select a country"
            q-select-root
            [collection]="countryCollection"
            [formControl]="formControl"
          >
            <div q-select-control>
              <span q-select-value-text></span>
              <button q-select-indicator></button>
            </div>

            <select q-select-hidden-select></select>

            <ng-template qPortal>
              <div q-select-positioner>
                <div q-select-content>
                  @for (item of countryCollection.items; track item) {
                    <div q-select-item [item]="item">
                      <span q-select-item-text>
                        {{ countryCollection.stringifyItem(item) }}
                      </span>
                      <span q-select-item-indicator></span>
                    </div>
                  }
                </div>
              </div>
            </ng-template>
          </div>
        `,
      })
      class CompositeComponent {
        countryCollection = selectCollection({
          itemLabel: (item) => item.name,
          items: countryItems,
          itemValue: (item) => item.code,
        })
        formControl = new FormControl(["CA"])
      }
      return CompositeComponent
    },
    simple() {
      @Component({
        imports: [SelectModule, ReactiveFormsModule],
        template: `
          <q-select
            placeholder="Select a country"
            [collection]="countryCollection"
            [formControl]="formControl"
          />
        `,
      })
      class SimpleComponent {
        countryCollection = selectCollection({
          itemLabel: (item) => item.name,
          items: countryItems,
          itemValue: (item) => item.code,
        })
        formControl = new FormControl(["CA"])
      }
      return SimpleComponent
    },
    testCase(component) {
      test(`reactive forms: object items with itemValue — ${component.name}`, async () => {
        await render(component)

        const trigger = page.getByRole("combobox")
        await expect.element(trigger).toHaveTextContent("Canada")

        await trigger.click()
        await page.getByRole("option", {name: "Mexico"}).click()

        await expect.element(trigger).toHaveTextContent("Mexico")
      })
    },
  },
  {
    composite() {
      @Component({
        imports: [SelectModule, PortalDirective, FormsModule],
        template: `
          <output class="mb-4 block">{{ selectedCity() }}</output>
          <div
            name="city"
            placeholder="Select a city"
            q-select-root
            [collection]="cityCollection"
            [(ngModel)]="selectedCity"
          >
            <div q-select-control>
              <span q-select-value-text></span>
              <button q-select-indicator></button>
            </div>

            <select q-select-hidden-select></select>

            <ng-template qPortal>
              <div q-select-positioner>
                <div q-select-content>
                  @for (item of cityCollection.items; track item) {
                    <div q-select-item [item]="item">
                      <span q-select-item-text>
                        {{ cityCollection.stringifyItem(item) }}
                      </span>
                      <span q-select-item-indicator></span>
                    </div>
                  }
                </div>
              </div>
            </ng-template>
          </div>
        `,
      })
      class CompositeComponent {
        cityCollection = selectCollection({items: cityItems})
        readonly selectedCity = signal<string[]>([])
      }
      return CompositeComponent
    },
    simple() {
      @Component({
        imports: [SelectModule, FormsModule],
        template: `
          <output class="mb-4 block">{{ selectedCity() }}</output>
          <q-select
            name="city"
            placeholder="Select a city"
            [collection]="cityCollection"
            [(ngModel)]="selectedCity"
          />
        `,
      })
      class SimpleComponent {
        cityCollection = selectCollection({items: cityItems})
        readonly selectedCity = signal<string[]>([])
      }
      return SimpleComponent
    },
    testCase(component) {
      test(`template-driven forms: ngModel single selection — ${component.name}`, async () => {
        const {fixture} = await render(component)
        const instance = fixture.componentInstance

        const trigger = page.getByRole("combobox")
        const output = page.getByRole("status")

        await trigger.click()
        await page.getByRole("option", {name: "Denver"}).click()

        await expect.element(trigger).toHaveTextContent("Denver")
        await expect.element(output).toHaveTextContent("Denver")

        instance.selectedCity.set(["Miami"])
        fixture.detectChanges()

        await expect.element(trigger).toHaveTextContent("Miami")
        await expect.element(output).toHaveTextContent("Miami")
      })
    },
  },
  {
    composite() {
      @Component({
        imports: [SelectModule, PortalDirective, FormsModule],
        template: `
          <output class="mb-4 block">{{ selectedCities().join(", ") }}</output>
          <div
            multiple
            name="cities"
            placeholder="Select cities"
            q-select-root
            [collection]="cityCollection"
            [(ngModel)]="selectedCities"
          >
            <div q-select-control>
              <span q-select-value-text></span>
              <button q-select-indicator></button>
            </div>

            <select q-select-hidden-select></select>

            <ng-template qPortal>
              <div q-select-positioner>
                <div q-select-content>
                  @for (item of cityCollection.items; track item) {
                    <div q-select-item [item]="item">
                      <span q-select-item-text>
                        {{ cityCollection.stringifyItem(item) }}
                      </span>
                      <span q-select-item-indicator></span>
                    </div>
                  }
                </div>
              </div>
            </ng-template>
          </div>
        `,
      })
      class CompositeComponent {
        cityCollection = selectCollection({items: cityItems})
        readonly selectedCities = signal<string[]>([])
      }
      return CompositeComponent
    },
    simple() {
      @Component({
        imports: [SelectModule, FormsModule],
        template: `
          <output class="mb-4 block">{{ selectedCities().join(", ") }}</output>
          <q-select
            multiple
            name="cities"
            placeholder="Select cities"
            [collection]="cityCollection"
            [(ngModel)]="selectedCities"
          />
        `,
      })
      class SimpleComponent {
        cityCollection = selectCollection({items: cityItems})
        readonly selectedCities = signal<string[]>([])
      }
      return SimpleComponent
    },
    testCase(component) {
      test(`template-driven forms: ngModel multiple selection — ${component.name}`, async () => {
        await render(component)

        const trigger = page.getByRole("combobox")
        const output = page.getByRole("status")

        await trigger.click()
        await page.getByRole("option", {name: "Denver"}).click()
        await expect.element(trigger).toHaveTextContent("Denver")
        await expect.element(output).toHaveTextContent("Denver")

        await page.getByRole("option", {name: "Miami"}).click()
        await expect.element(trigger).toHaveTextContent("Denver Miami")
        await expect.element(output).toHaveTextContent("Denver, Miami")
      })
    },
  },
  {
    composite() {
      @Component({
        imports: [SelectModule, PortalDirective, FormsModule],
        template: `
          <button data-test-id="focus-target">Focus Target</button>
          <div
            name="city"
            placeholder="Select a city"
            q-select-root
            required
            [collection]="cityCollection"
            [(ngModel)]="selectedCity"
          >
            <div q-select-control>
              <span q-select-value-text></span>
              <button q-select-indicator></button>
            </div>

            <select q-select-hidden-select></select>

            <div q-select-error-text>Selection is required</div>

            <ng-template qPortal>
              <div q-select-positioner>
                <div q-select-content>
                  @for (item of cityCollection.items; track item) {
                    <div q-select-item [item]="item">
                      <span q-select-item-text>
                        {{ cityCollection.stringifyItem(item) }}
                      </span>
                      <span q-select-item-indicator></span>
                    </div>
                  }
                </div>
              </div>
            </ng-template>
          </div>
        `,
      })
      class CompositeComponent {
        cityCollection = selectCollection({items: cityItems})
        readonly selectedCity = signal<string[]>([])
      }
      return CompositeComponent
    },
    simple() {
      @Component({
        imports: [SelectModule, FormsModule],
        template: `
          <button data-test-id="focus-target">Focus Target</button>
          <q-select
            errorText="Selection is required"
            name="city"
            placeholder="Select a city"
            required
            [collection]="cityCollection"
            [(ngModel)]="selectedCity"
          />
        `,
      })
      class SimpleComponent {
        cityCollection = selectCollection({items: cityItems})
        readonly selectedCity = signal<string[]>([])
      }
      return SimpleComponent
    },
    testCase(component) {
      // TODO: add onblur support in core select
      test.skip(`template-driven forms: required validation — ${component.name}`, async () => {
        await render(component)

        const trigger = page.getByRole("combobox")
        const errorText = page.getByText("Selection is required")

        expect(errorText).not.toBeVisible()

        await trigger.click()
        await expect.element(trigger).toHaveAttribute("aria-expanded", "true")
        await page.getByTestId("focus-target").click()

        await expect.element(errorText).toBeVisible()

        await trigger.click()
        await page.getByRole("option", {name: "Denver"}).click()

        await expect.element(errorText).not.toBeVisible()
      })
    },
  },
]

describe("Select Forms", () => {
  runTests(testCases)
})
