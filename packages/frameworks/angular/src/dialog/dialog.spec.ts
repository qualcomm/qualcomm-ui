import {Component, signal} from "@angular/core"
import {render} from "@testing-library/angular"
import {describe, expect, test, vi} from "vitest"
import {page, userEvent} from "vitest/browser"

import {provideDialogContext} from "@qualcomm-ui/angular-core/dialog"
import {PortalDirective} from "@qualcomm-ui/angular-core/portal"
import {providePresenceContext} from "@qualcomm-ui/angular-core/presence"
import {ButtonModule} from "@qualcomm-ui/angular/button"

import {DialogRootDirective} from "./dialog-root.directive"
import {DialogModule} from "./dialog.module"
import {provideQdsDialogContext} from "./qds-dialog-context.service"

const text = {
  close: "Close",
  description: "Lorem ipsum dolor sit amet",
  heading: "Dialog Title",
  open: "Open Dialog",
}

const labels = {
  closeButton: "Close Dialog",
}

const testIds = {
  backdrop: "dialog-backdrop",
  content: "dialog-content",
  positioner: "dialog-positioner",
}

@Component({
  imports: [DialogModule, ButtonModule, PortalDirective],
  providers: [
    provideDialogContext(),
    provideQdsDialogContext(),
    providePresenceContext(),
  ],
  template: `
    <button emphasis="primary" q-button q-dialog-trigger variant="fill">
      {{ text.open }}
    </button>
    <ng-template qPortal>
      <div q-dialog-backdrop [attr.data-test-id]="testIds.backdrop"></div>
      <div q-dialog-positioner [attr.data-test-id]="testIds.positioner">
        <section q-dialog-content [attr.data-test-id]="testIds.content">
          <div q-dialog-body>
            <h2 q-dialog-heading>{{ text.heading }}</h2>
            <button
              q-dialog-close-button
              [attr.aria-label]="labels.closeButton"
            ></button>
            <div q-dialog-description>
              {{ text.description }}
            </div>
          </div>

          <div q-dialog-footer>
            <button q-button q-dialog-close-trigger size="sm" variant="outline">
              {{ text.close }}
            </button>
          </div>
        </section>
      </div>
    </ng-template>
  `,
})
export class TestComponent extends DialogRootDirective {
  protected readonly labels = labels
  protected readonly testIds = testIds
  protected readonly text = text
}

@Component({
  imports: [DialogModule, ButtonModule],
  template: `
    <div q-dialog-root>
      <ng-container *dialogContext="let dialog">
        <p>{{ dialog.open ? openText() : closedText() }}</p>
      </ng-container>

      <button q-button q-dialog-trigger>{{ text.open }}</button>
      <q-dialog-floating-portal>
        <div q-dialog-body>
          <h2 q-dialog-heading>{{ text.heading }}</h2>
          <button
            q-dialog-close-button
            [attr.aria-label]="labels.closeButton"
          ></button>
        </div>
      </q-dialog-floating-portal>
    </div>
  `,
})
class ContextDialogComponent {
  protected readonly closedText = signal("Dialog is closed")
  protected readonly labels = labels
  protected readonly openText = signal("Dialog is open")
  protected readonly text = text
}

@Component({
  imports: [DialogModule, ButtonModule],
  template: `
    <div q-dialog-root>
      <button q-button q-dialog-trigger>{{ text.open }}</button>
      <q-dialog-floating-portal>
        <div q-dialog-body>
          <h2 q-dialog-heading>{{ text.heading }}</h2>
          <button
            q-dialog-close-button
            [attr.aria-label]="labels.closeButton"
          ></button>
          <div q-dialog-description>{{ text.description }}</div>
        </div>
      </q-dialog-floating-portal>
    </div>
  `,
})
class FloatingPortalDialogComponent {
  protected readonly labels = labels
  protected readonly text = text
}

@Component({
  imports: [DialogModule],
  template: `
    <div defaultOpen emphasis="danger" q-dialog-root>
      <q-dialog-floating-portal>
        <div q-dialog-body>
          <span q-dialog-indicator-icon>{{ customStatus() }}</span>
          <h2 q-dialog-heading>Custom indicator dialog</h2>
        </div>
      </q-dialog-floating-portal>
    </div>
  `,
})
class CustomIndicatorIconDialogComponent {
  protected readonly customStatus = signal("Custom status")
}

function dialogContent() {
  return page.getByTestId(testIds.content)
}

async function assertVisible() {
  await expect.element(dialogContent()).toBeVisible()
}

async function assertHidden() {
  await expect.element(dialogContent()).not.toBeVisible()
}

