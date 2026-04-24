import {Component} from "@angular/core"
import {render} from "@testing-library/angular"
import {describe, expect, test} from "vitest"
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
        collection = stringCollection
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
        collection = stringCollection
      }
      return SimpleComponent
    },
    testCase(component) {
      test(`ArrowDown, ArrowUp, Home, End navigation — ${component.name}`, async () => {
        await render(component)

        const trigger = page.getByRole("button", {name: /toggle suggestions/i})
        await trigger.click()

        await userEvent.keyboard("{ArrowDown}")
        await expect
          .element(page.getByRole("option", {name: "Option 1"}))
          .toHaveAttribute("data-highlighted")

        await userEvent.keyboard("{ArrowDown}")
        await expect
          .element(page.getByRole("option", {name: "Option 2"}))
          .toHaveAttribute("data-highlighted")

        await userEvent.keyboard("{ArrowUp}")
        await expect
          .element(page.getByRole("option", {name: "Option 1"}))
          .toHaveAttribute("data-highlighted")

        await userEvent.keyboard("{End}")
        await expect
          .element(page.getByRole("option", {name: "Option 3"}))
          .toHaveAttribute("data-highlighted")

        await userEvent.keyboard("{Home}")
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
        collection = stringCollection
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
        collection = stringCollection
      }
      return SimpleComponent
    },
    testCase(component) {
      test(`loopFocus wraps from last to first — ${component.name}`, async () => {
        await render(component)

        const trigger = page.getByRole("button", {name: /toggle suggestions/i})
        await trigger.click()

        await userEvent.keyboard("{End}")
        await expect
          .element(page.getByRole("option", {name: "Option 3"}))
          .toHaveAttribute("data-highlighted")

        await userEvent.keyboard("{ArrowDown}")
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
        collection = stringCollection
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
        collection = stringCollection
      }
      return SimpleComponent
    },
    testCase(component) {
      test(`ArrowUp from focused state opens and highlights last item — ${component.name}`, async () => {
        await render(component)

        const input = page.getByRole("combobox")
        await input.click()
        await userEvent.keyboard("{ArrowUp}")

        await expect.element(page.getByRole("listbox")).toBeVisible()
        await expect
          .element(page.getByRole("option", {name: "Option 3"}))
          .toHaveAttribute("data-highlighted")
      })
    },
  },
]

describe("Combobox - Keyboard Navigation", () => {
  runTests(testCases)
})
