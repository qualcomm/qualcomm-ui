import {Component, output} from "@angular/core"
import {render} from "@testing-library/angular"
import {describe, expect, test, vi} from "vitest"
import {page, userEvent} from "vitest/browser"

import {ComboboxModule} from "@qualcomm-ui/angular/combobox"
import {PortalDirective} from "@qualcomm-ui/angular-core/portal"
import {comboboxCollection} from "@qualcomm-ui/core/combobox"

import {type MultiComponentTest, runTests} from "~test-utils"

const stringCollection = comboboxCollection({
  items: ["Option 1", "Option 2", "Option 3"],
})

const testCases: MultiComponentTest[] = [
  {
    composite() {
      @Component({
        imports: [ComboboxModule, PortalDirective],
        template: `
          <div
            q-combobox-root
            [collection]="collection"
            (valueChanged)="valueChangedHandler.emit($event)"
          >
            <label q-combobox-label>Label</label>
            <div q-combobox-control>
              <input q-combobox-input />
              <button q-combobox-trigger></button>
            </div>
            <ng-template qPortal>
              <div q-combobox-positioner>
                <div q-combobox-content>
                  @for (item of collection.items; track item) {
                    <div q-combobox-item [item]="item">
                      <span q-combobox-item-text>
                        {{ collection.stringifyItem(item) }}
                      </span>
                      <span q-combobox-item-indicator></span>
                    </div>
                  }
                </div>
              </div>
            </ng-template>
          </div>
        `,
      })
      class CompositeComponent {
        collection = stringCollection
        valueChangedHandler = output<any>()
      }
      return CompositeComponent
    },
    simple() {
      @Component({
        imports: [ComboboxModule],
        template: `
          <q-combobox
            label="Label"
            [collection]="collection"
            (valueChanged)="valueChangedHandler.emit($event)"
          />
        `,
      })
      class SimpleComponent {
        collection = stringCollection
        valueChangedHandler = output<any>()
      }
      return SimpleComponent
    },
    testCase(component) {
      test(`valueChanged fires on selection — ${component.name}`, async () => {
        const valueChangedWatcher = vi.fn()
        await render(component, {
          on: {valueChangedHandler: (event) => valueChangedWatcher(event)},
        })

        await page.getByRole("button", {name: /toggle suggestions/i}).click()
        await page.getByRole("option", {name: "Option 1"}).click()

        await expect
          .poll(() => valueChangedWatcher)
          .toHaveBeenCalledWith(
            expect.objectContaining({
              items: ["Option 1"],
              value: ["Option 1"],
            }),
          )
      })
    },
  },
  {
    composite() {
      @Component({
        imports: [ComboboxModule, PortalDirective],
        template: `
          <div
            q-combobox-root
            [collection]="collection"
            (inputValueChanged)="inputValueChangedHandler.emit($event)"
          >
            <label q-combobox-label>Label</label>
            <div q-combobox-control>
              <input q-combobox-input />
              <button q-combobox-trigger></button>
            </div>
            <ng-template qPortal>
              <div q-combobox-positioner>
                <div q-combobox-content>
                  @for (item of collection.items; track item) {
                    <div q-combobox-item [item]="item">
                      <span q-combobox-item-text>
                        {{ collection.stringifyItem(item) }}
                      </span>
                      <span q-combobox-item-indicator></span>
                    </div>
                  }
                </div>
              </div>
            </ng-template>
          </div>
        `,
      })
      class CompositeComponent {
        collection = stringCollection
        inputValueChangedHandler = output<any>()
      }
      return CompositeComponent
    },
    simple() {
      @Component({
        imports: [ComboboxModule],
        template: `
          <q-combobox
            label="Label"
            [collection]="collection"
            (inputValueChanged)="inputValueChangedHandler.emit($event)"
          />
        `,
      })
      class SimpleComponent {
        collection = stringCollection
        inputValueChangedHandler = output<any>()
      }
      return SimpleComponent
    },
    testCase(component) {
      test(`inputValueChanged fires on typing — ${component.name}`, async () => {
        const inputValueChangedWatcher = vi.fn()
        await render(component, {
          on: {
            inputValueChangedHandler: (event) =>
              inputValueChangedWatcher(event),
          },
        })

        const input = page.getByRole("combobox")
        await input.click()
        await userEvent.keyboard("t")

        await expect.poll(() => inputValueChangedWatcher).toHaveBeenCalled()
      })
    },
  },
  {
    composite() {
      @Component({
        imports: [ComboboxModule, PortalDirective],
        template: `
          <div
            q-combobox-root
            [collection]="collection"
            (openChanged)="openChangedHandler.emit($event)"
          >
            <label q-combobox-label>Label</label>
            <div q-combobox-control>
              <input q-combobox-input />
              <button q-combobox-trigger></button>
            </div>
            <ng-template qPortal>
              <div q-combobox-positioner>
                <div q-combobox-content>
                  @for (item of collection.items; track item) {
                    <div q-combobox-item [item]="item">
                      <span q-combobox-item-text>
                        {{ collection.stringifyItem(item) }}
                      </span>
                      <span q-combobox-item-indicator></span>
                    </div>
                  }
                </div>
              </div>
            </ng-template>
          </div>
        `,
      })
      class CompositeComponent {
        collection = stringCollection
        openChangedHandler = output<any>()
      }
      return CompositeComponent
    },
    simple() {
      @Component({
        imports: [ComboboxModule],
        template: `
          <q-combobox
            label="Label"
            [collection]="collection"
            (openChanged)="openChangedHandler.emit($event)"
          />
        `,
      })
      class SimpleComponent {
        collection = stringCollection
        openChangedHandler = output<any>()
      }
      return SimpleComponent
    },
    testCase(component) {
      test(`openChanged fires on open and close — ${component.name}`, async () => {
        const openChangedWatcher = vi.fn()
        await render(component, {
          on: {openChangedHandler: (event) => openChangedWatcher(event)},
        })

        const trigger = page.getByRole("button", {name: /toggle suggestions/i})
        await trigger.click()

        await expect
          .poll(() => openChangedWatcher)
          .toHaveBeenCalledWith(expect.objectContaining({open: true}))

        await userEvent.keyboard("{Escape}")

        await expect
          .poll(() => openChangedWatcher)
          .toHaveBeenCalledWith(expect.objectContaining({open: false}))
      })
    },
  },
  {
    composite() {
      @Component({
        imports: [ComboboxModule, PortalDirective],
        template: `
          <div
            q-combobox-root
            [collection]="collection"
            (highlightChanged)="highlightChangedHandler.emit($event)"
          >
            <label q-combobox-label>Label</label>
            <div q-combobox-control>
              <input q-combobox-input />
              <button q-combobox-trigger></button>
            </div>
            <ng-template qPortal>
              <div q-combobox-positioner>
                <div q-combobox-content>
                  @for (item of collection.items; track item) {
                    <div q-combobox-item [item]="item">
                      <span q-combobox-item-text>
                        {{ collection.stringifyItem(item) }}
                      </span>
                      <span q-combobox-item-indicator></span>
                    </div>
                  }
                </div>
              </div>
            </ng-template>
          </div>
        `,
      })
      class CompositeComponent {
        collection = stringCollection
        highlightChangedHandler = output<any>()
      }
      return CompositeComponent
    },
    simple() {
      @Component({
        imports: [ComboboxModule],
        template: `
          <q-combobox
            label="Label"
            [collection]="collection"
            (highlightChanged)="highlightChangedHandler.emit($event)"
          />
        `,
      })
      class SimpleComponent {
        collection = stringCollection
        highlightChangedHandler = output<any>()
      }
      return SimpleComponent
    },
    testCase(component) {
      test(`highlightChanged fires on keyboard navigation — ${component.name}`, async () => {
        const highlightChangedWatcher = vi.fn()
        await render(component, {
          on: {
            highlightChangedHandler: (event) => highlightChangedWatcher(event),
          },
        })

        await page.getByRole("button", {name: /toggle suggestions/i}).click()
        await userEvent.keyboard("{ArrowDown}")

        await expect
          .poll(() => highlightChangedWatcher)
          .toHaveBeenCalledWith(expect.objectContaining({value: "Option 1"}))
      })
    },
  },
]

describe("Combobox - Callbacks", () => {
  runTests(testCases)
})
