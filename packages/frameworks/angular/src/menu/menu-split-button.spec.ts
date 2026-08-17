import {Component, output} from "@angular/core"
import {LucideDownload} from "@lucide/angular"
import {render} from "@testing-library/angular"
import {describe, expect, test, vi} from "vitest"
import {page} from "vitest/browser"

import {provideIcons} from "@qualcomm-ui/angular-core/lucide"
import {PortalDirective} from "@qualcomm-ui/angular-core/portal"
import {MenuModule} from "@qualcomm-ui/angular/menu"

function menu() {
  return page.getByRole("menu")
}

@Component({
  imports: [MenuModule, PortalDirective],
  providers: [provideIcons({LucideDownload})],
  template: `
    <q-menu>
      <div
        aria-label="Download"
        emphasis="primary"
        q-menu-split-button
        startIcon="Download"
        (actionClicked)="actionClicked.emit($event)"
      >
        Download
      </div>
      <ng-template qPortal>
        <div q-menu-positioner>
          <div q-menu-content>
            <button q-menu-item value="pdf">Download as PDF</button>
            <button q-menu-item value="zip">Download as ZIP</button>
          </div>
        </div>
      </ng-template>
    </q-menu>
  `,
})
class SplitButtonComponent {
  readonly actionClicked = output<MouseEvent>()
}

@Component({
  imports: [MenuModule, PortalDirective],
  template: `
    <q-menu>
      <div q-menu-split-button>
        Save
        <button aria-label="More save options" q-menu-icon-button></button>
      </div>
      <ng-template qPortal>
        <div q-menu-positioner>
          <div q-menu-content>
            <button q-menu-item value="save-as">Save As</button>
          </div>
        </div>
      </ng-template>
    </q-menu>
  `,
})
class ProjectedChevronSplitButtonComponent {}

describe("MenuSplitButton", () => {
  test("clicking the action button emits actionClicked without opening the menu", async () => {
    const actionClicked = vi.fn()
    await render(SplitButtonComponent, {on: {actionClicked}})

    await page.getByRole("button", {name: "Download"}).click()

    await expect.poll(() => actionClicked).toHaveBeenCalledTimes(1)
    await expect.element(menu()).not.toBeInTheDocument()
  })

  test("clicking the chevron opens the menu", async () => {
    await render(SplitButtonComponent)

    await expect.element(menu()).not.toBeInTheDocument()

    await page.getByRole("button", {name: "More options"}).click()

    await expect.element(menu()).toBeVisible()
    await expect.element(page.getByText("Download as PDF")).toBeVisible()
  })

  test("renders the chevron with a default accessible name of More options", async () => {
    await render(SplitButtonComponent)

    await expect
      .element(page.getByRole("button", {name: "More options"}))
      .toBeVisible()
  })

  test("projected icon button overrides the default chevron accessible name", async () => {
    await render(ProjectedChevronSplitButtonComponent)

    await expect
      .element(page.getByRole("button", {name: "More save options"}))
      .toBeVisible()
    await expect
      .element(page.getByRole("button", {name: "More options"}))
      .not.toBeInTheDocument()
  })

  test("cascades shared inputs to both the action and chevron buttons", async () => {
    await render(SplitButtonComponent)

    await expect
      .element(page.getByRole("button", {name: "Download"}))
      .toHaveAttribute("data-emphasis", "primary")
    await expect
      .element(page.getByRole("button", {name: "More options"}))
      .toHaveAttribute("data-emphasis", "primary")
  })
})
