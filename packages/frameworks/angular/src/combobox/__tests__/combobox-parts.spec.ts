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

const emptyCollection = comboboxCollection({
  items: [],
})

const testIds = {
  clearTrigger: "combobox-clear-trigger",
  content: "combobox-content",
  control: "combobox-control",
  hint: "combobox-hint",
  label: "combobox-label",
  positioner: "combobox-positioner",
  root: "combobox-root",
}

const testCases: MultiComponentTest[] = [
  {
    composite() {
      @Component({
        imports: [ComboboxModule, PortalDirective],
        template: `
          <div q-combobox-root [collection]="collection">
            <label q-combobox-label>Combobox Label</label>
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
          <q-combobox label="Combobox Label" [collection]="collection" />
        `,
      })
      class SimpleComponent {
        collection = stringCollection
      }
      return SimpleComponent
    },
    testCase(component) {
      test(`label renders and associates with input — ${component.name}`, async () => {
        await render(component)

        await expect.element(page.getByText("Combobox Label")).toBeVisible()
        await expect.element(page.getByRole("combobox")).toBeVisible()
      })
    },
  },
  {
    simple() {
      @Component({
        imports: [ComboboxModule],
        template: `
          <q-combobox aria-label="City" [collection]="collection" />
        `,
      })
      class SimpleComponent {
        collection = stringCollection
      }
      return SimpleComponent
    },
    testCase(component) {
      test(`aria-label labels the input — ${component.name}`, async () => {
        await render(component)

        await expect
          .element(page.getByRole("combobox", {name: "City"}))
          .toBeVisible()
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
            <div q-combobox-hint>This is a hint</div>
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
            hint="This is a hint"
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
      test(`hint text renders — ${component.name}`, async () => {
        await render(component)

        await expect.element(page.getByText("This is a hint")).toBeVisible()
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
                  <div q-combobox-empty>No results</div>
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
        collection = emptyCollection
      }
      return CompositeComponent
    },
    simple() {
      @Component({
        imports: [ComboboxModule],
        template: `
          <q-combobox
            defaultOpen
            emptyText="No results"
            label="Label"
            [collection]="collection"
          />
        `,
      })
      class SimpleComponent {
        collection = emptyCollection
      }
      return SimpleComponent
    },
    testCase(component) {
      test(`empty state renders when collection is empty — ${component.name}`, async () => {
        await render(component)

        await expect.element(page.getByText("No results")).toBeVisible()
      })
    },
  },
  {
    composite() {
      @Component({
        imports: [ComboboxModule, PortalDirective],
        template: `
          <div
            placeholder="Search..."
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
            label="Label"
            placeholder="Search..."
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
      test(`placeholder renders on input — ${component.name}`, async () => {
        await render(component)

        await expect
          .element(page.getByRole("combobox"))
          .toHaveAttribute("placeholder", "Search...")
      })
    },
  },
  {
    composite() {
      @Component({
        imports: [ComboboxModule, PortalDirective],
        template: `
          <div
            data-test-id="${testIds.root}"
            q-combobox-root
            [collection]="collection"
          >
            <label data-test-id="${testIds.label}" q-combobox-label>
              Label
            </label>
            <div data-test-id="${testIds.control}" q-combobox-control>
              <input q-combobox-input />
              <button
                data-test-id="${testIds.clearTrigger}"
                q-combobox-clear-trigger
              ></button>
              <button q-combobox-trigger></button>
            </div>
            <div data-test-id="${testIds.hint}" q-combobox-hint>Hint text</div>
            <ng-template qPortal>
              <div data-test-id="${testIds.positioner}" q-combobox-positioner>
                <div data-test-id="${testIds.content}" q-combobox-content>
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
    testCase(component) {
      test(`all parts render with correct test ids — ${component.name}`, async () => {
        await render(component)

        await expect.element(page.getByTestId(testIds.root)).toBeVisible()
        await expect.element(page.getByTestId(testIds.label)).toBeVisible()
        await expect.element(page.getByTestId(testIds.control)).toBeVisible()
        await expect.element(page.getByTestId(testIds.hint)).toBeVisible()

        await page.getByRole("button", {name: /toggle suggestions/i}).click()

        await expect.element(page.getByTestId(testIds.positioner)).toBeVisible()
        await expect.element(page.getByTestId(testIds.content)).toBeVisible()
      })
    },
  },
]

describe("Combobox - Parts", () => {
  runTests(testCases)

  test("context template exposes live combobox state", async () => {
    @Component({
      imports: [ComboboxModule, PortalDirective],
      template: `
        <div q-combobox-root [collection]="collection">
          <label q-combobox-label>Context Label</label>
          <ng-container *comboboxContext="let context">
            <div data-test-id="combobox-context-state">
              {{ context.open ? "open" : "closed" }}
            </div>
          </ng-container>
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
    class ContextComponent {
      collection = stringCollection
    }

    await render(ContextComponent)

    const contextState = page.getByTestId("combobox-context-state")
    await expect.element(contextState).toHaveTextContent("closed")

    await page.getByRole("button", {name: /toggle suggestions/i}).click()

    await expect.element(contextState).toHaveTextContent("open")
  })
})
