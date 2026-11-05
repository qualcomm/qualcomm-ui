import {Component, input, output, signal} from "@angular/core"
import {render} from "@testing-library/angular"
import {describe, expect, test, vi} from "vitest"
import {page} from "vitest/browser"

import {CollapsibleModule} from "@qualcomm-ui/angular/collapsible"

const triggerLabel = "Toggle"
const contentText = "Collapsible content"

const testIds = {
  content: "collapsible-content",
  root: "collapsible-root",
  trigger: "collapsible-trigger",
} as const

@Component({
  imports: [CollapsibleModule],
  template: `
    <div
      q-collapsible-root
      [attr.data-test-id]="testIds.root"
      [defaultOpen]="defaultOpen()"
      [disabled]="disabled()"
      [open]="open()"
      (openChanged)="openChanged.emit($event)"
    >
      <button q-collapsible-trigger [attr.data-test-id]="testIds.trigger">
        {{ triggerLabel() }}
      </button>
      <div q-collapsible-content [attr.data-test-id]="testIds.content">
        {{ contentText() }}
      </div>
    </div>
  `,
})
class CollapsibleDemoComponent {
  readonly defaultOpen = input<boolean | undefined>(undefined)
  readonly disabled = input<boolean | undefined>(undefined)
  readonly open = input<boolean | undefined>(undefined)
  readonly openChanged = output<boolean>()

  protected readonly contentText = signal(contentText)
  protected readonly testIds = testIds
  protected readonly triggerLabel = signal(triggerLabel)
}

@Component({
  imports: [CollapsibleModule],
  template: `
    <div q-collapsible-root [open]="open()" (openChanged)="open.set($event)">
      <button q-collapsible-trigger>{{ triggerLabel() }}</button>
      <div q-collapsible-content>{{ contentText() }}</div>
    </div>
  `,
})
class ControlledCollapsibleComponent {
  protected readonly contentText = signal(contentText)
  protected readonly open = signal(false)
  protected readonly triggerLabel = signal(triggerLabel)
}

describe("Collapsible", () => {
  test("open/close on trigger click", async () => {
    await render(CollapsibleDemoComponent)

    const trigger = page.getByRole("button", {name: triggerLabel})
    const content = page.getByText(contentText)

    await expect.element(content).not.toBeVisible()

    await trigger.click()
    await expect.element(content).toBeVisible()

    await trigger.click()
    await expect.element(content).not.toBeVisible()
  })

  test("defaultOpen initially opens the content", async () => {
    await render(CollapsibleDemoComponent, {
      inputs: {defaultOpen: true},
    })

    const trigger = page.getByRole("button", {name: triggerLabel})
    const content = page.getByText(contentText)

    await expect.element(content).toBeVisible()

    await trigger.click()
    await expect.element(content).not.toBeVisible()

    await trigger.click()
    await expect.element(content).toBeVisible()
  })

  test("controlled open state follows openChanged updates", async () => {
    await render(ControlledCollapsibleComponent)

    const trigger = page.getByRole("button", {name: triggerLabel})
    const content = page.getByText(contentText)

    await expect.element(content).not.toBeVisible()

    await trigger.click()
    await expect.element(content).toBeVisible()

    await trigger.click()
    await expect.element(content).not.toBeVisible()
  })

  test("disabled trigger clicks are no-ops", async () => {
    const openChangedWatcher = vi.fn()
    await render(CollapsibleDemoComponent, {
      inputs: {disabled: true},
      on: {openChanged: (open) => openChangedWatcher(open)},
    })

    const trigger = page.getByRole("button", {name: triggerLabel})
    const content = page.getByText(contentText)

    await expect.element(content).not.toBeVisible()

    await trigger.click({force: true})

    await expect.element(content).not.toBeVisible()
    expect(openChangedWatcher).not.toHaveBeenCalled()
  })

  test("openChanged fires with open and closed values", async () => {
    const openChangedWatcher = vi.fn()
    await render(CollapsibleDemoComponent, {
      on: {openChanged: (open) => openChangedWatcher(open)},
    })

    const trigger = page.getByRole("button", {name: triggerLabel})

    await trigger.click()
    expect(openChangedWatcher).toHaveBeenLastCalledWith(true)

    await trigger.click()
    expect(openChangedWatcher).toHaveBeenLastCalledWith(false)
  })

  test("renders root, trigger, and content parts", async () => {
    await render(CollapsibleDemoComponent)

    await expect.element(page.getByTestId(testIds.root)).toBeInTheDocument()
    await expect.element(page.getByTestId(testIds.trigger)).toBeInTheDocument()
    await expect.element(page.getByTestId(testIds.content)).toBeInTheDocument()
  })
})
