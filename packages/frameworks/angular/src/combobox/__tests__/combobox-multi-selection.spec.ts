import {Component} from "@angular/core"
import {render} from "@testing-library/angular"
import {describe, expect, test} from "vitest"
import {page} from "vitest/browser"

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
          <div multiple q-combobox-root [collection]="collection">
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
      }
      return CompositeComponent
    },
    simple() {
      @Component({
        imports: [ComboboxModule],
        template: `
          <q-combobox label="Label" multiple [collection]="collection" />
        `,
      })
      class SimpleComponent {
        collection = stringCollection
      }
      return SimpleComponent
    },
    testCase(component) {
      test(`multiple selection toggles items and stays open — ${component.name}`, async () => {
        await render(component)

        const trigger = page.getByRole("button", {name: /toggle suggestions/i})
        await trigger.click()

        await page.getByRole("option", {name: "Option 1"}).click()
        await expect.element(page.getByRole("listbox")).toBeVisible()

        await page.getByRole("option", {name: "Option 3"}).click()
        await expect.element(page.getByRole("listbox")).toBeVisible()

        await expect
          .element(page.getByRole("option", {name: "Option 1"}))
          .toHaveAttribute("data-state", "checked")
        await expect
          .element(page.getByRole("option", {name: "Option 3"}))
          .toHaveAttribute("data-state", "checked")
      })
    },
  },
  {
    composite() {
      @Component({
        imports: [ComboboxModule, PortalDirective],
        template: `
          <div multiple q-combobox-root [collection]="collection">
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
      }
      return CompositeComponent
    },
    simple() {
      @Component({
        imports: [ComboboxModule],
        template: `
          <q-combobox label="Label" multiple [collection]="collection" />
        `,
      })
      class SimpleComponent {
        collection = stringCollection
      }
      return SimpleComponent
    },
    testCase(component) {
      test(`multiple selection deselects on second click — ${component.name}`, async () => {
        await render(component)

        const trigger = page.getByRole("button", {name: /toggle suggestions/i})
        await trigger.click()

        await page.getByRole("option", {name: "Option 1"}).click()
        await expect
          .element(page.getByRole("option", {name: "Option 1"}))
          .toHaveAttribute("data-state", "checked")

        await page.getByRole("option", {name: "Option 1"}).click()
        await expect
          .element(page.getByRole("option", {name: "Option 1"}))
          .toHaveAttribute("data-state", "unchecked")
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
            [closeOnSelect]="false"
            [collection]="collection"
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
      }
      return CompositeComponent
    },
    simple() {
      @Component({
        imports: [ComboboxModule],
        template: `
          <q-combobox
            label="Label"
            [closeOnSelect]="false"
            [collection]="collection"
          />
        `,
      })
      class SimpleComponent {
        collection = stringCollection
      }
      return SimpleComponent
    },
    testCase(component) {
      test(`closeOnSelect false keeps dropdown open in single mode — ${component.name}`, async () => {
        await render(component)

        const trigger = page.getByRole("button", {name: /toggle suggestions/i})
        await trigger.click()

        await page.getByRole("option", {name: "Option 1"}).click()
        await expect.element(page.getByRole("listbox")).toBeVisible()
      })
    },
  },
  {
    composite() {
      @Component({
        imports: [ComboboxModule, PortalDirective],
        template: `
          <div multiple q-combobox-root [collection]="collection">
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
      }
      return CompositeComponent
    },
    simple() {
      @Component({
        imports: [ComboboxModule],
        template: `
          <q-combobox label="Label" multiple [collection]="collection" />
        `,
      })
      class SimpleComponent {
        collection = stringCollection
      }
      return SimpleComponent
    },
    testCase(component) {
      test(`selectionBehavior clear clears input in multiple mode — ${component.name}`, async () => {
        await render(component)

        const input = page.getByRole("combobox")
        const trigger = page.getByRole("button", {name: /toggle suggestions/i})
        await trigger.click()

        await page.getByRole("option", {name: "Option 1"}).click()
        await expect.element(input).toHaveValue("")
      })
    },
  },
]

describe("Combobox - Multiple Selection", () => {
  runTests(testCases)
})
