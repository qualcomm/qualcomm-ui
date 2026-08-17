import {Component, output, signal} from "@angular/core"
import {LucideEllipsis} from "@lucide/angular"
import {render} from "@testing-library/angular"
import {describe, expect, test, vi} from "vitest"
import {page, userEvent} from "vitest/browser"

import {provideIcons} from "@qualcomm-ui/angular-core/lucide"
import {PortalDirective} from "@qualcomm-ui/angular-core/portal"
import {MenuModule} from "@qualcomm-ui/angular/menu"

function menu() {
  return page.getByRole("menu")
}

async function openMenu(name: string | RegExp) {
  await page.getByRole("button", {name}).click()
  await expect.element(menu()).toBeVisible()
}

@Component({
  imports: [MenuModule, PortalDirective],
  template: `
    <output data-test-id="open-state">
      {{ open() ? "open" : "closed" }}
    </output>
    <q-menu (openChanged)="open.set($event)" (selected)="selected.emit($event)">
      <button q-menu-button>Shortcut Menu</button>
      <ng-template qPortal>
        <div q-menu-positioner>
          <div q-menu-content>
            <button q-menu-item value="new-file">New File</button>
            <button q-menu-item value="open-file">Open File</button>
          </div>
        </div>
      </ng-template>
    </q-menu>
  `,
})
class ShortcutMenuComponent {
  readonly open = signal(false)
  readonly selected = output<string>()
}

@Component({
  imports: [MenuModule, PortalDirective],
  template: `
    <q-menu
      loopFocus
      (highlightChanged)="highlighted.emit($event)"
      (selected)="selected.emit($event)"
    >
      <button q-menu-button>Navigate Menu</button>
      <ng-template qPortal>
        <div q-menu-positioner>
          <div q-menu-content>
            <button q-menu-item value="alpha">Alpha</button>
            <button q-menu-item value="bravo">Bravo</button>
            <button q-menu-item value="delta">Delta</button>
          </div>
        </div>
      </ng-template>
    </q-menu>
  `,
})
class KeyboardMenuComponent {
  readonly highlighted = output<string | null>()
  readonly selected = output<string>()
}

@Component({
  imports: [MenuModule, PortalDirective],
  template: `
    <q-menu
      (highlightChanged)="highlighted.emit($event)"
      (selected)="selected.emit($event)"
    >
      <button q-menu-button>Disabled Menu</button>
      <ng-template qPortal>
        <div q-menu-positioner>
          <div q-menu-content>
            <button
              disabled
              q-menu-item
              value="archive"
              (selected)="disabledSelected.emit()"
            >
              Archive
            </button>
            <button q-menu-item value="rename">Rename</button>
          </div>
        </div>
      </ng-template>
    </q-menu>
  `,
})
class DisabledMenuComponent {
  readonly disabledSelected = output<void>()
  readonly highlighted = output<string | null>()
  readonly selected = output<string>()
}

@Component({
  imports: [MenuModule, PortalDirective],
  template: `
    <q-menu>
      <button q-menu-button>Options Menu</button>
      <ng-template qPortal>
        <div q-menu-positioner>
          <div q-menu-content>
            <button
              q-menu-checkbox-item
              value="line-numbers"
              [checked]="checked()"
              [closeOnSelect]="false"
              (checkedChanged)="setChecked($event)"
            >
              <span q-menu-item-label>Line numbers</span>
              <span q-menu-item-indicator>Selected</span>
            </button>
            <div q-menu-radio-item-group [(value)]="density">
              <button q-menu-radio-item value="compact" [closeOnSelect]="false">
                <span q-menu-item-label>Compact</span>
              </button>
              <button
                q-menu-radio-item
                value="comfortable"
                [closeOnSelect]="false"
              >
                <span q-menu-item-label>Comfortable</span>
              </button>
            </div>
          </div>
        </div>
      </ng-template>
    </q-menu>
  `,
})
class OptionMenuComponent {
  readonly checked = signal(false)
  readonly density = signal("comfortable")
  readonly checkedChanged = output<boolean | undefined>()

