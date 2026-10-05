import {Component, input, output, signal} from "@angular/core"
import {render} from "@testing-library/angular"
import {describe, expect, test, vi} from "vitest"
import {page, userEvent} from "vitest/browser"

import {PortalDirective} from "@qualcomm-ui/angular-core/portal"
import {ButtonModule} from "@qualcomm-ui/angular/button"
import {DialogModule} from "@qualcomm-ui/angular/dialog"
import {MenuModule} from "@qualcomm-ui/angular/menu"
import {PopoverModule} from "@qualcomm-ui/angular/popover"
import type {QdsButtonApiProps} from "@qualcomm-ui/qds-core/button"

@Component({
  imports: [ButtonModule, MenuModule, PortalDirective],
  selector: "header-footer-menu",
  template: `
    <form
      id="menu-button-form"
      (submit)="$event.preventDefault(); submitted.emit()"
    >
      <q-menu
        [open]="open()"
        [size]="size()"
        (openChanged)="open.set($event)"
        (selected)="selected.emit($event)"
      >
        <button q-menu-button type="button">Choose options</button>
        <ng-template qPortal [disabled]="!portal()">
          <div q-menu-positioner style="max-height: 240px; width: 280px">
            <section q-menu-header>
              <div q-menu-header-label>Options</div>
              <button
                emphasis="primary"
                form="menu-button-form"
                q-button
                type="button"
                [density]="buttonProps().density"
                [disabled]="disabled()"
                [size]="buttonProps().size"
                [variant]="buttonProps().variant"
                (click)="cleared.emit()"
              >
                Clear all
              </button>
            </section>
            <div q-menu-content>
              <div q-menu-item-group>
                @for (option of options; track option) {
                  <button q-menu-item [closeOnSelect]="false" [value]="option">
                    {{ option }}
                  </button>
                }
              </div>
            </div>
            <section q-menu-footer>
              <button
                form="menu-button-form"
                q-button
                type="button"
                [density]="buttonProps().density"
                [size]="buttonProps().size"
                [variant]="buttonProps().variant"
                (click)="apply()"
              >
                Apply
              </button>
            </section>
          </div>
        </ng-template>
      </q-menu>
    </form>
  `,
})
class HeaderFooterMenuComponent {
  readonly applied = output()
  readonly cleared = output()
  readonly submitted = output()
  readonly selected = output<string>()
  readonly buttonProps = input<QdsButtonApiProps>({})
  readonly closeOnApply = input(false)
  readonly disabled = input(false)
  readonly portal = input(true)
  readonly open = signal(false)
  readonly size = input<"sm" | "md">("md")
  readonly options = Array.from(
    {length: 20},
    (_, index) => `Option ${index + 1}`,
  )
  apply() {
    this.applied.emit()
    if (this.closeOnApply()) {
      this.open.set(false)
    }
  }
}

const imports = [
  ButtonModule,
  DialogModule,
  HeaderFooterMenuComponent,
  MenuModule,
  PopoverModule,
  PortalDirective,
]

