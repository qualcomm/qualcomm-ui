import {Component} from "@angular/core"
import {render} from "@testing-library/angular"
import {describe, expect, test} from "vitest"
import {page, userEvent} from "vitest/browser"

import {PortalDirective} from "@qualcomm-ui/angular-core/portal"
import {ComboboxModule} from "@qualcomm-ui/angular/combobox"
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
            inputBehavior="autohighlight"
            q-combobox-root
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
            inputBehavior="autohighlight"
            label="Label"
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
      test(`inputBehavior autohighlight auto-highlights first item — ${component.name}`, async () => {
        await render(component)

        const input = page.getByRole("combobox")
        await input.click()
        await userEvent.keyboard("O")

        await expect.element(page.getByRole("listbox")).toBeVisible()
        await expect
          .element(page.getByRole("option", {name: "Option 1"}))
          .toHaveAttribute("data-highlighted")
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
            selectionBehavior="preserve"
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
            selectionBehavior="preserve"
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
      test(`selectionBehavior preserve keeps input text after selection — ${component.name}`, async () => {
        await render(component)

        const input = page.getByRole("combobox")
        await input.click()
        await userEvent.keyboard("Op")

        await expect.element(page.getByRole("listbox")).toBeVisible()
        await page.getByRole("option", {name: "Option 1"}).click()

        await expect.element(input).toHaveValue("Op")
      })
    },
  },
  {
    composite() {
      @Component({
        imports: [ComboboxModule, PortalDirective],
        template: `
          <div allowCustomValue q-combobox-root [collection]="collection">
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
            allowCustomValue
            label="Label"
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
      test(`allowCustomValue permits non-collection input — ${component.name}`, async () => {
        await render(component)

        const input = page.getByRole("combobox")
        await input.click()
        await userEvent.keyboard("Custom")
        await userEvent.keyboard("{Escape}")

        await expect.element(input).toHaveValue("Custom")
      })
    },
  },
]

describe("Combobox - Input Behavior", () => {
  runTests(testCases)
})
