import {Component, output} from "@angular/core"
import {LucidePlus, LucideSearch} from "@lucide/angular"
import {render} from "@testing-library/angular"
import {describe, expect, test, vi} from "vitest"
import {page} from "vitest/browser"

import {provideIcons} from "@qualcomm-ui/angular-core/lucide"
import {
  ButtonModule,
  QDS_BUTTON_PROPS_CONTEXT,
} from "@qualcomm-ui/angular/button"

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

@Component({
  imports: [ButtonModule],
  providers: [
    provideIcons({LucidePlus}),
    {
      provide: QDS_BUTTON_PROPS_CONTEXT,
      useValue: () => ({
        density: "compact",
        disabled: true,
        emphasis: "danger",
        size: "sm",
        variant: "ghost",
      }),
    },
  ],
  template: `
    <button q-button>Inherited text</button>
    <button
      aria-label="Inherited icon"
      icon="LucidePlus"
      q-icon-button
    ></button>
    <button
      density="default"
      emphasis="primary"
      q-button
      size="lg"
      variant="outline"
      [disabled]="false"
    >
      Overridden text
    </button>
    <button
      aria-label="Overridden icon"
      density="default"
      emphasis="primary"
      icon="LucidePlus"
      q-icon-button
      size="lg"
      variant="outline"
      [disabled]="false"
    ></button>
    <div density="default" q-button-group size="lg" [disabled]="false">
      <button q-button>Grouped text</button>
      <button
        aria-label="Grouped icon"
        icon="LucidePlus"
        q-icon-button
      ></button>
    </div>
    <div emphasis="primary" q-button-group variant="outline">
      <button q-button>Group styled text</button>
      <button
        aria-label="Group styled icon"
        icon="LucidePlus"
        q-icon-button
      ></button>
      <button emphasis="neutral" q-button variant="fill">
        Own styled text
      </button>
    </div>
  `,
})
class ContextualButtonsComponent {}

describe("Contextual button props", () => {
  test("supplies overridable props to text and icon buttons outside a menu", async () => {
    await render(ContextualButtonsComponent)
    for (const name of ["Inherited text", "Inherited icon"]) {
      const button = page.getByRole("button", {name})
      await expect.element(button).toBeDisabled()
      await expect.element(button).toHaveAttribute("data-size", "sm")
      await expect.element(button).toHaveAttribute("data-density", "compact")
      await expect.element(button).toHaveAttribute("data-variant", "ghost")
      await expect.element(button).toHaveAttribute("data-emphasis", "danger")
    }
    for (const name of ["Overridden text", "Overridden icon"]) {
      const button = page.getByRole("button", {name})
      await expect.element(button).not.toBeDisabled()
      await expect.element(button).toHaveAttribute("data-size", "lg")
      await expect.element(button).toHaveAttribute("data-density", "default")
      await expect.element(button).toHaveAttribute("data-variant", "outline")
      await expect.element(button).toHaveAttribute("data-emphasis", "primary")
    }
  })

  test("preserves the button group's enforced size, density and disabled state", async () => {
    await render(ContextualButtonsComponent)
    for (const name of ["Grouped text", "Grouped icon"]) {
      const button = page.getByRole("button", {name})
      await expect.element(button).not.toBeDisabled()
      await expect.element(button).toHaveAttribute("data-size", "lg")
      await expect.element(button).toHaveAttribute("data-density", "default")
    }
  })

  test("lets the button group's emphasis and variant win over the defaults", async () => {
    await render(ContextualButtonsComponent)
    for (const name of ["Group styled text", "Group styled icon"]) {
      const button = page.getByRole("button", {name})
      await expect.element(button).toHaveAttribute("data-emphasis", "primary")
      await expect.element(button).toHaveAttribute("data-variant", "outline")
    }
    const own = page.getByRole("button", {name: "Own styled text"})
    await expect.element(own).toHaveAttribute("data-emphasis", "neutral")
    await expect.element(own).toHaveAttribute("data-variant", "fill")
  })
})