  setChecked(checked: boolean | undefined) {
    this.checkedChanged.emit(checked)
    this.checked.set(!!checked)
  }
}

@Component({
  imports: [MenuModule, PortalDirective],
  template: `
    <q-menu>
      <button q-menu-button>Parent Menu</button>
      <ng-template qPortal>
        <div q-menu-positioner>
          <div q-menu-content>
            <button q-menu-item value="new-file">New File</button>
            <q-menu (selected)="selected.emit($event)">
              <button q-menu-trigger-item value="open-recent">
                Open Recent
              </button>
              <ng-template qPortal>
                <div q-menu-positioner>
                  <div q-menu-content>
                    <button q-menu-item value="file-1">File 1</button>
                    <button q-menu-item value="file-2">File 2</button>
                  </div>
                </div>
              </ng-template>
            </q-menu>
          </div>
        </div>
      </ng-template>
    </q-menu>
  `,
})
class SubmenuComponent {
  readonly selected = output<string>()
}

@Component({
  imports: [MenuModule, PortalDirective],
  providers: [provideIcons({LucideEllipsis})],
  template: `
    <q-menu>
      <button
        aria-label="More actions"
        icon="Ellipsis"
        q-menu-icon-button
      ></button>
      <ng-template qPortal>
        <div q-menu-positioner>
          <div q-menu-content>
            <button q-menu-item value="rename">Rename</button>
          </div>
        </div>
      </ng-template>
    </q-menu>

    <q-menu>
      <button aria-label="Filter actions" q-menu-icon-button></button>
      <ng-template qPortal>
        <div q-menu-positioner>
          <div q-menu-content>
            <button q-menu-item value="filter-by-owner">Filter by owner</button>
          </div>
        </div>
      </ng-template>
    </q-menu>
  `,
})
class IconButtonMenuComponent {}

@Component({
  imports: [MenuModule, PortalDirective],
  template: `
    <q-menu>
      <button q-menu-context-trigger>Right click here</button>
      <ng-template qPortal>
        <div q-menu-positioner>
          <div q-menu-content>
            <button q-menu-item value="new-text-file">New Text File</button>
            <button q-menu-item value="export">Export</button>
          </div>
        </div>
      </ng-template>
    </q-menu>
  `,
})
class ContextMenuComponent {}

@Component({
  imports: [MenuModule, PortalDirective],
  template: `
    <q-menu size="sm">
      <button q-menu-button>Open actions</button>
      <ng-template qPortal>
        <div q-menu-positioner>
          <div q-menu-content>
            <button q-menu-item value="open-project">
              <span q-menu-item-start-icon>TXT</span>
              <span q-menu-item-label>Open Project</span>
              <span q-menu-item-description>Recently opened</span>
              <span class="qui-menu-item__accessory">Synced</span>
              <span q-menu-item-command>Ctrl+O</span>
            </button>
          </div>
        </div>
      </ng-template>
    </q-menu>
  `,
})
class RichItemMenuComponent {}

@Component({
  imports: [MenuModule, PortalDirective],
  template: `
    <q-menu size="sm">
      <button q-menu-button>Sized Menu</button>
      <ng-template qPortal>
        <div q-menu-positioner>
          <div q-menu-content>
            <button q-menu-item value="rename">Rename</button>
          </div>
        </div>
      </ng-template>
    </q-menu>
  `,
})
class InheritedButtonSizeMenuComponent {}

@Component({
  imports: [MenuModule, PortalDirective],
  providers: [provideIcons({LucideEllipsis})],
  template: `
    <q-menu size="sm">
      <button
        aria-label="More actions"
        icon="Ellipsis"
        q-menu-icon-button
      ></button>
      <ng-template qPortal>
        <div q-menu-positioner>
          <div q-menu-content>
            <button q-menu-item value="rename">Rename</button>
          </div>
        </div>
      </ng-template>
    </q-menu>
  `,
})
class InheritedIconButtonSizeMenuComponent {}

