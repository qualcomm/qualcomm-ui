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
      test(`opens and closes dropdown via trigger — ${component.name}`, async () => {
        await render(component)

        const trigger = page.getByRole("button", {name: /toggle suggestions/i})
        await expect.element(page.getByRole("listbox")).not.toBeInTheDocument()

        await trigger.click()
        await expect.element(page.getByRole("listbox")).toBeVisible()

        await userEvent.keyboard("{Escape}")
        await expect.element(page.getByRole("listbox")).not.toBeInTheDocument()
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
      test(`opens dropdown on input typing — ${component.name}`, async () => {
        await render(component)

        const input = page.getByRole("combobox")
        await input.click()
        await userEvent.keyboard("O")

        await expect.element(page.getByRole("listbox")).toBeVisible()
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
      test(`opens dropdown on ArrowDown from focused input — ${component.name}`, async () => {
        await render(component)

        const input = page.getByRole("combobox")
        await input.click()
        await userEvent.keyboard("{ArrowDown}")

        await expect.element(page.getByRole("listbox")).toBeVisible()
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
      test(`closes dropdown via trigger click while open — ${component.name}`, async () => {
        await render(component)

        const trigger = page.getByRole("button", {name: /toggle suggestions/i})
        await trigger.click()
        await expect.element(page.getByRole("listbox")).toBeVisible()

        await trigger.click()
        await expect.element(page.getByRole("listbox")).not.toBeInTheDocument()
      })
    },
  },
  {
    composite() {
      @Component({
        imports: [ComboboxModule, PortalDirective],
        template: `
          <div defaultOpen q-combobox-root [collection]="collection">
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
          <q-combobox defaultOpen label="Label" [collection]="collection" />
        `,
      })
      class SimpleComponent {
        collection = stringCollection
      }
      return SimpleComponent
    },
    testCase(component) {
      test(`defaultOpen renders with dropdown initially open — ${component.name}`, async () => {
        await render(component)

        await expect.element(page.getByRole("listbox")).toBeVisible()
      })
    },
  },
]

describe("Combobox - Open/Close", () => {
  runTests(testCases)
})
