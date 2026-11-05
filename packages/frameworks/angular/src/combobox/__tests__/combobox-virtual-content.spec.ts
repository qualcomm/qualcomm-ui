import {Component} from "@angular/core"
import {render} from "@testing-library/angular"
import {describe, expect, test} from "vitest"
import {page} from "vitest/browser"

import {HighlightDirective} from "@qualcomm-ui/angular-core/highlight"
import {PortalDirective} from "@qualcomm-ui/angular-core/portal"
import type {AngularVirtualizerOptions} from "@qualcomm-ui/angular-core/virtual"
import {ComboboxModule} from "@qualcomm-ui/angular/combobox"
import {comboboxCollection} from "@qualcomm-ui/core/combobox"

import {type MultiComponentTest, runTests} from "~test-utils"

const stringCollection = comboboxCollection({
  items: ["Option 1", "Option 2", "Option 3"],
})

const highlightCollection = comboboxCollection({
  items: ["Delta", "Zeta", "Eta"],
})

interface Person {
  id: string
  name: string
  role: string
}

const peopleCollection = comboboxCollection<Person>({
  itemLabel: (item) => item.name,
  items: [
    {id: "ada", name: "Ada Lovelace", role: "Mathematician"},
    {id: "grace", name: "Grace Hopper", role: "Computer Scientist"},
    {id: "katherine", name: "Katherine Johnson", role: "Engineer"},
  ],
  itemValue: (item) => item.id,
})

