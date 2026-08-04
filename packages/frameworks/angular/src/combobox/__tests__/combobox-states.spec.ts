import {Component} from "@angular/core"
import {render} from "@testing-library/angular"
import {describe, expect, test} from "vitest"
import {page} from "vitest/browser"

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
          <div disabled q-combobox-root [collection]="collection">
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
          <q-combobox disabled label="Label" [collection]="collection" />
        `,
      })
      class SimpleComponent {
        collection = stringCollection
      }
      return SimpleComponent
    },
    testCase(component) {
      test(`disabled state prevents interactions — ${component.name}`, async () => {
        await render(component)

        const input = page.getByRole("combobox")
        await expect.element(input).toBeDisabled()

        const trigger = page.getByRole("button", {name: /toggle suggestions/i})
        await trigger.click({force: true})
        await expect.element(page.getByRole("listbox")).not.toBeInTheDocument()
      })
    },
  },
  {
    composite() {
      @Component({
        imports: [ComboboxModule, PortalDirective],
        template: `
          <div q-combobox-root readOnly [collection]="collection">
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
          <q-combobox label="Label" readOnly [collection]="collection" />
        `,
      })
      class SimpleComponent {
        collection = stringCollection
      }
      return SimpleComponent
    },
    testCase(component) {
      test(`readOnly state prevents editing — ${component.name}`, async () => {
        await render(component)

        const input = page.getByRole("combobox")
        await expect.element(input).toHaveAttribute("readOnly")

        const trigger = page.getByRole("button", {name: /toggle suggestions/i})
        await expect.element(trigger).toHaveAttribute("data-readonly")

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
          <div invalid q-combobox-root [collection]="collection">
            <label q-combobox-label>Label</label>
            <div q-combobox-control>
              <input q-combobox-input />
              <div q-combobox-error-indicator></div>
              <button q-combobox-trigger></button>
            </div>
            <div q-combobox-error-text>This field is required</div>
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
            errorText="This field is required"
            invalid
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
      test(`invalid state with error text — ${component.name}`, async () => {
        await render(component)

        const input = page.getByRole("combobox")
        await expect.element(input).toHaveAttribute("data-invalid")
        await expect
          .element(page.getByText("This field is required"))
          .toBeVisible()
      })
    },
  },
  {
    composite() {
      @Component({
        imports: [ComboboxModule, PortalDirective],
        template: `
          <div q-combobox-root required [collection]="collection">
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
          <q-combobox label="Label" required [collection]="collection" />
        `,
      })
      class SimpleComponent {
        collection = stringCollection
      }
      return SimpleComponent
    },
    testCase(component) {
      test(`required state — ${component.name}`, async () => {
        await render(component)

        const input = page.getByRole("combobox")
        await expect.element(input).toBeRequired()
      })
    },
  },
]

describe("Combobox - States", () => {
  runTests(testCases)
})