describe("Menu header and footer", () => {
  test("supports native button activation without selecting a menu item or submitting", async () => {
    const applied = vi.fn()
    const cleared = vi.fn()
    const selected = vi.fn()
    const submitted = vi.fn()
    await render(HeaderFooterMenuComponent, {
      on: {applied, cleared, selected, submitted},
    })
    await page.getByRole("button", {name: "Choose options"}).click()
    const clear = page.getByRole("button", {name: "Clear all"})
    await clear.click()
    await expect.element(clear).toHaveFocus()
    await userEvent.keyboard("{Enter}{Space}")
    await expect.poll(() => cleared).toHaveBeenCalledTimes(3)
    await page.getByRole("button", {name: "Apply"}).click()
    await expect.poll(() => applied).toHaveBeenCalledTimes(1)
    await expect.element(page.getByRole("menu")).toBeVisible()
    expect(selected).not.toHaveBeenCalled()
    expect(submitted).not.toHaveBeenCalled()
  })

  test("leaves closing to the consumer", async () => {
    await render(HeaderFooterMenuComponent, {inputs: {closeOnApply: true}})
    await page.getByRole("button", {name: "Choose options"}).click()
    await page.getByRole("button", {name: "Apply"}).click()
    await expect.element(page.getByRole("menu")).not.toBeInTheDocument()
  })

  test("stacks a menu with a header like one without", async () => {
    await render(
      `
      <header-footer-menu />
      <q-menu [open]="true">
        <div data-test-id="plain" q-menu-positioner>
          <div q-menu-content>
            <button q-menu-item value="a">A</button>
          </div>
        </div>
      </q-menu>
    `,
      {imports},
    )
    await page.getByRole("button", {name: "Choose options"}).click()
    const zIndex = (el: Element) => getComputedStyle(el).zIndex
    const withHeader = page
      .getByRole("button", {name: "Clear all"})
      .element()
      .closest('[data-menu-part="positioner"]')!
    const plain = page.getByTestId("plain").element()
    await expect.poll(() => zIndex(plain)).not.toBe("auto")
    await expect
      .poll(() => Number(zIndex(withHeader)))
      .toBeGreaterThanOrEqual(Number(zIndex(plain)))
  })

  test("keeps the header and footer outside the menu role", async () => {
    await render(HeaderFooterMenuComponent)
    await page.getByRole("button", {name: "Choose options"}).click()
    const menu = page.getByRole("menu").element()
    expect(
      menu.contains(page.getByRole("button", {name: "Clear all"}).element()),
    ).toBe(false)
    expect(
      menu.contains(page.getByRole("button", {name: "Apply"}).element()),
    ).toBe(false)
  })

  test("keeps the header and footer visible while revealing keyboard-highlighted items", async () => {
    await render(HeaderFooterMenuComponent)
    await page.getByRole("button", {name: "Choose options"}).click()
    const menu = page.getByRole("menu")
    await expect.element(menu).toHaveFocus()
    const clear = page.getByRole("button", {name: "Clear all"})
    const apply = page.getByRole("button", {name: "Apply"})
    const positioner = menu.element().parentElement!
    const top = (el: Element) =>
      el.getBoundingClientRect().top - positioner.getBoundingClientRect().top
    const clearTop = top(clear.element())
    const applyTop = top(apply.element())
    const last = page.getByRole("menuitem", {exact: true, name: "Option 20"})

    await userEvent.keyboard("{End}")
    await expect
      .element(menu)
      .toHaveAttribute("aria-activedescendant", last.element().id)
    await expect.poll(() => menu.element().scrollTop).toBeGreaterThan(0)
    await expect
      .poll(() => last.element().getBoundingClientRect().bottom)
      .toBeLessThanOrEqual(menu.element().getBoundingClientRect().bottom + 1)
    expect(top(clear.element())).toBeCloseTo(clearTop)
    expect(top(apply.element())).toBeCloseTo(applyTop)

    await userEvent.keyboard("{Home}")
    await expect.poll(() => menu.element().scrollTop).toBe(0)
  })

  test("Tab cycles through header, list and footer", async () => {
    await render(HeaderFooterMenuComponent)
    await page.getByRole("button", {name: "Choose options"}).click()
    const menu = page.getByRole("menu")
    const clear = page.getByRole("button", {name: "Clear all"})
    const apply = page.getByRole("button", {name: "Apply"})
    await expect.element(menu).toHaveFocus()
    await userEvent.keyboard("{Tab}")
    await expect.element(apply).toHaveFocus()
    await userEvent.keyboard("{Tab}")
    await expect.element(clear).toHaveFocus()
    await userEvent.keyboard("{Tab}")
    await expect.element(menu).toHaveFocus()
    await userEvent.keyboard("{Shift>}{Tab}{/Shift}")
    await expect.element(clear).toHaveFocus()
    await userEvent.keyboard("{Shift>}{Tab}{/Shift}")
    await expect.element(apply).toHaveFocus()
    await expect.element(menu).toBeVisible()
  })

  test("hides the item focus ring while a section button has focus", async () => {
    await render(HeaderFooterMenuComponent)
    await page.getByRole("button", {name: "Choose options"}).click()
    const option = (name: string) =>
      page.getByRole("menuitem", {exact: true, name})
    await expect.element(page.getByRole("menu")).toHaveFocus()
    await userEvent.keyboard("{ArrowDown}{ArrowDown}")
    await expect
      .element(option("Option 2"))
      .toHaveAttribute("data-focus-visible")
    await userEvent.keyboard("{Tab}")
    await expect
      .element(option("Option 2"))
      .not.toHaveAttribute("data-focus-visible")
    await userEvent.keyboard("{Tab}{Tab}")
    await expect.element(page.getByRole("menu")).toHaveFocus()
    await userEvent.keyboard("{ArrowDown}")
    await expect
      .element(option("Option 3"))
      .toHaveAttribute("data-focus-visible")
  })

  test("exposes disabled header actions as buttons rather than menu items", async () => {
    const selected = vi.fn()
    const cleared = vi.fn()
    await render(HeaderFooterMenuComponent, {
      inputs: {disabled: true},
      on: {cleared, selected},
    })
    await page.getByRole("button", {name: "Choose options"}).click()
    await expect
      .element(page.getByRole("button", {name: "Clear all"}))
      .toBeDisabled()
    await expect
      .element(page.getByRole("menuitem", {name: "Clear all"}))
      .not.toBeInTheDocument()
    await expect
      .element(page.getByRole("menuitem", {name: "Apply"}))
      .not.toBeInTheDocument()
    expect(cleared).not.toHaveBeenCalled()
  })

  test.each([
    {footerSize: "md", size: "sm"},
    {footerSize: "lg", size: "md"},
  ] as const)(
    "supplies the $size menu's button props through custom section roots",
    async ({footerSize, size}) => {
      await render(HeaderFooterMenuComponent, {inputs: {size}})
      await page.getByRole("button", {name: "Choose options"}).click()
      const clear = page.getByRole("button", {name: "Clear all"})
      const apply = page.getByRole("button", {name: "Apply"})
      await expect.element(clear).toHaveAttribute("data-size", size)
      await expect.element(clear).toHaveAttribute("data-density", "compact")
      await expect.element(clear).toHaveAttribute("data-variant", "ghost")
      await expect.element(apply).toHaveAttribute("data-size", footerSize)
      await expect.element(apply).toHaveAttribute("data-density", "compact")
      await expect.element(apply).toHaveAttribute("data-variant", "fill")
    },
  )

  test("lets explicit button inputs override the section defaults", async () => {
    await render(HeaderFooterMenuComponent, {
      inputs: {
        buttonProps: {density: "default", size: "sm", variant: "outline"},
      },
    })
    await page.getByRole("button", {name: "Choose options"}).click()
    for (const name of ["Clear all", "Apply"]) {
      const button = page.getByRole("button", {name})
      await expect.element(button).toHaveAttribute("data-size", "sm")
      await expect.element(button).toHaveAttribute("data-density", "default")
      await expect.element(button).toHaveAttribute("data-variant", "outline")
    }
  })
})