const testCases: MultiComponentTest[] = [
  {
    composite() {
      @Component({
        imports: [ComboboxModule, HighlightDirective, PortalDirective],
        template: `
          <div q-combobox-root [collection]="collection">
            <label q-combobox-label>Label</label>
            <div q-combobox-control>
              <input q-combobox-input />
              <button q-combobox-trigger></button>
            </div>
            <ng-template qPortal>
              <div q-combobox-positioner>
                <div q-combobox-virtual-content>
                  <div q-combobox-empty>No results</div>
                  <ng-container *comboboxVirtualizer="let virtualizer">
                    @for (
                      virtualItem of virtualizer.getVirtualItems();
                      track virtualItem.index
                    ) {
                      @let item = collection.items.at(virtualItem.index);
                      <div q-combobox-virtual-item [virtualItem]="virtualItem">
                        <span q-combobox-item-text>
                          {{ collection.stringifyItem(item) }}
                        </span>
                        <span q-combobox-item-indicator></span>
                      </div>
                    }
                  </ng-container>
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
          <q-combobox label="Label" virtual [collection]="collection" />
        `,
      })
      class SimpleComponent {
        collection = stringCollection
      }
      return SimpleComponent
    },
    testCase(component) {
      test(`renders virtual options and selects an option — ${component.name}`, async () => {
        await render(component)

        await page.getByRole("button", {name: /toggle suggestions/i}).click()

        await expect.element(page.getByRole("listbox")).toBeVisible()
        await expect
          .element(page.getByRole("option", {name: "Option 2"}))
          .toBeVisible()

        await page.getByRole("option", {name: "Option 2"}).click()

        await expect.element(page.getByRole("listbox")).not.toBeInTheDocument()
        await expect.element(page.getByRole("combobox")).toHaveValue("Option 2")
      })
    },
  },
  {
    composite() {
      @Component({
        imports: [ComboboxModule, PortalDirective],
        template: `
          <div q-combobox-root [collection]="collection">
            <label q-combobox-label>People</label>
            <div q-combobox-control>
              <input q-combobox-input />
              <button q-combobox-trigger></button>
            </div>
            <ng-template qPortal>
              <div q-combobox-positioner>
                <div q-combobox-virtual-content>
                  <div q-combobox-empty>No people found</div>
                  <ng-container *comboboxVirtualizer="let virtualizer">
                    @for (
                      virtualItem of virtualizer.getVirtualItems();
                      track virtualItem.index
                    ) {
                      @let person = collection.items.at(virtualItem.index);
                      <div q-combobox-virtual-item [virtualItem]="virtualItem">
                        <div q-combobox-item-text>
                          <span>{{ person!.name }}</span>
                          <span>{{ person!.role }}</span>
                        </div>
                        <span q-combobox-item-indicator></span>
                      </div>
                    }
                  </ng-container>
                </div>
              </div>
            </ng-template>
          </div>
        `,
      })
      class CompositeComponent {
        collection = peopleCollection
      }
      return CompositeComponent
    },
    simple() {
      @Component({
        imports: [ComboboxModule],
        template: `
          <q-combobox label="People" [collection]="collection">
            <div q-combobox-virtual-content>
              <div q-combobox-empty>No people found</div>
              <ng-container *comboboxVirtualizer="let virtualizer">
                @for (
                  virtualItem of virtualizer.getVirtualItems();
                  track virtualItem.index
                ) {
                  @let person = collection.items.at(virtualItem.index);
                  <div q-combobox-virtual-item [virtualItem]="virtualItem">
                    <div q-combobox-item-text>
                      <span>{{ person!.name }}</span>
                      <span>{{ person!.role }}</span>
                    </div>
                    <span q-combobox-item-indicator></span>
                  </div>
                }
              </ng-container>
            </div>
          </q-combobox>
        `,
      })
      class SimpleComponent {
        collection = peopleCollection
      }
      return SimpleComponent
    },
    testCase(component) {
      test(`renders custom virtual options and selects by item value — ${component.name}`, async () => {
        await render(component)

        await page.getByRole("button", {name: /toggle suggestions/i}).click()

        await expect
          .element(page.getByRole("option", {name: /Grace Hopper/}))
          .toBeVisible()
        await expect.element(page.getByText("Computer Scientist")).toBeVisible()

        await page.getByRole("option", {name: /Grace Hopper/}).click()

        await expect
          .element(page.getByRole("combobox"))
          .toHaveValue("Grace Hopper")
      })
    },
  },
  {
    composite() {
      @Component({
        imports: [ComboboxModule, HighlightDirective, PortalDirective],
        template: `
          <div
            defaultInputValue="ta"
            defaultOpen
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
                <div q-combobox-virtual-content>
                  <div q-combobox-empty>No results</div>
                  <ng-container *comboboxVirtualizer="let virtualizer">
                    @for (
                      virtualItem of virtualizer.getVirtualItems();
                      track virtualItem.index
                    ) {
                      @let item = collection.items.at(virtualItem.index);
                      <div q-combobox-virtual-item [virtualItem]="virtualItem">
                        <span
                          ignoreCase
                          q-combobox-item-text
                          q-highlight
                          [query]="'ta'"
                          [text]="collection.stringifyItem(item)"
                        ></span>
                        <span q-combobox-item-indicator></span>
                      </div>
                    }
                  </ng-container>
                </div>
              </div>
            </ng-template>
          </div>
        `,
      })
      class CompositeComponent {
        collection = highlightCollection
      }
      return CompositeComponent
    },
    simple() {
      @Component({
        imports: [ComboboxModule],
        template: `
          <q-combobox
            defaultInputValue="ta"
            defaultOpen
            highlightMatchingText
            label="Label"
            virtual
            [collection]="collection"
          />
        `,
      })
      class SimpleComponent {
        collection = highlightCollection
      }
      return SimpleComponent
    },
    testCase(component) {
      test(`highlights matching text inside virtual options — ${component.name}`, async () => {
        await render(component)

        const option = page.getByRole("option", {name: "Delta"})
        await expect.element(option).toBeVisible()
        await expect.element(option).toHaveTextContent("Delta")
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
                <div
                  q-combobox-virtual-content
                  [virtualOptions]="virtualOptions"
                >
                  <ng-container *comboboxVirtualizer="let virtualizer">
                    @for (
                      virtualItem of virtualizer.getVirtualItems();
                      track virtualItem.index
                    ) {
                      @let item = collection.items.at(virtualItem.index);
                      <div q-combobox-virtual-item [virtualItem]="virtualItem">
                        <span q-combobox-item-text>
                          {{ collection.stringifyItem(item) }}
                        </span>
                        <span q-combobox-item-indicator></span>
                      </div>
                    }
                  </ng-container>
                </div>
              </div>
            </ng-template>
          </div>
        `,
      })
      class CompositeComponent {
        collection = stringCollection
        virtualOptions: Partial<
          AngularVirtualizerOptions<HTMLDivElement, HTMLDivElement>
        > = {
          rangeExtractor: () => [1],
        }
      }
      return CompositeComponent
    },
    testCase(component) {
      test(`forwards virtualizer options to choose rendered options — ${component.name}`, async () => {
        await render(component)

        await expect
          .element(page.getByRole("option", {name: "Option 2"}))
          .toBeVisible()
        await expect
          .element(page.getByRole("option", {name: "Option 1"}))
          .not.toBeInTheDocument()
        await expect
          .element(page.getByRole("option", {name: "Option 3"}))
          .not.toBeInTheDocument()
      })
    },
  },
]

describe("Combobox - Virtual Content", () => {
  runTests(testCases)
})
