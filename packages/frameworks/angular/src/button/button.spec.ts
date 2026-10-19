import {Component, output, signal} from "@angular/core"
import {LucidePlus, LucideSearch} from "@lucide/angular"
import {render} from "@testing-library/angular"
import {describe, expect, test, vi} from "vitest"
import {page} from "vitest/browser"

import {provideIcons} from "@qualcomm-ui/angular-core/lucide"
import {PortalDirective} from "@qualcomm-ui/angular-core/portal"
import {
  NumberBadgeDirective,
  StatusBadgeDirective,
} from "@qualcomm-ui/angular/badge"
import {ButtonModule} from "@qualcomm-ui/angular/button"
import {MenuModule} from "@qualcomm-ui/angular/menu"

@Component({
  imports: [ButtonModule],
  providers: [provideIcons({LucidePlus, LucideSearch})],
  template: `
    <button
      q-button
      [attr.aria-label]="ariaLabel"
      [disabled]="disabled"
      [endIcon]="endIcon"
      [startIcon]="startIcon"
      (click)="clicked.emit()"
    >
      {{ label }}
    </button>
  `,
})
class ButtonComponent {
  readonly clicked = output<void>()
  readonly ariaLabel: string | null = null
  readonly disabled = false
  readonly endIcon: "Plus" | undefined = undefined
  readonly label = "Click Me"
  readonly startIcon: "Plus" | undefined = undefined
}

@Component({
  imports: [ButtonModule],
  providers: [provideIcons({LucideSearch})],
  template: `
    <button
      aria-label="Search"
      icon="LucideSearch"
      q-icon-button
      [disabled]="disabled"
      (click)="clicked.emit()"
    ></button>
  `,
})
class IconButtonComponent {
  readonly clicked = output<void>()
  readonly disabled = false
}

describe("Button", () => {
  test("renders children and fires click output when clicked", async () => {
    const clicked = vi.fn()
    await render(ButtonComponent, {
      on: {
        clicked,
      },
    })

    const button = page.getByRole("button", {name: "Click Me"})
    await expect.element(button).toBeVisible()

    await button.click()

    await expect.poll(() => clicked).toHaveBeenCalledTimes(1)
  })

  test("does not fire click output when disabled", async () => {
    const clicked = vi.fn()

    @Component({
      imports: [ButtonModule],
      template: `
        <button disabled q-button (click)="clicked.emit()">Click Me</button>
      `,
    })
    class DisabledButtonComponent {
      readonly clicked = output<void>()
    }

    await render(DisabledButtonComponent, {
      on: {
        clicked,
      },
    })

    const button = page.getByRole("button", {name: "Click Me"})
    await expect.element(button).toBeDisabled()

    await button.click({force: true}).catch(() => {})

    expect(clicked).not.toHaveBeenCalled()
  })

  test("renders a visible start icon alongside the children", async () => {
    @Component({
      imports: [ButtonModule],
      providers: [provideIcons({LucidePlus})],
      template: `
        <button q-button startIcon="Plus">Add Item</button>
      `,
    })
    class StartIconButtonComponent {}

    await render(StartIconButtonComponent)

    const button = page.getByRole("button", {name: "Add Item"})
    await expect.element(button).toBeVisible()
    expect(button.element().querySelector("svg")).toBeTruthy()
  })

  test("renders a visible end icon alongside the children", async () => {
    @Component({
      imports: [ButtonModule],
      providers: [provideIcons({LucidePlus})],
      template: `
        <button endIcon="Plus" q-button>Add Item</button>
      `,
    })
    class EndIconButtonComponent {}

    await render(EndIconButtonComponent)

    const button = page.getByRole("button", {name: "Add Item"})
    await expect.element(button).toBeVisible()
    expect(button.element().querySelector("svg")).toBeTruthy()
  })

  test("exposes the aria-label as the accessible name", async () => {
    @Component({
      imports: [ButtonModule],
      template: `
        <button aria-label="Save document" q-button>Save</button>
      `,
    })
    class AriaLabelButtonComponent {}

    await render(AriaLabelButtonComponent)

    await expect
      .element(page.getByRole("button", {name: "Save document"}))
      .toBeVisible()
  })
})