describe("Dialog", () => {
  test("controlled state", async () => {
    await render(TestComponent, {inputs: {open: true}})
    await expect.element(page.getByTestId(testIds.content)).toBeVisible()
  })

  test("restoreFocus: true", async () => {
    await render(TestComponent, {inputs: {restoreFocus: true}})

    await page.getByText(text.open).click()
    await expect.element(page.getByTestId(testIds.content)).toBeVisible()
    await page.getByText(text.close).click()
    await expect.element(page.getByText(text.open)).toHaveFocus()
  })

  test("restoreFocus: false", async () => {
    await render(TestComponent, {inputs: {restoreFocus: false}})

    await page.getByText(text.open).click()
    await expect.element(page.getByTestId(testIds.content)).toBeVisible()
    await page.getByText(text.close).click()
    await expect.element(page.getByText(text.open)).not.toHaveFocus()
  })

  test("lazyMount: true", async () => {
    await render(TestComponent, {inputs: {lazyMount: true}})

    await expect
      .element(page.getByTestId(testIds.content))
      .not.toBeInTheDocument()
    await page.getByText(text.open).click()
    await expect.element(page.getByTestId(testIds.content)).toBeVisible()
    await page.getByText(text.close).click()
    await expect.element(page.getByTestId(testIds.content)).not.toBeVisible()
  })

  test("unmountOnExit: true", async () => {
    await render(TestComponent, {inputs: {unmountOnExit: true}})

    await expect.element(page.getByTestId(testIds.content)).not.toBeVisible()
    await page.getByText(text.open).click()
    await expect.element(page.getByTestId(testIds.content)).toBeVisible()
    await page.getByText(text.close).click()
    await expect
      .element(page.getByTestId(testIds.content))
      .not.toBeInTheDocument()
  })

  test("trapFocus: true", async () => {
    await render(TestComponent, {inputs: {trapFocus: true}})

    await page.getByText(text.open).click()
    await expect.element(page.getByTestId(testIds.content)).toBeVisible()
    await expect.element(page.getByLabelText(labels.closeButton)).toHaveFocus()
    await userEvent.tab()
    await expect.element(page.getByText(text.close)).toHaveFocus()
    await userEvent.tab()
    await expect.element(page.getByLabelText(labels.closeButton)).toHaveFocus()
    await userEvent.tab()
    await expect.element(page.getByText(text.close)).toHaveFocus()
  })

  test("trapFocus: false", async () => {
    await render(TestComponent, {inputs: {trapFocus: false}})

    await page.getByText(text.open).click()
    await expect.element(page.getByTestId(testIds.content)).toBeVisible()
    await expect.element(page.getByText(text.open)).toHaveFocus()
  })

  test("closeOnEscape: true", async () => {
    await render(TestComponent, {inputs: {closeOnEscape: true}})

    await page.getByText(text.open).click()
    await expect.element(page.getByTestId(testIds.content)).toBeVisible()
    await userEvent.keyboard("{Escape}")
    await expect.element(page.getByTestId(testIds.content)).not.toBeVisible()
  })

  test("closeOnEscape: false", async () => {
    await render(TestComponent, {inputs: {closeOnEscape: false}})

    await page.getByText(text.open).click()
    await expect.element(page.getByTestId(testIds.content)).toBeVisible()
    await userEvent.keyboard("{Escape}")
    await expect.element(page.getByTestId(testIds.content)).toBeVisible()
  })

  test("trigger opens dialog", async () => {
    await render(TestComponent)

    await assertHidden()
    await page.getByRole("button", {name: text.open}).click()
    await assertVisible()
  })

  test("defaultOpen renders dialog initially open", async () => {
    await render(TestComponent, {inputs: {defaultOpen: true}})

    await assertVisible()
  })

  test("openChanged callback fires when dialog opens and closes", async () => {
    const openChangedWatcher = vi.fn()
    await render(TestComponent, {
      on: {openChanged: (open) => openChangedWatcher(open)},
    })

    await page.getByRole("button", {name: text.open}).click()
    await assertVisible()
    expect(openChangedWatcher).toHaveBeenLastCalledWith(true)

    await page.getByLabelText(labels.closeButton).click()
    await assertHidden()
    expect(openChangedWatcher).toHaveBeenLastCalledWith(false)
  })

  test("closeOnInteractOutside closes dialog", async () => {
    await render(TestComponent)

    await page.getByRole("button", {name: text.open}).click()
    await assertVisible()

    await page.getByTestId(testIds.positioner).click({position: {x: 5, y: 5}})
    await assertHidden()
  })

  test("closeOnInteractOutside false keeps dialog open", async () => {
    await render(TestComponent, {
      inputs: {closeOnInteractOutside: false},
    })

    await page.getByRole("button", {name: text.open}).click()
    await assertVisible()

    await page.getByTestId(testIds.positioner).click({position: {x: 5, y: 5}})
    await assertVisible()
  })

  test("close trigger closes dialog", async () => {
    await render(TestComponent)

    await page.getByRole("button", {name: text.open}).click()
    await assertVisible()

    await page.getByRole("button", {exact: true, name: text.close}).click()
    await assertHidden()
  })

  test("exposes dialog role with accessible name and description", async () => {
    await render(TestComponent, {inputs: {defaultOpen: true}})

    const dialog = page.getByRole("dialog", {name: text.heading})

    await expect.element(dialog).toBeVisible()
    await expect.element(dialog).toHaveAccessibleDescription(text.description)
  })

  test("floating portal renders an accessible dialog", async () => {
    await render(FloatingPortalDialogComponent)

    await page.getByRole("button", {name: text.open}).click()

    const dialog = page.getByRole("dialog", {name: text.heading})
    await expect.element(dialog).toBeVisible()
    await expect.element(dialog).toHaveAccessibleDescription(text.description)
  })

  test("context reflects whether the dialog is open", async () => {
    await render(ContextDialogComponent)

    await expect.element(page.getByText("Dialog is closed")).toBeVisible()

    await page.getByRole("button", {name: text.open}).click()
    await expect.element(page.getByText("Dialog is open")).toBeVisible()

    await page.getByLabelText(labels.closeButton).click()
    await expect.element(page.getByText("Dialog is closed")).toBeVisible()
  })

  test("indicator icon renders a custom icon element when provided", async () => {
    await render(CustomIndicatorIconDialogComponent)

    await expect.element(page.getByText("Custom status")).toBeVisible()
  })
})