test("cycles Tab through the sections inside a dialog's focus trap", async () => {
  await render(
    `
    <div defaultOpen q-dialog-root>
      <ng-container *qPortal>
        <div q-dialog-positioner>
          <section q-dialog-content>
            <div q-dialog-body>
              <h2 q-dialog-heading>Dialog</h2>
              <header-footer-menu [portal]="false" />
            </div>
          </section>
        </div>
      </ng-container>
    </div>
  `,
    {imports},
  )
  await page.getByRole("button", {name: "Choose options"}).click()
  const menu = page.getByRole("menu")
  await expect.element(menu).toHaveFocus()
  for (const name of ["Apply", "Clear all"]) {
    await userEvent.keyboard("{Tab}")
    await expect.element(page.getByRole("button", {name})).toHaveFocus()
  }
  await userEvent.keyboard("{Tab}")
  await expect.element(menu).toHaveFocus()
  await userEvent.keyboard("{Shift>}{Tab}{/Shift}")
  await expect
    .element(page.getByRole("button", {name: "Clear all"}))
    .toHaveFocus()
})

test("keeps Tab on the list of a menu without a header or footer", async () => {
  await render(
    `
    <q-menu>
      <button q-menu-button>Plain</button>
      <ng-template qPortal>
        <div q-menu-positioner>
          <div q-menu-content>
            <button q-menu-item value="a">A</button>
            <button q-menu-item value="b">B</button>
          </div>
        </div>
      </ng-template>
    </q-menu>
    <button type="button">After</button>
  `,
    {imports},
  )
  await page.getByRole("button", {name: "Plain"}).click()
  const menu = page.getByRole("menu")
  await expect.element(menu).toHaveFocus()
  await userEvent.keyboard("{Tab}")
  await expect.element(menu).toHaveFocus()
  await userEvent.keyboard("{Shift>}{Tab}{/Shift}")
  await expect.element(menu).toHaveFocus()
})