describe("IconButton", () => {
  test("renders an accessible button with a configured icon", async () => {
    await render(IconButtonComponent)

    const button = page.getByRole("button", {name: "Search"})
    await expect.element(button).toBeVisible()
    expect(button.element().querySelector("svg")).toBeTruthy()
  })

  test("renders a user-supplied icon visibly inside the button", async () => {
    @Component({
      imports: [ButtonModule],
      providers: [provideIcons({LucideSearch})],
      template: `
        <button aria-label="Search" q-icon-button>
          <svg data-test-id="icon-button-icon" qIcon="LucideSearch"></svg>
        </button>
      `,
    })
    class ProjectedIconButtonComponent {}

    await render(ProjectedIconButtonComponent)

    await expect
      .element(page.getByRole("button", {name: "Search"}))
      .toBeVisible()
    await expect.element(page.getByTestId("icon-button-icon")).toBeVisible()
  })

  test("does not fire click output when disabled", async () => {
    const clicked = vi.fn()

    @Component({
      imports: [ButtonModule],
      providers: [provideIcons({LucidePlus})],
      template: `
        <button
          aria-label="Add"
          disabled
          icon="Plus"
          q-icon-button
          (click)="clicked.emit()"
        ></button>
      `,
    })
    class DisabledIconButtonComponent {
      readonly clicked = output<void>()
    }

    await render(DisabledIconButtonComponent, {
      on: {
        clicked,
      },
    })

    const button = page.getByRole("button", {name: "Add"})
    await expect.element(button).toBeDisabled()

    await button.click({force: true}).catch(() => {})

    expect(clicked).not.toHaveBeenCalled()
  })
})

describe("ButtonGroup", () => {
  test("exposes children through a group with an accessible name", async () => {
    @Component({
      imports: [ButtonModule],
      template: `
        <div aria-label="Editor actions" q-button-group>
          <button q-button>Save</button>
          <button q-button>Cancel</button>
        </div>
      `,
    })
    class ButtonGroupComponent {}

    await render(ButtonGroupComponent)

    await expect
      .element(page.getByRole("group", {name: "Editor actions"}))
      .toBeVisible()
    await expect.element(page.getByRole("button", {name: "Save"})).toBeVisible()
    await expect
      .element(page.getByRole("button", {name: "Cancel"}))
      .toBeVisible()
  })

  test("propagates disabled to child buttons", async () => {
    @Component({
      imports: [ButtonModule],
      template: `
        <div aria-label="Editor actions" disabled q-button-group>
          <button q-button>Save</button>
          <button q-button>Cancel</button>
        </div>
      `,
    })
    class DisabledButtonGroupComponent {}

    await render(DisabledButtonGroupComponent)

    await expect
      .element(page.getByRole("button", {name: "Save"}))
      .toBeDisabled()
    await expect
      .element(page.getByRole("button", {name: "Cancel"}))
      .toBeDisabled()
  })

  test("group density and size win over the child's own values", async () => {
    @Component({
      imports: [ButtonModule],
      template: `
        <div
          aria-label="Editor actions"
          density="compact"
          q-button-group
          size="lg"
        >
          <button density="default" q-button size="sm">Save</button>
        </div>
      `,
    })
    class GroupSizingComponent {}

    await render(GroupSizingComponent)

    const button = page.getByRole("button", {name: "Save"})
    await expect.element(button).toHaveAttribute("data-density", "compact")
    await expect.element(button).toHaveAttribute("data-size", "lg")
  })

  test("child emphasis and variant override the group's values", async () => {
    @Component({
      imports: [ButtonModule],
      template: `
        <div
          aria-label="Editor actions"
          emphasis="primary"
          q-button-group
          variant="outline"
        >
          <button emphasis="neutral" q-button variant="fill">Save</button>
        </div>
      `,
    })
    class ChildOverrideComponent {}

    await render(ChildOverrideComponent)

    const button = page.getByRole("button", {name: "Save"})
    await expect.element(button).toHaveAttribute("data-emphasis", "neutral")
    await expect.element(button).toHaveAttribute("data-variant", "fill")
  })
})

