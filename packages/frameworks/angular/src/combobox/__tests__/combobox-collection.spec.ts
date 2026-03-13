import {Component, signal} from "@angular/core"
import {render} from "@testing-library/angular"
import {describe, expect, test} from "vitest"
import {page} from "vitest/browser"

import {ComboboxModule} from "@qualcomm-ui/angular/combobox"
import {PortalDirective} from "@qualcomm-ui/angular-core/portal"
import {comboboxCollection} from "@qualcomm-ui/core/combobox"

import {type MultiComponentTest, runTests} from "~test-utils"

interface ObjectItem {
  name: string
  value: string
}

const objectCollection = comboboxCollection<ObjectItem>({
  itemLabel: (item) => item.name,
  items: [
    {name: "Item 1", value: "1"},
    {name: "Item 2", value: "2"},
    {name: "Item 3", value: "3"},
  ],
  itemValue: (item) => item.value,
})

const testCases: MultiComponentTest[] = [
  {
    composite() {
      @Component({
        imports: [ComboboxModule, PortalDirective],
        template: `
          <div q-combobox-root [collection]="collection">
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
        collection = objectCollection
      }
      return CompositeComponent
    },
    simple() {
      @Component({
        imports: [ComboboxModule],
        template: `
          <q-combobox label="Label" [collection]="collection" />
        `,
      })
      class SimpleComponent {
        collection = objectCollection
      }
      return SimpleComponent
    },
    testCase(component) {
      test(`object collection displays label, stores value — ${component.name}`, async () => {
        await render(component)

        await page.getByRole("button", {name: /toggle suggestions/i}).click()
        await page.getByRole("option", {name: "Item 2"}).click()

        await expect.element(page.getByRole("listbox")).not.toBeInTheDocument()
        await expect.element(page.getByRole("combobox")).toHaveValue("Item 2")
      })
    },
  },
  {
    composite() {
      @Component({
        imports: [ComboboxModule, PortalDirective],
        template: `
          <div q-combobox-root [collection]="collection" [defaultValue]="['2']">
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
        collection = objectCollection
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
            [defaultValue]="['2']"
          />
        `,
      })
      class SimpleComponent {
        collection = objectCollection
      }
      return SimpleComponent
    },
    testCase(component) {
      test(`default value with object collection — ${component.name}`, async () => {
        await render(component)

        await expect.element(page.getByRole("combobox")).toHaveValue("Item 2")
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
            (valueChanged)="onValueChanged($event)"
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
        collection = objectCollection
        readonly value = signal<string[]>([])
        onValueChanged(details: any) {
          this.value.set(details.value)
        }
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
            (valueChanged)="onValueChanged($event)"
          />
        `,
      })
      class SimpleComponent {
        collection = objectCollection
        readonly value = signal<string[]>([])
        onValueChanged(details: any) {
          this.value.set(details.value)
        }
      }
      return SimpleComponent
    },
    testCase(component) {
      test(`controlled state with object collection — ${component.name}`, async () => {
        await render(component)

        const input = page.getByRole("combobox")
        const trigger = page.getByRole("button", {name: /toggle suggestions/i})

        await trigger.click()
        await page.getByRole("option", {name: "Item 2"}).click()
        await expect.element(input).toHaveValue("Item 2")

        await trigger.click()
        await page.getByRole("option", {name: "Item 3"}).click()
        await expect.element(input).toHaveValue("Item 3")
      })
    },
  },
]

describe("Combobox - Collection", () => {
  runTests(testCases)
})