test("moves into a portalled submenu from a menu with a footer", async () => {
  await render(
    `
    <q-menu>
      <button q-menu-button>Parent</button>
      <ng-template qPortal>
        <div q-menu-positioner>
          <div q-menu-content>
            <q-menu>
              <button q-menu-trigger-item value="more">More</button>
              <ng-template qPortal>
                <div q-menu-positioner>
                  <div q-menu-content>
                    <button q-menu-item value="child">Child</button>
                  </div>
                </div>
              </ng-template>
            </q-menu>
          </div>
          <div q-menu-footer>
            <button q-button>Apply</button>
          </div>
        </div>
      </ng-template>
    </q-menu>
  `,
    {imports},
  )
  await page.getByRole("button", {name: "Parent"}).click()
  await userEvent.keyboard("{ArrowDown}{ArrowRight}")
  const submenu = page.getByRole("menu").nth(1)
  await expect.element(submenu).toHaveFocus()
  await userEvent.keyboard("{Tab}")
  await expect.element(submenu).toHaveFocus()
  await userEvent.keyboard("{ArrowLeft}")
  await expect.element(page.getByRole("menu").first()).toHaveFocus()
  await expect.element(submenu).not.toBeInTheDocument()
  await userEvent.keyboard("{Tab}")
  await expect.element(page.getByRole("button", {name: "Apply"})).toHaveFocus()
})

test("returns focus to the parent list from a submenu rendered without a portal", async () => {
  await render(
    `
    <q-menu>
      <button q-menu-button>Parent</button>
      <div q-menu-positioner>
        <div q-menu-content>
          <q-menu>
            <button q-menu-trigger-item value="more">More</button>
            <div q-menu-positioner>
              <div q-menu-content>
                <button q-menu-item value="child">Child</button>
              </div>
            </div>
          </q-menu>
          <button q-menu-item value="next">Next</button>
        </div>
      </div>
    </q-menu>
  `,
    {imports},
  )
  await page.getByRole("button", {name: "Parent"}).click()
  await userEvent.keyboard("{ArrowDown}{ArrowRight}")
  await expect.element(page.getByRole("menu").nth(1)).toHaveFocus()
  await userEvent.keyboard("{ArrowLeft}")
  const parent = page.getByRole("menu").first()
  await expect.element(parent).toHaveFocus()
  await userEvent.keyboard("{ArrowDown}")
  await expect
    .element(parent)
    .toHaveAttribute(
      "aria-activedescendant",
      page.getByRole("menuitem", {name: "Next"}).element().id,
    )
})

test("focuses an autofocus element inside the content on open", async () => {
  await render(
    `
    <q-menu>
      <button q-menu-button>Search</button>
      <ng-template qPortal>
        <div q-menu-positioner>
          <div q-menu-content>
            <input aria-label="Filter" data-autofocus />
            <button q-menu-item value="a">A</button>
          </div>
        </div>
      </ng-template>
    </q-menu>
  `,
    {imports},
  )
  await page.getByRole("button", {name: "Search"}).click()
  const filter = page.getByRole("textbox", {name: "Filter"})
  await expect.element(filter).toHaveFocus()
  await page.getByRole("menuitem", {name: "A"}).hover()
  await expect.element(filter).toHaveFocus()
})

test("opens another menu while one with a footer is already open", async () => {
  await render(
    `
    <div style="display: flex; gap: 400px">
      <q-menu>
        <button q-menu-button>First</button>
        <ng-template qPortal>
          <div q-menu-positioner>
            <div q-menu-content>
              <button q-menu-item value="x">First item</button>
            </div>
            <div q-menu-footer>
              <button q-button>Apply</button>
            </div>
          </div>
        </ng-template>
      </q-menu>
      <q-menu>
        <button q-menu-button>Second</button>
        <ng-template qPortal>
          <div q-menu-positioner>
            <div q-menu-content>
              <button q-menu-item value="x">Second item</button>
            </div>
          </div>
        </ng-template>
      </q-menu>
    </div>
  `,
    {imports},
  )
  await page.getByRole("button", {name: "First"}).click()
  await expect.element(page.getByRole("button", {name: "Apply"})).toBeVisible()
  await page.getByRole("button", {name: "Second"}).click()
  await expect
    .element(page.getByRole("button", {name: "Second"}))
    .toHaveAttribute("aria-expanded", "true")
})