describe("Button badge", () => {
  test("projects a number badge inside the button", async () => {
    @Component({
      imports: [ButtonModule, NumberBadgeDirective],
      template: `
        <button q-button>
          Notifications
          <span q-number-badge value="3"></span>
        </button>
      `,
    })
    class BadgeButtonComponent {}

    await render(BadgeButtonComponent)

    await expect
      .element(page.getByRole("button", {name: /Notifications/}))
      .toBeVisible()
    await expect.element(page.getByText("3")).toBeVisible()
  })

  test("renders the badge after the label even when authored before it", async () => {
    @Component({
      imports: [ButtonModule, NumberBadgeDirective],
      providers: [provideIcons({LucidePlus})],
      template: `
        <button endIcon="LucidePlus" q-button>
          <span q-number-badge value="3"></span>
          Notifications
        </button>
      `,
    })
    class BadgeFirstComponent {}

    await render(BadgeFirstComponent)

    const button = page.getByRole("button")
    await expect.element(button).toHaveAccessibleName("Notifications 3")
    const badge = page.getByText("3").element().closest("[q-number-badge]")!
    const endIcon = button.element().querySelector("svg")!
    expect(
      badge.compareDocumentPosition(endIcon) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy()
  })

  test("derives a non-fill number badge's size and emphasis from the button", async () => {
    @Component({
      imports: [ButtonModule, NumberBadgeDirective],
      template: `
        <button emphasis="primary" q-button size="md" variant="outline">
          Notifications
          <span q-number-badge value="3"></span>
        </button>
      `,
    })
    class OutlineBadgeButtonComponent {}

    await render(OutlineBadgeButtonComponent)

    const badge = page.getByText("3").element().closest("[q-number-badge]")
    expect(badge).toHaveAttribute("data-size", "xs")
    expect(badge).toHaveAttribute("data-emphasis", "brand")
  })

  test("derives a fill number badge's size and emphasis from a large button", async () => {
    @Component({
      imports: [ButtonModule, NumberBadgeDirective],
      template: `
        <button emphasis="danger" q-button size="lg" variant="fill">
          Notifications
          <span q-number-badge value="3"></span>
        </button>
      `,
    })
    class LargeFillBadgeButtonComponent {}

    await render(LargeFillBadgeButtonComponent)

    const badge = page.getByText("3").element().closest("[q-number-badge]")
    expect(badge).toHaveAttribute("data-size", "sm")
    expect(badge).toHaveAttribute("data-emphasis", "persistent-white")
  })

  test("derives status badge size from the button without defaulting its emphasis", async () => {
    @Component({
      imports: [ButtonModule, StatusBadgeDirective],
      template: `
        <button emphasis="danger" q-button size="lg" variant="fill">
          Status
          <span data-test-id="status-badge" q-status-badge></span>
        </button>
      `,
    })
    class StatusBadgeButtonComponent {}

    await render(StatusBadgeButtonComponent)

    const badge = page.getByTestId("status-badge")
    await expect.element(badge).toHaveAttribute("data-size", "md")
    await expect.element(badge).toHaveAttribute("data-emphasis", "neutral")
  })

  test("author-provided badge inputs override the button's defaults", async () => {
    @Component({
      imports: [ButtonModule, NumberBadgeDirective],
      template: `
        <button emphasis="primary" q-button size="lg" variant="fill">
          Notifications
          <span emphasis="danger" q-number-badge size="md" value="3"></span>
        </button>
      `,
    })
    class OverriddenBadgeButtonComponent {}

    await render(OverriddenBadgeButtonComponent)

    const badge = page.getByText("3").element().closest("[q-number-badge]")
    expect(badge).toHaveAttribute("data-size", "md")
    expect(badge).toHaveAttribute("data-emphasis", "danger")
  })

  test("badge defaults follow the button's size and disabled state as they change", async () => {
    @Component({
      imports: [ButtonModule, NumberBadgeDirective],
      template: `
        <button q-button [disabled]="disabled()" [size]="size()">
          Notifications
          <span q-number-badge value="3"></span>
        </button>
        <button type="button" (click)="size.set('lg')">Grow</button>
        <button type="button" (click)="disabled.set(true)">Disable</button>
      `,
    })
    class ReactiveBadgeButtonComponent {
      protected readonly disabled = signal(false)
      protected readonly size = signal<"lg" | "md" | "sm">("md")
    }

    await render(ReactiveBadgeButtonComponent)

    const getBadge = () =>
      page.getByText("3").element().closest("[q-number-badge]")

    expect(getBadge()).toHaveAttribute("data-size", "xs")
    expect(getBadge()).not.toHaveAttribute("data-disabled")

    await page.getByRole("button", {name: "Grow"}).click()
    await expect.poll(() => getBadge()?.getAttribute("data-size")).toBe("sm")

    await page.getByRole("button", {name: "Disable"}).click()
    await expect
      .poll(() => getBadge()?.hasAttribute("data-disabled"))
      .toBe(true)
  })

  test("a badge rendered outside a button keeps its own defaults", async () => {
    @Component({
      imports: [NumberBadgeDirective],
      template: `
        <span q-number-badge value="3"></span>
      `,
    })
    class StandaloneBadgeComponent {}

    await render(StandaloneBadgeComponent)

    const badge = page.getByText("3").element().closest("[q-number-badge]")
    expect(badge).toHaveAttribute("data-size", "md")
    expect(badge).toHaveAttribute("data-emphasis", "neutral")
  })

  test("MenuButton applies its size default to a projected number badge", async () => {
    @Component({
      imports: [MenuModule, NumberBadgeDirective, PortalDirective],
      template: `
        <q-menu>
          <button q-menu-button size="lg">
            Actions
            <span q-number-badge value="3"></span>
          </button>
          <ng-template qPortal>
            <div q-menu-positioner>
              <div q-menu-content>
                <button q-menu-item value="one">One</button>
              </div>
            </div>
          </ng-template>
        </q-menu>
      `,
    })
    class MenuBadgeButtonComponent {}

    await render(MenuBadgeButtonComponent)

    await expect
      .element(page.getByRole("button", {name: /Actions/}))
      .toBeVisible()

    const badge = page.getByText("3").element().closest("[q-number-badge]")
    expect(badge).toHaveAttribute("data-size", "sm")
  })
})
