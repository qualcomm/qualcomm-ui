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
  test.each([
    {lazyMount: undefined, name: "defaults", unmountOnExit: undefined},
    {lazyMount: true, name: "lazy mounting", unmountOnExit: false},
    {lazyMount: false, name: "unmount on exit", unmountOnExit: true},
    {lazyMount: true, name: "both enabled", unmountOnExit: true},
  ])(
    "$name controls content mounting",
    async ({lazyMount, name, unmountOnExit}) => {
      const mountingInputs =
        name === "defaults"
          ? ""
          : '[lazyMount]="lazyMount" [unmountOnExit]="unmountOnExit"'
      await render(
        `
        <div q-collapsible-root ${mountingInputs}>
          <button q-collapsible-trigger>Toggle</button>
          <div q-collapsible-content #content="collapsibleContent">
            @if (content.shouldRender()) {
              <p>Collapsible content</p>
            }
          </div>
        </div>
      `,
        {
          componentProperties: {lazyMount, unmountOnExit},
          imports: [CollapsibleModule],
        },
      )

      const content = page.getByText(contentText)
      const trigger = page.getByRole("button", {name: triggerLabel})
      if (lazyMount) {
        await expect.element(content).not.toBeInTheDocument()
      } else {
        await expect.element(content).toBeInTheDocument()
        await expect.element(content).not.toBeVisible()
      }

      await trigger.click()
      await expect.element(content).toBeVisible()
      await trigger.click()
      if (unmountOnExit) {
        await expect.element(content).not.toBeInTheDocument()
      } else {
        await expect.element(content).toBeInTheDocument()
        await expect.element(content).not.toBeVisible()
      }

      await trigger.click()
      await expect.element(content).toBeVisible()
    },
  )

  test.each([false, true])(
    "unmountOnExit=%s determines whether local input state survives collapse",
    async (unmountOnExit) => {
      await render(
        `
          <div q-collapsible-root lazyMount [unmountOnExit]="unmountOnExit">
            <button q-collapsible-trigger>Toggle</button>
            <div q-collapsible-content #content="collapsibleContent">
              @if (content.shouldRender()) {
                <input aria-label="Notes" value="initial" />
              }
            </div>
          </div>
        `,
        {
          componentProperties: {unmountOnExit},
          imports: [CollapsibleModule],
        },
      )

      const trigger = page.getByRole("button", {name: triggerLabel})
      const input = page.getByLabelText("Notes")
      await trigger.click()
      await input.fill("edited")
      await trigger.click()
      if (unmountOnExit) {
        await expect.element(input).not.toBeInTheDocument()
      } else {
        await expect.element(input).not.toBeVisible()
      }
      await trigger.click()
      await expect
        .element(input)
        .toHaveValue(unmountOnExit ? "initial" : "edited")
    },
  )

  test("destroys content after the collapse animation and reports exit completion", async () => {
    const onExitComplete = vi.fn()
    const exitAnimations: Animation[] = []
    const pauseExitAnimation = (event: {target: EventTarget | null}) => {
      if (event.target instanceof HTMLElement) {
        for (const animation of event.target.getAnimations()) {
          if (!exitAnimations.includes(animation)) {
            animation.pause()
            exitAnimations.push(animation)
          }
        }
      }
    }
    await render(
      `
        <div q-collapsible-root defaultOpen lazyMount unmountOnExit
          style="--animation-duration-moderate: 60s"
          (animationstart)="pauseExitAnimation($event)"
          (exitCompleted)="onExitComplete()">
          <button q-collapsible-trigger>Toggle</button>
          <div q-collapsible-content #content="collapsibleContent">
            @if (content.shouldRender()) {
              <p>Collapsible content</p>
            }
          </div>
        </div>
      `,
      {
        componentProperties: {onExitComplete, pauseExitAnimation},
        imports: [CollapsibleModule],
      },
    )

    const content = page.getByText(contentText)
    await expect.element(content).toBeVisible()
    await page.getByRole("button", {name: triggerLabel}).click()
    await expect.poll(() => exitAnimations.length).toBeGreaterThan(0)
    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
    })
    await expect.element(content).toBeInTheDocument()
    expect(onExitComplete).not.toHaveBeenCalled()
    for (const animation of exitAnimations) {
      animation.play()
      animation.finish()
    }
    await expect.element(content).not.toBeInTheDocument()
    await expect.poll(() => onExitComplete).toHaveBeenCalledOnce()
  })

  test("controlled content mounts and unmounts on trigger and external updates", async () => {
    await render(
      `
        <button (click)="open.set(true)">Open externally</button>
        <button (click)="open.set(false)">Close externally</button>
        <div q-collapsible-root lazyMount unmountOnExit [open]="open()" (openChanged)="open.set($event)">
          <button q-collapsible-trigger>Toggle</button>
          <div q-collapsible-content #content="collapsibleContent">
            @if (content.shouldRender()) {
              <p>Collapsible content</p>
            }
          </div>
        </div>
      `,
      {
        componentProperties: {open: signal(false)},
        imports: [CollapsibleModule],
      },
    )

    const content = page.getByText(contentText)
    await expect.element(content).not.toBeInTheDocument()
    await page.getByRole("button", {name: "Open externally"}).click()
    await expect.element(content).toBeVisible()
    await page.getByRole("button", {name: triggerLabel}).click()
    await expect.element(content).not.toBeInTheDocument()
    await page.getByRole("button", {name: triggerLabel}).click()
    await expect.element(content).toBeVisible()
    await page.getByRole("button", {name: "Close externally"}).click()
    await expect.element(content).not.toBeInTheDocument()
  })

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