test("keeps Tab wrapping inside a dialog rendered within an open menu", async () => {
  await render(
    `
    <q-menu defaultOpen>
      <button q-menu-button>Actions</button>
      <div q-menu-positioner>
        <div q-menu-content>
          <button q-menu-item value="rename">Rename</button>
        </div>
        <div q-menu-footer>
          <div defaultOpen q-dialog-root>
            <div q-dialog-positioner>
              <section q-dialog-content>
                <div q-dialog-body>
                  <h2 q-dialog-heading>Rename</h2>
                  <button type="button">First</button>
                  <button type="button">Last</button>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </q-menu>
  `,
    {imports},
  )
  const first = page.getByRole("button", {name: "First"})
  const last = page.getByRole("button", {name: "Last"})
  await last.click()
  await expect.element(last).toHaveFocus()
  await userEvent.keyboard("{Tab}")
  await expect.element(first).toHaveFocus()
  await userEvent.keyboard("{Shift>}{Tab}{/Shift}")
  await expect.element(last).toHaveFocus()
})

test("keeps a dialog's Tab wrapping when no menu is open", async () => {
  await render(
    `
    <div defaultOpen q-dialog-root>
      <ng-container *qPortal>
        <div q-dialog-positioner>
          <section q-dialog-content>
            <div q-dialog-body>
              <h2 q-dialog-heading>Dialog</h2>
              <button type="button">First</button>
              <header-footer-menu [portal]="false" />
            </div>
          </section>
        </div>
      </ng-container>
    </div>
  `,
    {imports},
  )
  const first = page.getByRole("button", {name: "First"})
  const trigger = page.getByRole("button", {name: "Choose options"})
  await first.click()
  await userEvent.keyboard("{Tab}")
  await expect.element(trigger).toHaveFocus()
  await userEvent.keyboard("{Tab}")
  await expect.element(first).toHaveFocus()
})

test("does not carry a parent footer's button props into a nested menu", async () => {
  await render(
    `
    <q-menu [open]="true">
      <div q-menu-positioner>
        <div q-menu-content></div>
        <div q-menu-footer>
          <button q-button>Outer apply</button>
          <q-menu size="sm" [open]="true">
            <ng-template qPortal>
              <div q-menu-positioner>
                <div q-menu-header>
                  <button q-button>Inner clear</button>
                </div>
                <div q-menu-content></div>
                <button q-button>Inner ordinary</button>
              </div>
            </ng-template>
          </q-menu>
        </div>
      </div>
    </q-menu>
  `,
    {imports},
  )
  await expect
    .element(page.getByRole("button", {name: "Outer apply"}))
    .toHaveAttribute("data-size", "lg")
  const clear = page.getByRole("button", {name: "Inner clear"})
  await expect.element(clear).toHaveAttribute("data-size", "sm")
  await expect.element(clear).toHaveAttribute("data-variant", "ghost")
  const ordinary = page.getByRole("button", {name: "Inner ordinary"})
  await expect.element(ordinary).toHaveAttribute("data-size", "md")
  await expect.element(ordinary).toHaveAttribute("data-density", "default")
})

test("keeps a containing popover open while using the header and footer", async () => {
  const applied = vi.fn()
  await render(
    `
    <div q-popover-root>
      <button q-popover-trigger>Open settings</button>
      <ng-template qPortal>
        <div q-popover-positioner>
          <div q-popover-content>
            <div q-popover-label>Settings</div>
            <header-footer-menu (applied)="applied()" />
          </div>
        </div>
      </ng-template>
    </div>
  `,
    {componentProperties: {applied}, imports},
  )
  await page.getByRole("button", {name: "Open settings"}).click()
  const popover = page.getByRole("dialog", {name: "Settings"})
  await expect.element(popover).toBeVisible()
  await page.getByRole("button", {name: "Choose options"}).click()
  const menu = page.getByRole("menu")
  await expect.element(menu).toHaveFocus()

  const clear = page.getByRole("button", {name: "Clear all"})
  await clear.click()
  await expect.element(clear).toHaveFocus()
  await expect.element(menu).toBeVisible()
  await expect.element(popover).toBeVisible()

  await userEvent.keyboard("{Shift>}{Tab}{/Shift}")
  await expect.element(page.getByRole("button", {name: "Apply"})).toHaveFocus()
  await expect.element(menu).toBeVisible()
  await expect.element(popover).toBeVisible()

  await page.getByRole("button", {name: "Apply"}).click()
  await expect.poll(() => applied).toHaveBeenCalledTimes(1)
  await expect.element(popover).toBeVisible()
})
