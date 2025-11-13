import {Component, output, signal} from "@angular/core"
import {render} from "@testing-library/angular"
import {page, userEvent} from "@vitest/browser/context"
import {describe, expect, test, vi} from "vitest"

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
  {code: "GB", name: "United Kingdom"},
  {code: "FR", name: "France"},
]

const testCases: MultiComponentTest[] = [
  {
    composite() {
      @Component({
        imports: [SelectModule, PortalDirective],
        template: `
          <div
            placeholder="Select a city"
            q-select-root
            [collection]="cityCollection"
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
      }
      return CompositeComponent
    },
    simple() {
      @Component({
        imports: [SelectModule],
        template: `
          <q-select placeholder="Select a city" [collection]="cityCollection" />
        `,
      })
      class SimpleComponent {
        cityCollection = selectCollection({items: cityItems})
      }
      return SimpleComponent
    },
    testCase(component) {
      test(`renders with placeholder — ${component.name}`, async () => {
        await render(component)

        const trigger = page.getByRole("combobox")
        await expect.element(trigger).toHaveTextContent("Select a city")
      })
    },
  },
  {
    composite() {
      @Component({
        imports: [SelectModule, PortalDirective],
        template: `
          <div
            placeholder="Select a city"
            q-select-root
            [collection]="cityCollection"
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
      }
      return CompositeComponent
    },
    simple() {
      @Component({
        imports: [SelectModule],
        template: `
          <q-select placeholder="Select a city" [collection]="cityCollection" />
        `,
      })
      class SimpleComponent {
        cityCollection = selectCollection({items: cityItems})
      }
      return SimpleComponent
    },
    testCase(component) {
      test(`opens and closes on click — ${component.name}`, async () => {
        await render(component)

        const trigger = page.getByRole("combobox")
        await expect.element(trigger).toHaveAttribute("aria-expanded", "false")

        await trigger.click()
        await expect.element(trigger).toHaveAttribute("aria-expanded", "true")

        const content = page.getByRole("listbox")
        await expect.element(content).toBeVisible()

        await trigger.click()
        await expect.element(trigger).toHaveAttribute("aria-expanded", "false")
        await expect.element(content).not.toBeInTheDocument()
      })
    },
  },
  {
    composite() {
      @Component({
        imports: [SelectModule, PortalDirective],
        template: `
          <div
            placeholder="Select a city"
            q-select-root
            [collection]="cityCollection"
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
      }
      return CompositeComponent
    },
    simple() {
      @Component({
        imports: [SelectModule],
        template: `
          <q-select placeholder="Select a city" [collection]="cityCollection" />
        `,
      })
      class SimpleComponent {
        cityCollection = selectCollection({items: cityItems})
      }
      return SimpleComponent
    },
    testCase(component) {
      test(`single selection — ${component.name}`, async () => {
        await render(component)

        const trigger = page.getByRole("combobox")
        await trigger.click()

        const option = page.getByRole("option", {name: "Denver"})
        await option.click()

        await expect.element(trigger).toHaveTextContent("Denver")
        expect(trigger).toHaveAttribute("aria-expanded", "false")
      })
    },
  },
  {
    composite() {
      @Component({
        imports: [SelectModule, PortalDirective],
        template: `
          <div
            multiple
            placeholder="Select cities"
            q-select-root
            [collection]="cityCollection"
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
      }
      return CompositeComponent
    },
    simple() {
      @Component({
        imports: [SelectModule],
        template: `
          <q-select
            multiple
            placeholder="Select cities"
            [collection]="cityCollection"
          />
        `,
      })
      class SimpleComponent {
        cityCollection = selectCollection({items: cityItems})
      }
      return SimpleComponent
    },
    testCase(component) {
      test(`multiple selection — ${component.name}`, async () => {
        await render(component)

        const trigger = page.getByRole("combobox")
        await trigger.click()

        await page.getByRole("option", {name: "Denver"}).click()
        await expect.element(trigger).toHaveTextContent("Denver")
        expect(trigger).toHaveAttribute("aria-expanded", "true")

        await page.getByRole("option", {name: "Miami"}).click()
        await expect.element(trigger).toHaveTextContent("Denver Miami")
        expect(trigger).toHaveAttribute("aria-expanded", "true")
      })
    },
  },
  {
    composite() {
      @Component({
        imports: [SelectModule, PortalDirective],
        template: `
          <div
            placeholder="Select a city"
            q-select-root
            [closeOnSelect]="false"
            [collection]="cityCollection"
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
      }
      return CompositeComponent
    },
    simple() {
      @Component({
        imports: [SelectModule],
        template: `
          <q-select
            placeholder="Select a city"
            [closeOnSelect]="false"
            [collection]="cityCollection"
          />
        `,
      })
      class SimpleComponent {
        cityCollection = selectCollection({items: cityItems})
      }
      return SimpleComponent
    },
    testCase(component) {
      test(`closeOnSelect false — ${component.name}`, async () => {
        await render(component)

        const trigger = page.getByRole("combobox")
        await trigger.click()

        await page.getByRole("option", {name: "Denver"}).click()
        await expect.element(trigger).toHaveTextContent("Denver")
        expect(trigger).toHaveAttribute("aria-expanded", "true")
      })
    },
  },
  {
    composite() {
      @Component({
        imports: [SelectModule, PortalDirective],
        template: `
          <div
            deselectable
            placeholder="Select a city"
            q-select-root
            [collection]="cityCollection"
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
      }
      return CompositeComponent
    },
    simple() {
      @Component({
        imports: [SelectModule],
        template: `
          <q-select
            deselectable
            placeholder="Select a city"
            [collection]="cityCollection"
          />
        `,
      })
      class SimpleComponent {
        cityCollection = selectCollection({items: cityItems})
      }
      return SimpleComponent
    },
    testCase(component) {
      test(`deselectable — ${component.name}`, async () => {
        await render(component)

        const trigger = page.getByRole("combobox")
        await trigger.click()

        const option = page.getByRole("option", {name: "Denver"})
        await userEvent.click(option)
        await expect.element(trigger).toHaveTextContent("Denver")

        await trigger.click()
        await userEvent.click(option)
        await expect.element(trigger).toHaveTextContent("Select a city")
      })
    },
  },
  {
    composite() {
      @Component({
        imports: [SelectModule, PortalDirective],
        template: `
          <div
            disabled
            placeholder="Select a city"
            q-select-root
            [collection]="cityCollection"
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
      }
      return CompositeComponent
    },
    simple() {
      @Component({
        imports: [SelectModule],
        template: `
          <q-select
            disabled
            placeholder="Select a city"
            [collection]="cityCollection"
          />
        `,
      })
      class SimpleComponent {
        cityCollection = selectCollection({items: cityItems})
      }
      return SimpleComponent
    },
    testCase(component) {
      test(`disabled — ${component.name}`, async () => {
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
        imports: [SelectModule, PortalDirective],
        template: `
          <div
            placeholder="Select a city"
            q-select-root
            readOnly
            [collection]="cityCollection"
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
      }
      return CompositeComponent
    },
    simple() {
      @Component({
        imports: [SelectModule],
        template: `
          <q-select
            placeholder="Select a city"
            readOnly
            [collection]="cityCollection"
          />
        `,
      })
      class SimpleComponent {
        cityCollection = selectCollection({items: cityItems})
      }
      return SimpleComponent
    },
    testCase(component) {
      test(`readOnly — ${component.name}`, async () => {
        await render(component)

        const trigger = page.getByRole("combobox")
        expect(trigger).toHaveAttribute("data-readonly", "")

        await trigger.click()
        expect(trigger).toHaveAttribute("aria-expanded", "false")
      })
    },
  },
  {
    composite() {
      @Component({
        imports: [SelectModule, PortalDirective],
        template: `
          <div
            invalid
            placeholder="Select a city"
            q-select-root
            [collection]="cityCollection"
          >
            <div q-select-control>
              <span q-select-value-text></span>
              <button q-select-indicator></button>
              <div q-select-error-indicator></div>
            </div>

            <select q-select-hidden-select></select>

            <div q-select-error-text>Invalid selection</div>

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
      }
      return CompositeComponent
    },
    simple() {
      @Component({
        imports: [SelectModule],
        template: `
          <q-select
            errorText="Invalid selection"
            invalid
            placeholder="Select a city"
            [collection]="cityCollection"
          />
        `,
      })
      class SimpleComponent {
        cityCollection = selectCollection({items: cityItems})
      }
      return SimpleComponent
    },
    testCase(component) {
      test(`invalid state — ${component.name}`, async () => {
        await render(component)

        await expect.element(page.getByText("Invalid selection")).toBeVisible()
      })
    },
  },
  {
    composite() {
      @Component({
        imports: [SelectModule, PortalDirective],
        template: `
          <div
            placeholder="Select a city"
            q-select-root
            [collection]="cityCollection"
            (openChanged)="openChangedHandler.emit($event)"
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
        openChangedHandler = output<boolean>()
      }
      return CompositeComponent
    },
    simple() {
      @Component({
        imports: [SelectModule],
        template: `
          <q-select
            placeholder="Select a city"
            [collection]="cityCollection"
            (openChanged)="openChangedHandler.emit($event)"
          />
        `,
      })
      class SimpleComponent {
        cityCollection = selectCollection({items: cityItems})
        openChangedHandler = output<boolean>()
      }
      return SimpleComponent
    },
    testCase(component) {
      test(`openChanged event — ${component.name}`, async () => {
        const openChangedWatcher = vi.fn()
        await render(component, {
          on: {openChangedHandler: (event) => openChangedWatcher(event)},
        })

        const trigger = page.getByRole("combobox")
        await trigger.click()

        await expect.poll(() => openChangedWatcher).toHaveBeenCalledWith(true)

        await trigger.click()
        await expect
          .poll(() => openChangedWatcher)
          .toHaveBeenLastCalledWith(false)
      })
    },
  },
  {
    composite() {
      @Component({
        imports: [SelectModule, PortalDirective],
        template: `
          <div
            placeholder="Select a city"
            q-select-root
            [collection]="cityCollection"
            (valueChanged)="valueChangedHandler.emit($event)"
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
        valueChangedHandler = output<any>()
      }
      return CompositeComponent
    },
    simple() {
      @Component({
        imports: [SelectModule],
        template: `
          <q-select
            placeholder="Select a city"
            [collection]="cityCollection"
            (valueChanged)="valueChangedHandler.emit($event)"
          />
        `,
      })
      class SimpleComponent {
        cityCollection = selectCollection({items: cityItems})
        valueChangedHandler = output<any>()
      }
      return SimpleComponent
    },
    testCase(component) {
      test(`valueChanged event — ${component.name}`, async () => {
        const valueChangedWatcher = vi.fn()
        await render(component, {
          on: {valueChangedHandler: (event) => valueChangedWatcher(event)},
        })

        const trigger = page.getByRole("combobox")
        await trigger.click()

        await page.getByRole("option", {name: "Denver"}).click()

        await expect
          .poll(() => valueChangedWatcher)
          .toHaveBeenCalledWith(
            expect.objectContaining({
              items: ["Denver"],
              value: ["Denver"],
            }),
          )
      })
    },
  },
  {
    composite() {
      @Component({
        imports: [SelectModule, PortalDirective],
        template: `
          <div
            placeholder="Select a city"
            q-select-root
            [collection]="cityCollection"
            (selected)="selectedHandler.emit($event)"
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
        selectedHandler = output<{value: string | undefined}>()
      }
      return CompositeComponent
    },
    simple() {
      @Component({
        imports: [SelectModule],
        template: `
          <q-select
            placeholder="Select a city"
            [collection]="cityCollection"
            (selected)="selectedHandler.emit($event)"
          />
        `,
      })
      class SimpleComponent {
        cityCollection = selectCollection({items: cityItems})
        selectedHandler = output<{value: string | undefined}>()
      }
      return SimpleComponent
    },
    testCase(component) {
      test(`selected event — ${component.name}`, async () => {
        const selectedWatcher = vi.fn()
        await render(component, {
          on: {selectedHandler: (event) => selectedWatcher(event)},
        })

        const trigger = page.getByRole("combobox")
        await trigger.click()

        await page.getByRole("option", {name: "Denver"}).click()

        await expect
          .poll(() => selectedWatcher)
          .toHaveBeenCalledWith({value: "Denver"})
      })
    },
  },
  {
    composite() {
      @Component({
        imports: [SelectModule, PortalDirective],
        template: `
          <div
            placeholder="Select a city"
            q-select-root
            [collection]="cityCollection"
            (highlightChanged)="highlightChangedHandler.emit($event)"
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
        highlightChangedHandler = output<any>()
      }
      return CompositeComponent
    },
    simple() {
      @Component({
        imports: [SelectModule],
        template: `
          <q-select
            placeholder="Select a city"
            [collection]="cityCollection"
            (highlightChanged)="highlightChangedHandler.emit($event)"
          />
        `,
      })
      class SimpleComponent {
        cityCollection = selectCollection({items: cityItems})
        highlightChangedHandler = output<any>()
      }
      return SimpleComponent
    },
    testCase(component) {
      test(`highlightChanged event with keyboard navigation — ${component.name}`, async () => {
        const highlightChangedWatcher = vi.fn()
        await render(component, {
          on: {
            highlightChangedHandler: (event) => highlightChangedWatcher(event),
          },
        })

        const trigger = page.getByRole("combobox")
        await trigger.click()

        await userEvent.keyboard("{ArrowDown}")

        await expect
          .poll(() => highlightChangedWatcher)
          .toHaveBeenCalledWith(
            expect.objectContaining({
              value: "San Diego",
            }),
          )

        await userEvent.keyboard("{ArrowDown}")

        await expect
          .poll(() => highlightChangedWatcher)
          .toHaveBeenLastCalledWith(
            expect.objectContaining({
              value: "Nashville",
            }),
          )
      })
    },
  },
  {
    composite() {
      @Component({
        imports: [SelectModule, PortalDirective],
        template: `
          <div
            placeholder="Select a city"
            q-select-root
            [collection]="cityCollection"
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
      }
      return CompositeComponent
    },
    simple() {
      @Component({
        imports: [SelectModule],
        template: `
          <q-select placeholder="Select a city" [collection]="cityCollection" />
        `,
      })
      class SimpleComponent {
        cityCollection = selectCollection({items: cityItems})
      }
      return SimpleComponent
    },
    testCase(component) {
      test(`keyboard navigation — ${component.name}`, async () => {
        await render(component)

        const trigger = page.getByRole("combobox")
        await trigger.click()
        await userEvent.keyboard("{ArrowDown}")

        const firstOption = page.getByRole("option", {name: "San Diego"})
        await expect
          .element(firstOption)
          .toHaveAttribute("data-highlighted", "")

        await userEvent.keyboard("{ArrowDown}")
        const secondOption = page.getByRole("option", {name: "Nashville"})
        await expect
          .element(secondOption)
          .toHaveAttribute("data-highlighted", "")

        await userEvent.keyboard("{ArrowUp}")
        await expect
          .element(firstOption)
          .toHaveAttribute("data-highlighted", "")

        await userEvent.keyboard("{Enter}")
        await expect.element(trigger).toHaveTextContent("San Diego")
      })
    },
  },
  {
    composite() {
      @Component({
        imports: [SelectModule, PortalDirective],
        template: `
          <div
            placeholder="Select a city"
            q-select-root
            [collection]="cityCollection"
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
      }
      return CompositeComponent
    },
    simple() {
      @Component({
        imports: [SelectModule],
        template: `
          <q-select placeholder="Select a city" [collection]="cityCollection" />
        `,
      })
      class SimpleComponent {
        cityCollection = selectCollection({items: cityItems})
      }
      return SimpleComponent
    },
    testCase(component) {
      test(`closes on Escape key — ${component.name}`, async () => {
        await render(component)

        const trigger = page.getByRole("combobox")
        await trigger.click()
        expect(trigger).toHaveAttribute("aria-expanded", "true")

        await userEvent.keyboard("{Escape}")
        await expect.element(trigger).toHaveAttribute("aria-expanded", "false")
      })
    },
  },
  {
    composite() {
      @Component({
        imports: [SelectModule, PortalDirective],
        template: `
          <div
            loopFocus
            placeholder="Select a city"
            q-select-root
            [collection]="cityCollection"
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
      }
      return CompositeComponent
    },
    simple() {
      @Component({
        imports: [SelectModule],
        template: `
          <q-select
            loopFocus
            placeholder="Select a city"
            [collection]="cityCollection"
          />
        `,
      })
      class SimpleComponent {
        cityCollection = selectCollection({items: cityItems})
      }
      return SimpleComponent
    },
    testCase(component) {
      test(`loopFocus — ${component.name}`, async () => {
        await render(component)

        const trigger = page.getByRole("combobox")
        await trigger.click()
        await userEvent.keyboard("{ArrowDown}")

        const firstOption = page.getByRole("option", {name: "San Diego"})
        await expect
          .element(firstOption)
          .toHaveAttribute("data-highlighted", "")

        await userEvent.keyboard("{ArrowUp}")
        const lastOption = page.getByRole("option", {name: "San Francisco"})
        await expect.element(lastOption).toHaveAttribute("data-highlighted", "")

        await userEvent.keyboard("{ArrowDown}")
        await expect
          .element(firstOption)
          .toHaveAttribute("data-highlighted", "")
      })
    },
  },
  {
    composite() {
      @Component({
        imports: [SelectModule, PortalDirective],
        template: `
          <div
            placeholder="Select a country"
            q-select-root
            [collection]="countryCollection"
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
      }
      return CompositeComponent
    },
    simple() {
      @Component({
        imports: [SelectModule],
        template: `
          <q-select
            placeholder="Select a country"
            [collection]="countryCollection"
          />
        `,
      })
      class SimpleComponent {
        countryCollection = selectCollection({
          itemLabel: (item) => item.name,
          items: countryItems,
          itemValue: (item) => item.code,
        })
      }
      return SimpleComponent
    },
    testCase(component) {
      test(`object items with itemLabel and itemValue — ${component.name}`, async () => {
        await render(component)

        const trigger = page.getByRole("combobox")
        await trigger.click()

        await page.getByRole("option", {name: "Canada"}).click()

        await expect.element(trigger).toHaveTextContent("Canada")
      })
    },
  },
  {
    composite() {
      @Component({
        imports: [SelectModule, PortalDirective],
        template: `
          <div
            placeholder="Select a city"
            q-select-root
            [collection]="cityCollection"
            [open]="isOpen()"
            (openChanged)="isOpen.set($event)"
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
        readonly isOpen = signal(true)
      }
      return CompositeComponent
    },
    simple() {
      @Component({
        imports: [SelectModule],
        template: `
          <q-select
            placeholder="Select a city"
            [collection]="cityCollection"
            [open]="isOpen()"
            (openChanged)="isOpen.set($event)"
          />
        `,
      })
      class SimpleComponent {
        cityCollection = selectCollection({items: cityItems})
        readonly isOpen = signal(true)
      }
      return SimpleComponent
    },
    testCase(component) {
      test(`controlled open state — ${component.name}`, async () => {
        await render(component)

        const trigger = page.getByRole("combobox")
        await expect.element(trigger).toHaveAttribute("aria-expanded", "true")

        await trigger.click()
        await expect.element(trigger).toHaveAttribute("aria-expanded", "false")

        await trigger.click()
        await expect.element(trigger).toHaveAttribute("aria-expanded", "true")
      })
    },
  },
  {
    composite() {
      @Component({
        imports: [SelectModule, PortalDirective],
        template: `
          <div
            placeholder="Select a city"
            q-select-root
            [collection]="cityCollection"
            [highlightedValue]="highlightedCity()"
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
        readonly highlightedCity = signal<string | null>("Miami")
      }
      return CompositeComponent
    },
    simple() {
      @Component({
        imports: [SelectModule],
        template: `
          <q-select
            placeholder="Select a city"
            [collection]="cityCollection"
            [highlightedValue]="highlightedCity()"
          />
        `,
      })
      class SimpleComponent {
        cityCollection = selectCollection({items: cityItems})
        readonly highlightedCity = signal<string | null>("Miami")
      }
      return SimpleComponent
    },
    testCase(component) {
      test(`controlled highlighted value — ${component.name}`, async () => {
        await render(component)

        const trigger = page.getByRole("combobox")
        await trigger.click()
        await expect.element(trigger).toHaveAttribute("aria-expanded", "true")

        const miamiOption = page.getByRole("option", {name: "Miami"})
        await expect
          .element(miamiOption)
          .toHaveAttribute("data-highlighted", "")
      })
    },
  },
  {
    composite() {
      @Component({
        imports: [SelectModule, PortalDirective],
        template: `
          <div
            placeholder="Select a city"
            q-select-root
            [collection]="cityCollection"
            [defaultValue]="['Denver']"
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
      }
      return CompositeComponent
    },
    simple() {
      @Component({
        imports: [SelectModule],
        template: `
          <q-select
            placeholder="Select a city"
            [collection]="cityCollection"
            [defaultValue]="['Denver']"
          />
        `,
      })
      class SimpleComponent {
        cityCollection = selectCollection({items: cityItems})
      }
      return SimpleComponent
    },
    testCase(component) {
      test(`default value — ${component.name}`, async () => {
        await render(component)

        const trigger = page.getByRole("combobox")
        await expect.element(trigger).toHaveTextContent("Denver")
      })
    },
  },
  {
    composite() {
      @Component({
        imports: [SelectModule, PortalDirective],
        template: `
          <div
            placeholder="Select a city"
            q-select-root
            [collection]="cityCollection"
          >
            <div q-select-control>
              <span q-select-value-text></span>
              <button q-select-clear-trigger></button>
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
      }
      return CompositeComponent
    },
    simple() {
      @Component({
        imports: [SelectModule],
        template: `
          <q-select placeholder="Select a city" [collection]="cityCollection" />
        `,
      })
      class SimpleComponent {
        cityCollection = selectCollection({items: cityItems})
      }
      return SimpleComponent
    },
    testCase(component) {
      test(`clear trigger — ${component.name}`, async () => {
        await render(component)

        const trigger = page.getByRole("combobox")
        await trigger.click()

        await page.getByRole("option", {name: "Denver"}).click()
        await expect.element(trigger).toHaveTextContent("Denver")

        const clearButton = page.getByRole("button", {name: "Clear value"})
        await expect.element(clearButton).toBeVisible()

        await clearButton.click()
        await expect.element(trigger).toHaveTextContent("Select a city")
        await expect.element(clearButton).not.toBeInTheDocument()
      })
    },
  },
  {
    composite() {
      @Component({
        imports: [SelectModule, PortalDirective],
        template: `
          <div
            defaultOpen
            placeholder="Select a city"
            q-select-root
            [collection]="cityCollection"
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
      }
      return CompositeComponent
    },
    simple() {
      @Component({
        imports: [SelectModule],
        template: `
          <q-select
            defaultOpen
            placeholder="Select a city"
            [collection]="cityCollection"
          />
        `,
      })
      class SimpleComponent {
        cityCollection = selectCollection({items: cityItems})
      }
      return SimpleComponent
    },
    testCase(component) {
      test(`defaultOpen — ${component.name}`, async () => {
        await render(component)

        const trigger = page.getByRole("combobox")
        expect(trigger).toHaveAttribute("aria-expanded", "true")

        const content = page.getByRole("listbox")
        await expect.element(content).toBeVisible()
      })
    },
  },
  {
    composite() {
      @Component({
        imports: [SelectModule, PortalDirective],
        template: `
          <div
            defaultHighlightedValue="Miami"
            placeholder="Select a city"
            q-select-root
            [collection]="cityCollection"
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
      }
      return CompositeComponent
    },
    simple() {
      @Component({
        imports: [SelectModule],
        template: `
          <q-select
            defaultHighlightedValue="Miami"
            placeholder="Select a city"
            [collection]="cityCollection"
          />
        `,
      })
      class SimpleComponent {
        cityCollection = selectCollection({items: cityItems})
      }
      return SimpleComponent
    },
    testCase(component) {
      test(`defaultHighlightedValue — ${component.name}`, async () => {
        await render(component)

        const trigger = page.getByRole("combobox")
        await trigger.click()

        const miamiOption = page.getByRole("option", {name: "Miami"})
        await expect
          .element(miamiOption)
          .toHaveAttribute("data-highlighted", "")
      })
    },
  },
  {
    composite() {
      @Component({
        imports: [SelectModule, PortalDirective],
        template: `
          <button autofocus>focus target</button>
          <div
            placeholder="Select a city"
            q-select-root
            [collection]="cityCollection"
            (focusOutside)="focusOutsideHandler.emit($event)"
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
        focusOutsideHandler = output<any>()
      }
      return CompositeComponent
    },
    simple() {
      @Component({
        imports: [SelectModule],
        template: `
          <button autofocus>focus target</button>
          <q-select
            placeholder="Select a city"
            [collection]="cityCollection"
            (focusOutside)="focusOutsideHandler.emit($event)"
          />
        `,
      })
      class SimpleComponent {
        cityCollection = selectCollection({items: cityItems})
        focusOutsideHandler = output<any>()
      }
      return SimpleComponent
    },
    testCase(component) {
      test(`focusOutside event — ${component.name}`, async () => {
        const focusOutsideWatcher = vi.fn()
        await render(component, {
          on: {focusOutsideHandler: (event) => focusOutsideWatcher(event)},
        })

        const trigger = page.getByRole("combobox")
        await trigger.click()
        await expect.element(trigger).toHaveAttribute("aria-expanded", "true")

        await page.getByText("focus target").click()

        await expect.poll(() => focusOutsideWatcher).toHaveBeenCalled()
      })
    },
  },
  {
    composite() {
      @Component({
        imports: [SelectModule, PortalDirective],
        template: `
          <button data-test-id="outside-button">Outside</button>
          <div
            placeholder="Select a city"
            q-select-root
            [collection]="cityCollection"
            (interactOutside)="interactOutsideHandler.emit($event)"
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
        interactOutsideHandler = output<any>()
      }
      return CompositeComponent
    },
    simple() {
      @Component({
        imports: [SelectModule],
        template: `
          <button data-test-id="outside-button">Outside</button>
          <q-select
            placeholder="Select a city"
            [collection]="cityCollection"
            (interactOutside)="interactOutsideHandler.emit($event)"
          />
        `,
      })
      class SimpleComponent {
        cityCollection = selectCollection({items: cityItems})
        interactOutsideHandler = output<any>()
      }
      return SimpleComponent
    },
    testCase(component) {
      test(`interactOutside event — ${component.name}`, async () => {
        const interactOutsideWatcher = vi.fn()
        await render(component, {
          on: {
            interactOutsideHandler: (event) => interactOutsideWatcher(event),
          },
        })

        const trigger = page.getByRole("combobox")
        await trigger.click()

        await page.getByTestId("outside-button").click()

        await expect.poll(() => interactOutsideWatcher).toHaveBeenCalled()
      })
    },
  },
  {
    composite() {
      @Component({
        imports: [SelectModule, PortalDirective],
        template: `
          <div
            dir="rtl"
            placeholder="Select a city"
            q-select-root
            [collection]="cityCollection"
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
      }
      return CompositeComponent
    },
    simple() {
      @Component({
        imports: [SelectModule],
        template: `
          <q-select
            dir="rtl"
            placeholder="Select a city"
            [collection]="cityCollection"
          />
        `,
      })
      class SimpleComponent {
        cityCollection = selectCollection({items: cityItems})
      }
      return SimpleComponent
    },
    testCase(component) {
      test(`direction RTL — ${component.name}`, async () => {
        await render(component)

        const trigger = page.getByRole("combobox")
        expect(trigger).toHaveAttribute("dir", "rtl")
      })
    },
  },
  {
    composite() {
      @Component({
        imports: [SelectModule, PortalDirective],
        template: `
          <div
            placeholder="Select a city"
            q-select-root
            [collection]="cityCollection"
          >
            <div q-select-label>Choose a city</div>
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
      }
      return CompositeComponent
    },
    simple() {
      @Component({
        imports: [SelectModule],
        template: `
          <q-select
            label="Choose a city"
            placeholder="Select a city"
            [collection]="cityCollection"
          />
        `,
      })
      class SimpleComponent {
        cityCollection = selectCollection({items: cityItems})
      }
      return SimpleComponent
    },
    testCase(component) {
      test(`label — ${component.name}`, async () => {
        await render(component)

        const label = page.getByText("Choose a city")
        await expect.element(label).toBeVisible()

        const trigger = page.getByRole("combobox")
        const labelId = label.element().getAttribute("id")
        await expect
          .element(trigger)
          .toHaveAttribute("aria-labelledby", labelId)
      })
    },
  },
]

describe("Select", () => {
  runTests(testCases)
})
