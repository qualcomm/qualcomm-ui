import {Component, output, signal} from "@angular/core"
import {render} from "@testing-library/angular"
import {Code, FileText} from "lucide-angular"
import {describe, expect, test, vi} from "vitest"
import {page, userEvent} from "vitest/browser"

import {TabsModule} from "@qualcomm-ui/angular/tabs"
import {provideIcons} from "@qualcomm-ui/angular-core/lucide"

const tabItems = [
  {content: "Documents content", title: "Documents", value: "documents"},
  {content: "Products content", title: "Products", value: "products"},
  {content: "Software content", title: "Software", value: "software"},
  {content: "Hardware content", title: "Hardware", value: "hardware"},
]

describe("tabs", () => {
  test("renders all tabs and panels", async () => {
    @Component({
      imports: [TabsModule],
      template: `
        <div q-tabs-root>
          <div q-tabs-list>
            <div q-tabs-indicator></div>
            @for (item of items; track item.value) {
              <div q-tab-root [value]="item.value">
                <button q-tab-button>{{ item.title }}</button>
              </div>
            }
          </div>
          @for (item of items; track item.value) {
            <div q-tabs-panel [value]="item.value">{{ item.content }}</div>
          }
        </div>
      `,
    })
    class TestComponent {
      protected readonly items = tabItems
    }

    await render(TestComponent)

    for (const item of tabItems) {
      await expect
        .element(page.getByRole("tab", {name: item.title}))
        .toBeVisible()
    }
  })

  test("no panel is visible without defaultValue", async () => {
    @Component({
      imports: [TabsModule],
      template: `
        <div q-tabs-root>
          <div q-tabs-list>
            <div q-tabs-indicator></div>
            @for (item of items; track item.value) {
              <div q-tab-root [value]="item.value">
                <button q-tab-button>{{ item.title }}</button>
              </div>
            }
          </div>
          @for (item of items; track item.value) {
            <div q-tabs-panel [value]="item.value">{{ item.content }}</div>
          }
        </div>
      `,
    })
    class TestComponent {
      protected readonly items = tabItems
    }

    await render(TestComponent)

    for (const item of tabItems) {
      expect(page.getByText(item.content)).not.toBeVisible()
    }
  })

  test("shows default panel when defaultValue is set", async () => {
    @Component({
      imports: [TabsModule],
      template: `
        <div q-tabs-root [defaultValue]="defaultValue">
          <div q-tabs-list>
            <div q-tabs-indicator></div>
            @for (item of items; track item.value) {
              <div q-tab-root [value]="item.value">
                <button q-tab-button>{{ item.title }}</button>
              </div>
            }
          </div>
          @for (item of items; track item.value) {
            <div q-tabs-panel [value]="item.value">{{ item.content }}</div>
          }
        </div>
      `,
    })
    class TestComponent {
      protected readonly items = tabItems
      protected readonly defaultValue = "products"
    }

    await render(TestComponent)

    await expect.element(page.getByText("Products content")).toBeVisible()
    expect(page.getByText("Documents content")).not.toBeVisible()
    expect(page.getByText("Software content")).not.toBeVisible()
  })

  test("clicking tab changes active panel", async () => {
    @Component({
      imports: [TabsModule],
      template: `
        <div defaultValue="documents" q-tabs-root>
          <div q-tabs-list>
            <div q-tabs-indicator></div>
            @for (item of items; track item.value) {
              <div q-tab-root [value]="item.value">
                <button q-tab-button>{{ item.title }}</button>
              </div>
            }
          </div>
          @for (item of items; track item.value) {
            <div q-tabs-panel [value]="item.value">{{ item.content }}</div>
          }
        </div>
      `,
    })
    class TestComponent {
      protected readonly items = tabItems
    }

    await render(TestComponent)

    await expect.element(page.getByText("Documents content")).toBeVisible()

    await page.getByRole("tab", {name: "Products"}).click()
    await expect.element(page.getByText("Products content")).toBeVisible()
    expect(page.getByText("Documents content")).not.toBeVisible()

    await page.getByRole("tab", {name: "Software"}).click()
    await expect.element(page.getByText("Software content")).toBeVisible()
    expect(page.getByText("Products content")).not.toBeVisible()
  })

  test("valueChanged emits when tab selection changes", async () => {
    @Component({
      imports: [TabsModule],
      template: `
        <div
          defaultValue="documents"
          q-tabs-root
          (valueChanged)="valueChanged.emit($event)"
        >
          <div q-tabs-list>
            <div q-tabs-indicator></div>
            @for (item of items; track item.value) {
              <div q-tab-root [value]="item.value">
                <button q-tab-button>{{ item.title }}</button>
              </div>
            }
          </div>
        </div>
      `,
    })
    class TestComponent {
      protected readonly items = tabItems
      readonly valueChanged = output<string>()
    }

    const valueChangedSpy = vi.fn()
    await render(TestComponent, {
      on: {valueChanged: (value) => valueChangedSpy(value)},
    })

    await page.getByRole("tab", {name: "Products"}).click()
    expect(valueChangedSpy).toHaveBeenCalledExactlyOnceWith("products")

    await page.getByRole("tab", {name: "Software"}).click()
    expect(valueChangedSpy).toHaveBeenLastCalledWith("software")
  })

  test("controlled value with value input", async () => {
    @Component({
      imports: [TabsModule],
      template: `
        <div q-tabs-root [value]="value()" (valueChanged)="value.set($event)">
          <div q-tabs-list>
            <div q-tabs-indicator></div>
            @for (item of items; track item.value) {
              <div q-tab-root [value]="item.value">
                <button q-tab-button>{{ item.title }}</button>
              </div>
            }
          </div>
          @for (item of items; track item.value) {
            <div q-tabs-panel [value]="item.value">{{ item.content }}</div>
          }
        </div>
        <button (click)="value.set('software')">Set Software</button>
      `,
    })
    class TestComponent {
      protected readonly items = tabItems
      readonly value = signal<string>("documents")
    }

    await render(TestComponent)

    await expect.element(page.getByText("Documents content")).toBeVisible()

    await page.getByRole("tab", {name: "Products"}).click()
    await expect.element(page.getByText("Products content")).toBeVisible()

    await page.getByText("Set Software").click()
    await expect.element(page.getByText("Software content")).toBeVisible()
  })

  test("keyboard navigation with arrow keys", async () => {
    @Component({
      imports: [TabsModule],
      template: `
        <div defaultValue="documents" q-tabs-root>
          <div q-tabs-list>
            <div q-tabs-indicator></div>
            @for (item of items; track item.value) {
              <div q-tab-root [value]="item.value">
                <button q-tab-button>{{ item.title }}</button>
              </div>
            }
          </div>
        </div>
      `,
    })
    class TestComponent {
      protected readonly items = tabItems
    }

    await render(TestComponent)

    const documentsTab = page.getByRole("tab", {name: "Documents"})
    const productsTab = page.getByRole("tab", {name: "Products"})
    const softwareTab = page.getByRole("tab", {name: "Software"})
    const hardwareTab = page.getByRole("tab", {name: "Hardware"})

    await userEvent.tab()
    expect(documentsTab).toHaveFocus()

    await userEvent.keyboard("{ArrowRight}")
    expect(productsTab).toHaveFocus()

    await userEvent.keyboard("{ArrowRight}")
    expect(softwareTab).toHaveFocus()

    await userEvent.keyboard("{ArrowLeft}")
    expect(productsTab).toHaveFocus()

    await userEvent.keyboard("{Home}")
    expect(documentsTab).toHaveFocus()

    await userEvent.keyboard("{End}")
    expect(hardwareTab).toHaveFocus()
  })

  test("keyboard navigation wraps around", async () => {
    @Component({
      imports: [TabsModule],
      template: `
        <div defaultValue="documents" q-tabs-root>
          <div q-tabs-list>
            <div q-tabs-indicator></div>
            @for (item of items; track item.value) {
              <div q-tab-root [value]="item.value">
                <button q-tab-button>{{ item.title }}</button>
              </div>
            }
          </div>
        </div>
      `,
    })
    class TestComponent {
      protected readonly items = tabItems
    }

    await render(TestComponent)

    const documentsTab = page.getByRole("tab", {name: "Documents"})
    const hardwareTab = page.getByRole("tab", {name: "Hardware"})

    await userEvent.tab()
    expect(documentsTab).toHaveFocus()

    await userEvent.keyboard("{ArrowLeft}")
    expect(hardwareTab).toHaveFocus()

    await userEvent.keyboard("{ArrowRight}")
    expect(documentsTab).toHaveFocus()
  })

  test("vertical orientation uses up/down arrow keys", async () => {
    @Component({
      imports: [TabsModule],
      template: `
        <div defaultValue="documents" orientation="vertical" q-tabs-root>
          <div q-tabs-list>
            <div q-tabs-indicator></div>
            @for (item of items; track item.value) {
              <div q-tab-root [value]="item.value">
                <button q-tab-button>{{ item.title }}</button>
              </div>
            }
          </div>
        </div>
      `,
    })
    class TestComponent {
      protected readonly items = tabItems
    }

    await render(TestComponent)

    const documentsTab = page.getByRole("tab", {name: "Documents"})
    const productsTab = page.getByRole("tab", {name: "Products"})

    await userEvent.tab()
    expect(documentsTab).toHaveFocus()

    await userEvent.keyboard("{ArrowDown}")
    expect(productsTab).toHaveFocus()

    await userEvent.keyboard("{ArrowUp}")
    expect(documentsTab).toHaveFocus()

    await userEvent.keyboard("{ArrowRight}")
    expect(documentsTab).toHaveFocus()
  })

  test("disabled tab cannot be selected", async () => {
    @Component({
      imports: [TabsModule],
      template: `
        <div defaultValue="documents" q-tabs-root>
          <div q-tabs-list>
            <div q-tabs-indicator></div>
            <div q-tab-root value="documents">
              <button q-tab-button>Documents</button>
            </div>
            <div disabled q-tab-root value="products">
              <button q-tab-button>Products</button>
            </div>
            <div q-tab-root value="software">
              <button q-tab-button>Software</button>
            </div>
          </div>
          <div q-tabs-panel value="documents">Documents content</div>
          <div q-tabs-panel value="products">Products content</div>
          <div q-tabs-panel value="software">Software content</div>
        </div>
      `,
    })
    class TestComponent {}

    await render(TestComponent)

    const productsTab = page.getByRole("tab", {name: "Products"})
    expect(productsTab).toBeDisabled()

    await productsTab.click({force: true})
    expect(page.getByText("Products content")).not.toBeVisible()
    await expect.element(page.getByText("Documents content")).toBeVisible()
  })

  test("tab button with startIcon", async () => {
    @Component({
      imports: [TabsModule],
      providers: [provideIcons({FileText})],
      template: `
        <div defaultValue="documents" q-tabs-root>
          <div q-tabs-list>
            <div q-tabs-indicator></div>
            <div q-tab-root value="documents">
              <button q-tab-button startIcon="FileText">Documents</button>
            </div>
          </div>
        </div>
      `,
    })
    class TestComponent {}

    await render(TestComponent)

    const tab = page.getByRole("tab", {name: "Documents"})
    await expect.element(tab).toBeVisible()
    expect(tab.element().querySelector("svg")).toBeTruthy()
  })

  test("tab button with endIcon", async () => {
    @Component({
      imports: [TabsModule],
      providers: [provideIcons({Code})],
      template: `
        <div defaultValue="software" q-tabs-root>
          <div q-tabs-list>
            <div q-tabs-indicator></div>
            <div q-tab-root value="software">
              <button endIcon="Code" q-tab-button>Software</button>
            </div>
          </div>
        </div>
      `,
    })
    class TestComponent {}

    await render(TestComponent)

    const tab = page.getByRole("tab", {name: "Software"})
    await expect.element(tab).toBeVisible()
    expect(tab.element().querySelector("svg")).toBeTruthy()
  })

  test("tab button with both startIcon and endIcon", async () => {
    @Component({
      imports: [TabsModule],
      providers: [provideIcons({Code, FileText})],
      template: `
        <div defaultValue="documents" q-tabs-root>
          <div q-tabs-list>
            <div q-tabs-indicator></div>
            <div q-tab-root value="documents">
              <button endIcon="Code" q-tab-button startIcon="FileText">
                Documents
              </button>
            </div>
          </div>
        </div>
      `,
    })
    class TestComponent {}

    await render(TestComponent)

    const tab = page.getByRole("tab", {name: "Documents"})
    await expect.element(tab).toBeVisible()
    expect(tab.element().querySelectorAll("svg")).toHaveLength(2)
  })

  test("variant line applies correct styling", async () => {
    @Component({
      imports: [TabsModule],
      template: `
        <div defaultValue="documents" q-tabs-root variant="line">
          <div q-tabs-list>
            <div q-tabs-indicator></div>
            <div q-tab-root value="documents">
              <button q-tab-button>Documents</button>
            </div>
          </div>
        </div>
      `,
    })
    class TestComponent {}

    await render(TestComponent)

    const tabsList = page.getByRole("tablist")
    expect(tabsList).toHaveAttribute("data-variant", "line")
  })

  test("variant contained applies correct styling", async () => {
    @Component({
      imports: [TabsModule],
      template: `
        <div defaultValue="documents" q-tabs-root variant="contained">
          <div q-tabs-list>
            <div q-tabs-indicator></div>
            <div q-tab-root value="documents">
              <button q-tab-button>Documents</button>
            </div>
          </div>
        </div>
      `,
    })
    class TestComponent {}

    await render(TestComponent)

    const tabsList = page.getByRole("tablist")
    expect(tabsList).toHaveAttribute("data-variant", "contained")
  })

  test("size property applies correct size", async () => {
    @Component({
      imports: [TabsModule],
      template: `
        <div defaultValue="documents" q-tabs-root size="lg">
          <div q-tabs-list>
            <div q-tabs-indicator></div>
            <div q-tab-root value="documents">
              <button q-tab-button>Documents</button>
            </div>
          </div>
        </div>
      `,
    })
    class TestComponent {}

    await render(TestComponent)

    const tabsList = page.getByRole("tablist")
    expect(tabsList).toHaveAttribute("data-size", "lg")
  })

  test("tab dismiss button removes tab", async () => {
    @Component({
      imports: [TabsModule],
      template: `
        <div
          q-tabs-root
          [value]="selectedTab()"
          (valueChanged)="selectedTab.set($event)"
        >
          <div q-tabs-list>
            <div q-tabs-indicator></div>
            @for (tab of tabs(); track tab.value) {
              <div q-tab-root [value]="tab.value">
                <button q-tab-button>{{ tab.title }}</button>
                <button
                  q-tab-dismiss-button
                  [aria-label]="'Dismiss ' + tab.title"
                  (click)="removeTab(tab.value)"
                ></button>
              </div>
            }
          </div>
          @for (tab of tabs(); track tab.value) {
            <div q-tabs-panel [value]="tab.value">{{ tab.content }}</div>
          }
        </div>
      `,
    })
    class TestComponent {
      readonly tabs = signal([
        {content: "Tab 1 content", title: "Tab 1", value: "tab-1"},
        {content: "Tab 2 content", title: "Tab 2", value: "tab-2"},
        {content: "Tab 3 content", title: "Tab 3", value: "tab-3"},
      ])
      readonly selectedTab = signal<string>("tab-1")

      removeTab(value: string) {
        const newTabs = this.tabs().filter((tab) => tab.value !== value)
        this.tabs.set(newTabs)
        if (this.selectedTab() === value && newTabs.length > 0) {
          this.selectedTab.set(newTabs[0].value)
        }
      }
    }

    await render(TestComponent)

    await expect.element(page.getByRole("tab", {name: "Tab 1"})).toBeVisible()
    await expect.element(page.getByRole("tab", {name: "Tab 2"})).toBeVisible()
    await expect.element(page.getByRole("tab", {name: "Tab 3"})).toBeVisible()

    const dismissButton = page.getByLabelText("Dismiss Tab 2")
    await dismissButton.click()

    await expect.element(page.getByRole("tab", {name: "Tab 1"})).toBeVisible()
    await expect
      .element(page.getByRole("tab", {name: "Tab 2"}))
      .not.toBeInTheDocument()
    await expect.element(page.getByRole("tab", {name: "Tab 3"})).toBeVisible()
  })

  test("focusChanged emits when focus changes", async () => {
    @Component({
      imports: [TabsModule],
      template: `
        <div
          defaultValue="documents"
          q-tabs-root
          (focusChanged)="focusChanged.emit($event)"
        >
          <div q-tabs-list>
            <div q-tabs-indicator></div>
            @for (item of items; track item.value) {
              <div q-tab-root [value]="item.value">
                <button q-tab-button>{{ item.title }}</button>
              </div>
            }
          </div>
        </div>
      `,
    })
    class TestComponent {
      protected readonly items = tabItems
      readonly focusChanged = output<string>()
    }

    const focusChangedSpy = vi.fn()
    await render(TestComponent, {
      on: {focusChanged: (value) => focusChangedSpy(value)},
    })

    await userEvent.click(page.getByRole("tab", {name: "Documents"}))
    await userEvent.keyboard("{ArrowRight}")
    await expect.poll(() => focusChangedSpy).toHaveBeenCalledWith("products")

    await userEvent.tab()
    await expect.poll(() => focusChangedSpy).toHaveBeenCalledWith(null)
    await userEvent.tab({shift: true})

    await expect.poll(() => focusChangedSpy).toHaveBeenCalledWith("products")

    await page.getByRole("tab", {name: "Software"}).click()
    await expect.poll(() => focusChangedSpy).toHaveBeenCalledWith("software")
  })

  test("tabs context API allows programmatic control", async () => {
    @Component({
      imports: [TabsModule],
      template: `
        <div defaultValue="documents" q-tabs-root>
          <div q-tabs-list>
            <div q-tabs-indicator></div>
            @for (item of items; track item.value) {
              <div q-tab-root [value]="item.value">
                <button q-tab-button>{{ item.title }}</button>
              </div>
            }
          </div>
          <ng-container *tabsContext="let tabsApi">
            @for (item of items; track item.value) {
              <div q-tabs-panel [value]="item.value">
                {{ item.content }}
                @if (item.value !== "hardware") {
                  <button (click)="tabsApi.setValue(getNextValue(item.value))">
                    Next
                  </button>
                }
              </div>
            }
          </ng-container>
        </div>
      `,
    })
    class TestComponent {
      protected readonly items = tabItems

      getNextValue(current: string): string {
        const currentIndex = this.items.findIndex(
          (item) => item.value === current,
        )
        return this.items[currentIndex + 1]?.value ?? this.items[0].value
      }
    }

    await render(TestComponent)

    await expect.element(page.getByText("Documents content")).toBeVisible()

    await page.getByRole("button", {name: "Next"}).click()
    await expect.element(page.getByText("Products content")).toBeVisible()

    await page.getByRole("button", {name: "Next"}).click()
    await expect.element(page.getByText("Software content")).toBeVisible()
  })

  test("manual activation mode requires enter key to activate", async () => {
    @Component({
      imports: [TabsModule],
      template: `
        <div activationMode="manual" defaultValue="documents" q-tabs-root>
          <div q-tabs-list>
            <div q-tabs-indicator></div>
            @for (item of items; track item.value) {
              <div q-tab-root [value]="item.value">
                <button q-tab-button>{{ item.title }}</button>
              </div>
            }
          </div>
          @for (item of items; track item.value) {
            <div q-tabs-panel [value]="item.value">{{ item.content }}</div>
          }
        </div>
      `,
    })
    class TestComponent {
      protected readonly items = tabItems
    }

    await render(TestComponent)

    await expect.element(page.getByText("Documents content")).toBeVisible()

    await userEvent.tab()
    await userEvent.keyboard("{ArrowRight}")

    expect(page.getByRole("tab", {name: "Products"})).toHaveFocus()
    expect(page.getByText("Products content")).not.toBeVisible()
    await expect.element(page.getByText("Documents content")).toBeVisible()

    await userEvent.keyboard("{Enter}")
    await expect.element(page.getByText("Products content")).toBeVisible()
  })

  test("loopFocus false prevents wrapping keyboard navigation", async () => {
    @Component({
      imports: [TabsModule],
      template: `
        <div defaultValue="documents" q-tabs-root [loopFocus]="false">
          <div q-tabs-list>
            <div q-tabs-indicator></div>
            @for (item of items; track item.value) {
              <div q-tab-root [value]="item.value">
                <button q-tab-button>{{ item.title }}</button>
              </div>
            }
          </div>
        </div>
      `,
    })
    class TestComponent {
      protected readonly items = tabItems
    }

    await render(TestComponent)

    const documentsTab = page.getByRole("tab", {name: "Documents"})
    const hardwareTab = page.getByRole("tab", {name: "Hardware"})

    await userEvent.tab()
    expect(documentsTab).toHaveFocus()

    await userEvent.keyboard("{ArrowLeft}")
    expect(documentsTab).toHaveFocus()

    await userEvent.keyboard("{End}")
    expect(hardwareTab).toHaveFocus()

    await userEvent.keyboard("{ArrowRight}")
    expect(hardwareTab).toHaveFocus()
  })

  test("deselectable allows clicking active tab to deselect", async () => {
    @Component({
      imports: [TabsModule],
      template: `
        <div defaultValue="documents" deselectable q-tabs-root>
          <div q-tabs-list>
            <div q-tabs-indicator></div>
            @for (item of items; track item.value) {
              <div q-tab-root [value]="item.value">
                <button q-tab-button>{{ item.title }}</button>
              </div>
            }
          </div>
          @for (item of items; track item.value) {
            <div q-tabs-panel [value]="item.value">{{ item.content }}</div>
          }
        </div>
      `,
    })
    class TestComponent {
      protected readonly items = tabItems
    }

    await render(TestComponent)

    await expect.element(page.getByText("Documents content")).toBeVisible()

    await page.getByRole("tab", {name: "Documents"}).click()
    expect(page.getByText("Documents content")).not.toBeVisible()
  })

  test("tabs have correct aria attributes", async () => {
    @Component({
      imports: [TabsModule],
      template: `
        <div defaultValue="documents" q-tabs-root>
          <div q-tabs-list>
            <div q-tabs-indicator></div>
            <div q-tab-root value="documents">
              <button q-tab-button>Documents</button>
            </div>
            <div q-tab-root value="products">
              <button q-tab-button>Products</button>
            </div>
          </div>
          <div q-tabs-panel value="documents">Documents content</div>
          <div q-tabs-panel value="products">Products content</div>
        </div>
      `,
    })
    class TestComponent {}

    await render(TestComponent)

    const documentsTab = page.getByRole("tab", {name: "Documents"})
    const productsTab = page.getByRole("tab", {name: "Products"})
    const documentsPanel = page
      .getByRole("tabpanel")
      .filter({hasText: "Documents content"})
    const productsPanel = page
      .getByRole("tabpanel", {includeHidden: true})
      .filter({hasText: "Products content"})

    expect(documentsTab).toHaveAttribute("aria-selected", "true")
    expect(productsTab).toHaveAttribute("aria-selected", "false")

    expect(documentsTab).toHaveAttribute("role", "tab")
    expect(productsTab).toHaveAttribute("role", "tab")

    expect(documentsPanel).toHaveAttribute("role", "tabpanel")
    expect(productsPanel).toHaveAttribute("role", "tabpanel")

    const documentsTabId = documentsTab.element().getAttribute("id")
    const documentsPanelId = documentsPanel.element().getAttribute("id")

    expect(documentsTab).toHaveAttribute("aria-controls", documentsPanelId)
    expect(documentsPanel).toHaveAttribute("aria-labelledby", documentsTabId)
  })

  test("tabs list has correct aria attributes", async () => {
    @Component({
      imports: [TabsModule],
      template: `
        <div defaultValue="documents" q-tabs-root>
          <div q-tabs-list>
            <div q-tabs-indicator></div>
            <div q-tab-root value="documents">
              <button q-tab-button>Documents</button>
            </div>
          </div>
        </div>
      `,
    })
    class TestComponent {}

    await render(TestComponent)

    const tabsList = page.getByRole("tablist")
    expect(tabsList).toHaveAttribute("role", "tablist")
  })

  test("vertical orientation sets correct aria-orientation", async () => {
    @Component({
      imports: [TabsModule],
      template: `
        <div defaultValue="documents" orientation="vertical" q-tabs-root>
          <div q-tabs-list>
            <div q-tabs-indicator></div>
            <div q-tab-root value="documents">
              <button q-tab-button>Documents</button>
            </div>
          </div>
        </div>
      `,
    })
    class TestComponent {}

    await render(TestComponent)

    const tabsList = page.getByRole("tablist")
    expect(tabsList).toHaveAttribute("aria-orientation", "vertical")
  })

  test("horizontal orientation sets correct aria-orientation", async () => {
    @Component({
      imports: [TabsModule],
      template: `
        <div defaultValue="documents" orientation="horizontal" q-tabs-root>
          <div q-tabs-list>
            <div q-tabs-indicator></div>
            <div q-tab-root value="documents">
              <button q-tab-button>Documents</button>
            </div>
          </div>
        </div>
      `,
    })
    class TestComponent {}

    await render(TestComponent)

    const tabsList = page.getByRole("tablist")
    expect(tabsList).toHaveAttribute("aria-orientation", "horizontal")
  })
})
