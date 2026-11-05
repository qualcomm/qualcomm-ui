import {Component} from "@angular/core"
import {LucidePlus} from "@lucide/angular"
import {render} from "@testing-library/angular"
import {describe, expect, test} from "vitest"
import {page} from "vitest/browser"

import {provideIcons} from "@qualcomm-ui/angular-core/lucide"
import {
  BadgeDirective,
  IconBadgeDirective,
  NumberBadgeDirective,
  StatusBadgeDirective,
} from "@qualcomm-ui/angular/badge"

describe("Badge", () => {
  test("renders text badge content with configured bindings", async () => {
    @Component({
      imports: [BadgeDirective],
      template: `
        <span emphasis="success" q-badge size="sm" variant="subtle">
          Available
        </span>
      `,
    })
    class TextBadgeComponent {}

    await render(TextBadgeComponent)

    const badge = page.getByText("Available").element().closest("[q-badge]")
    await expect.element(page.getByText("Available")).toBeVisible()
    expect(badge).toHaveAttribute("data-emphasis", "success")
    expect(badge).toHaveAttribute("data-size", "sm")
    expect(badge).toHaveAttribute("data-variant", "subtle")
  })

  test("renders overflow text for number badges when value exceeds max", async () => {
    @Component({
      imports: [NumberBadgeDirective],
      template: `
        <span
          data-test-id="count-badge"
          max="99"
          q-number-badge
          value="125"
        ></span>
      `,
    })
    class NumberBadgeComponent {}

    await render(NumberBadgeComponent)

    const badge = page.getByTestId("count-badge")
    await expect.element(badge).toHaveTextContent("99+")
    expect(badge).toHaveAttribute("data-overflow", "")
  })

  test("renders an icon badge from the provided icon name", async () => {
    @Component({
      imports: [IconBadgeDirective],
      providers: [provideIcons({LucidePlus})],
      template: `
        <span
          data-test-id="icon-badge"
          icon="Plus"
          q-icon-badge
          size="lg"
        ></span>
      `,
    })
    class IconBadgeComponent {}

    await render(IconBadgeComponent)

    const badge = page.getByTestId("icon-badge")
    expect(badge.element().querySelector("svg")).toBeTruthy()
    expect(badge).toHaveAttribute("data-size", "lg")
  })

  test("applies status badge state bindings", async () => {
    @Component({
      imports: [StatusBadgeDirective],
      template: `
        <span
          data-test-id="status-badge"
          disabled
          emphasis="danger"
          q-status-badge
          variant="outlined"
        ></span>
      `,
    })
    class StatusBadgeComponent {}

    await render(StatusBadgeComponent)

    const badge = page.getByTestId("status-badge")
    expect(badge).toHaveAttribute("data-disabled", "")
    expect(badge).toHaveAttribute("data-emphasis", "danger")
    expect(badge).toHaveAttribute("data-variant", "outlined")
  })
})
