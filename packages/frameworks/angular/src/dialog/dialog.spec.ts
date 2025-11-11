import {Component} from "@angular/core"
import {render} from "@testing-library/angular"
import {page, userEvent} from "@vitest/browser/context"
import {describe, expect, test} from "vitest"

import {ButtonModule} from "@qualcomm-ui/angular/button"
import {provideDialogContext} from "@qualcomm-ui/angular-core/dialog"
import {PortalDirective} from "@qualcomm-ui/angular-core/portal"
import {providePresenceContext} from "@qualcomm-ui/angular-core/presence"

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
})