@Component({
  imports: [MenuModule, PortalDirective],
  template: `
    <q-menu size="sm">
      <button q-menu-button size="lg">Sized Menu</button>
      <ng-template qPortal>
        <div q-menu-positioner>
          <div q-menu-content>
            <button q-menu-item value="rename">Rename</button>
          </div>
        </div>
      </ng-template>
    </q-menu>
  `,
})
class OverriddenButtonSizeMenuComponent {}

describe("Menu", () => {
  test("opens from trigger keyboard shortcuts and selects the highlighted item", async () => {
    const selected = vi.fn()
    await render(ShortcutMenuComponent, {on: {selected}})

    await userEvent.tab()
    await expect
      .element(page.getByRole("button", {name: "Shortcut Menu"}))
      .toHaveFocus()

    await userEvent.keyboard("{Enter}")
    await expect.element(menu()).toBeVisible()
    await expect
      .element(page.getByTestId("open-state"))
      .toHaveTextContent("open")

    await userEvent.keyboard("{Enter}")
    await expect.poll(() => selected).toHaveBeenCalledWith("new-file")
    await expect.element(menu()).not.toBeInTheDocument()
    await expect
      .element(page.getByTestId("open-state"))
      .toHaveTextContent("closed")
  })

  test("supports Home, End, typeahead, and looping keyboard navigation", async () => {
    const highlighted = vi.fn()
    const selected = vi.fn()
    await render(KeyboardMenuComponent, {on: {highlighted, selected}})

    await openMenu("Navigate Menu")

    await userEvent.keyboard("{End}")
    await expect.poll(() => highlighted).toHaveBeenLastCalledWith("delta")

    await userEvent.keyboard("{Home}")
    await expect.poll(() => highlighted).toHaveBeenLastCalledWith("alpha")

    await userEvent.keyboard("d")
    await expect.poll(() => highlighted).toHaveBeenLastCalledWith("delta")

    await userEvent.keyboard("{ArrowDown}")
    await expect.poll(() => highlighted).toHaveBeenLastCalledWith("alpha")

    await userEvent.keyboard("{ArrowUp}")
    await expect.poll(() => highlighted).toHaveBeenLastCalledWith("delta")

    await userEvent.keyboard("{Enter}")
    await expect.poll(() => selected).toHaveBeenCalledWith("delta")
    await expect.element(menu()).not.toBeInTheDocument()
  })

  test("does not select disabled items and skips them during keyboard navigation", async () => {
    const disabledSelected = vi.fn()
    const highlighted = vi.fn()
    const selected = vi.fn()
    await render(DisabledMenuComponent, {
      on: {disabledSelected, highlighted, selected},
    })

    await openMenu("Disabled Menu")

    const disabledItem = page.getByRole("menuitem", {name: "Archive"})
    await expect.element(disabledItem).toHaveAttribute("aria-disabled", "true")

    await disabledItem.click({force: true})
    expect(disabledSelected).not.toHaveBeenCalled()
    expect(selected).not.toHaveBeenCalled()
    await expect.element(menu()).toBeVisible()

    await userEvent.keyboard("{ArrowDown}")
    await expect.poll(() => highlighted).toHaveBeenLastCalledWith("rename")

    await userEvent.keyboard("{Enter}")
    await expect.poll(() => selected).toHaveBeenCalledWith("rename")
  })

  test("keeps checkbox and radio option menus open when closeOnSelect is false", async () => {
    const checkedChanged = vi.fn()
    await render(OptionMenuComponent, {on: {checkedChanged}})

    await openMenu("Options Menu")

    const checkboxItem = page.getByRole("menuitemcheckbox", {
      name: "Line numbers",
    })
    await expect.element(checkboxItem).toHaveAttribute("aria-checked", "false")

    await checkboxItem.click()
    await expect.poll(() => checkedChanged).toHaveBeenCalledWith(true)
    await expect.element(menu()).toBeVisible()
    await expect.element(checkboxItem).toHaveAttribute("aria-checked", "true")

    const compactItem = page.getByRole("menuitemradio", {name: "Compact"})
    const comfortableItem = page.getByRole("menuitemradio", {
      name: "Comfortable",
    })
    await expect
      .element(comfortableItem)
      .toHaveAttribute("aria-checked", "true")
    await compactItem.click()
    await expect.element(menu()).toBeVisible()
    await expect.element(compactItem).toHaveAttribute("aria-checked", "true")
    await expect
      .element(comfortableItem)
      .toHaveAttribute("aria-checked", "false")
  })

  test("opens a submenu with arrow keys and selects the highlighted child item", async () => {
    const selected = vi.fn()
    await render(SubmenuComponent, {on: {selected}})

    await openMenu("Parent Menu")
    await userEvent.keyboard("{ArrowDown}")
    await userEvent.keyboard("{ArrowDown}")
    await userEvent.keyboard("{ArrowRight}")

    await expect.element(page.getByText("File 1")).toBeVisible()

    await userEvent.keyboard("{Enter}")
    await expect.poll(() => selected).toHaveBeenCalledWith("file-1")
    await expect.element(menu()).not.toBeInTheDocument()
  })

  test("icon button trigger opens the menu by accessible name", async () => {
    await render(IconButtonMenuComponent)

    const moreActionsTrigger = page.getByRole("button", {
      name: "More actions",
    })
    await expect
      .element(moreActionsTrigger)
      .toHaveAttribute("aria-expanded", "false")
    await moreActionsTrigger.click()
    await expect.element(menu()).toBeVisible()
    await expect.element(page.getByText("Rename")).toBeVisible()
    await expect
      .element(moreActionsTrigger)
      .toHaveAttribute("aria-expanded", "true")

    await userEvent.keyboard("{Escape}")
    await expect.element(menu()).not.toBeInTheDocument()

    await page.getByRole("button", {name: "Filter actions"}).click()
    await expect.element(menu()).toBeVisible()
    await expect.element(page.getByText("Filter by owner")).toBeVisible()
  })

  test("context trigger opens the menu from a context menu interaction", async () => {
    await render(ContextMenuComponent)

    await expect.element(menu()).not.toBeInTheDocument()
    await page.getByRole("button", {name: "Right click here"}).click({
      button: "right",
    })

    await expect.element(menu()).toBeVisible()
    await expect.element(page.getByText("New Text File")).toBeVisible()
  })

  test("renders item start icon, command, description, and accessory content", async () => {
    await render(RichItemMenuComponent)

    await openMenu("Open actions")

    await expect
      .element(page.getByRole("menuitem", {name: /Open Project/}))
      .toBeVisible()
    await expect.element(page.getByText("TXT")).toBeVisible()
    await expect.element(page.getByText("Synced")).toBeVisible()
    await expect.element(page.getByText("Recently opened")).toBeVisible()
    await expect.element(page.getByText("Ctrl+O")).toBeVisible()
  })

  test("button trigger inherits the menu size", async () => {
    await render(InheritedButtonSizeMenuComponent)

    await expect
      .element(page.getByRole("button", {name: "Sized Menu"}))
      .toHaveAttribute("data-size", "sm")
  })

  test("icon button trigger inherits the menu size", async () => {
    await render(InheritedIconButtonSizeMenuComponent)

    await expect
      .element(page.getByRole("button", {name: "More actions"}))
      .toHaveAttribute("data-size", "sm")
  })

  test("explicit trigger size overrides the inherited menu size", async () => {
    await render(OverriddenButtonSizeMenuComponent)

    await expect
      .element(page.getByRole("button", {name: "Sized Menu"}))
      .toHaveAttribute("data-size", "lg")
  })
})
