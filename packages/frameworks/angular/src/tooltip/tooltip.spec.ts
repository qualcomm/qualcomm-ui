import {Component, input, output} from "@angular/core"
import {render} from "@testing-library/angular"
import {describe, expect, test, vi} from "vitest"
import {page, userEvent} from "vitest/browser"

import {ButtonModule} from "@qualcomm-ui/angular/button"
import {TooltipModule} from "@qualcomm-ui/angular/tooltip"
import {PortalComponent} from "@qualcomm-ui/angular-core/portal"

const testIds = {
  tooltipTrigger: "tooltip-trigger",
} as const

const demoLabel = "Hello World!"

@Component({
  imports: [TooltipModule, PortalComponent, ButtonModule],
  standalone: true,
  template: `
    <div class="m-8">
      <div
        q-tooltip-root
        [closeOnClick]="closeOnClick()"
        [closeOnEscape]="closeOnEscape()"
        [disabled]="disabled()"
        [open]="open()"
        (openChanged)="openChanged.emit($event)"
      >
        <button
          q-button
          q-tooltip-trigger
          [attr.data-test-id]="testIds.tooltipTrigger"
        >
          Hover me
        </button>
        <q-portal>
          <div q-tooltip-positioner>
            <div q-tooltip-content>
              <div q-tooltip-arrow>
                <div q-tooltip-arrow-tip></div>
              </div>
              {{ demoLabel }}
            </div>
          </div>
        </q-portal>
      </div>
    </div>
  `,
})
class TooltipDemoComponent {
  readonly open = input(false)
  readonly disabled = input(false)
  readonly closeOnClick = input(true)
  readonly closeOnEscape = input(true)
  readonly openChanged = output<boolean>()

  protected readonly demoLabel = demoLabel
  protected readonly testIds = testIds
}

describe("tooltip", () => {
  test("not visible by default", async () => {
    await render(TooltipDemoComponent)

    expect(page.getByTestId(testIds.tooltipTrigger)).toBeVisible()
    expect(page.getByText(demoLabel)).not.toBeVisible()
  })

  test("visible when trigger hovered over", async () => {
    await render(TooltipDemoComponent)

    await page.getByTestId(testIds.tooltipTrigger).hover()
    await expect.element(page.getByText(demoLabel)).toBeVisible()
  })

  test("visible when trigger focused", async () => {
    await render(TooltipDemoComponent)

    await userEvent.tab()
    await expect.element(page.getByText(demoLabel)).toBeVisible()
  })

  test("closes when trigger not hovered over", async () => {
    await render(TooltipDemoComponent)

    await page.getByTestId(testIds.tooltipTrigger).hover()
    await expect.element(page.getByText(demoLabel)).toBeVisible()
    await page.getByTestId(testIds.tooltipTrigger).unhover()
    await expect.element(page.getByText(demoLabel)).not.toBeVisible()
  })

  test("closes when trigger loses focus", async () => {
    await render(TooltipDemoComponent)

    await userEvent.tab()
    await expect.element(page.getByText(demoLabel)).toBeVisible()
    await userEvent.tab()
    await expect.element(page.getByText(demoLabel)).not.toBeVisible()
  })

  test("closes on click by default", async () => {
    await render(TooltipDemoComponent)

    await page.getByTestId(testIds.tooltipTrigger).hover()
    await expect.element(page.getByText(demoLabel)).toBeVisible()

    await page.getByTestId(testIds.tooltipTrigger).click()
    await expect.element(page.getByText(demoLabel)).not.toBeVisible()
  })

  test("closes on Esc by default", async () => {
    await render(TooltipDemoComponent)

    await page.getByTestId(testIds.tooltipTrigger).hover()
    await expect.element(page.getByText(demoLabel)).toBeVisible()

    await userEvent.keyboard("{Escape}")
    await expect.element(page.getByText(demoLabel)).not.toBeVisible()
  })

  test("visible when using `open` prop", async () => {
    await render(TooltipDemoComponent, {inputs: {open: true}})

    await expect.element(page.getByText(demoLabel)).toBeVisible()
  })

  test("doesn't open when `disabled` is true", async () => {
    await render(TooltipDemoComponent, {inputs: {disabled: true}})

    await userEvent.tab()
    await expect.element(page.getByText(demoLabel)).not.toBeVisible()
    await page.getByTestId(testIds.tooltipTrigger).hover()
    await expect.element(page.getByText(demoLabel)).not.toBeVisible()
  })

  test("doesn't close on click when `closeOnClick` is false", async () => {
    await render(TooltipDemoComponent, {inputs: {closeOnClick: false}})

    await page.getByTestId(testIds.tooltipTrigger).hover()
    await expect.element(page.getByText(demoLabel)).toBeVisible()
    await page.getByTestId(testIds.tooltipTrigger).click()
    await expect.element(page.getByText(demoLabel)).toBeVisible()
  })

  test("doesn't close on Escape when `closeOnEscape` is false", async () => {
    await render(TooltipDemoComponent, {inputs: {closeOnEscape: false}})

    await page.getByTestId(testIds.tooltipTrigger).hover()
    await expect.element(page.getByText(demoLabel)).toBeVisible()
    await userEvent.keyboard("{Escape}")
    await expect.element(page.getByText(demoLabel)).toBeVisible()
  })

  test("calls `onOpenChange` when tooltip is opened or closed", async () => {
    const openChangedSpy = vi.fn()
    await render(TooltipDemoComponent, {
      on: {
        openChanged: (details: boolean): void => {
          openChangedSpy(details)
        },
      },
    })

    await page.getByTestId(testIds.tooltipTrigger).hover()
    await page.getByTestId(testIds.tooltipTrigger).click()

    await expect.poll(() => openChangedSpy).toHaveBeenCalledTimes(2)
    expect(openChangedSpy.mock.calls[0][0]).toEqual(true)
    expect(openChangedSpy.mock.calls[1][0]).toEqual(false)
  })
})
