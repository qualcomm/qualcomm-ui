import {Component, output, signal} from "@angular/core"
import {render} from "@testing-library/angular"
import {Plus, Star} from "lucide-angular"
import {describe, expect, test, vi} from "vitest"
import {page} from "vitest/browser"

import {provideIcons} from "@qualcomm-ui/angular-core/lucide"
import {EndIconDirective} from "@qualcomm-ui/angular/icon"
import {TagDirective} from "@qualcomm-ui/angular/tag"

describe("Tag", () => {
  test("renders its content as the tag label", async () => {
    @Component({
      imports: [TagDirective],
      template: `
        <span q-tag>Label</span>
      `,
    })
    class TagComponent {}

    await render(TagComponent)

    await expect.element(page.getByText("Label")).toBeVisible()
  })

  test("does not render any icon when startIcon and endIcon are omitted", async () => {
    @Component({
      imports: [TagDirective],
      template: `
        <span q-tag>Label</span>
      `,
    })
    class TagWithoutIconsComponent {}

    await render(TagWithoutIconsComponent)

    await expect.element(page.getByText("Label")).toBeVisible()
    expect(
      page
        .getByText("Label")
        .element()
        .closest("[q-tag]")
        ?.querySelector("svg"),
    ).toBeNull()
  })

  test("renders startIcon visible alongside the label", async () => {
    @Component({
      imports: [TagDirective],
      providers: [provideIcons({Plus})],
      template: `
        <span q-tag startIcon="Plus">Label</span>
      `,
    })
    class StartIconTagComponent {}

    await render(StartIconTagComponent)

    const tag = page.getByText("Label").element().closest("[q-tag]")
    await expect.element(page.getByText("Label")).toBeVisible()
    expect(tag?.querySelector("svg")).toBeTruthy()
  })

  test("renders endIcon visible alongside the label", async () => {
    @Component({
      imports: [TagDirective],
      providers: [provideIcons({Star})],
      template: `
        <span endIcon="Star" q-tag>Label</span>
      `,
    })
    class EndIconTagComponent {}

    await render(EndIconTagComponent)

    const tag = page.getByText("Label").element().closest("[q-tag]")
    await expect.element(page.getByText("Label")).toBeVisible()
    expect(tag?.querySelector("svg")).toBeTruthy()
  })

  test("ignores endIcon when variant is dismissable and renders a Dismiss button", async () => {
    @Component({
      imports: [EndIconDirective, TagDirective],
      providers: [provideIcons({Star})],
      template: `
        <span q-tag variant="dismissable">
          Label
          <svg data-test-id="tag-end-icon" icon="Star" q-end-icon></svg>
        </span>
      `,
    })
    class DismissableTagComponent {}

    await render(DismissableTagComponent)

    await expect
      .element(page.getByRole("button", {name: "Dismiss"}))
      .toBeVisible()
    await expect
      .element(page.getByTestId("tag-end-icon"))
      .not.toBeInTheDocument()
  })

  test("fires dismiss output when the Dismiss button is clicked on a dismissable tag", async () => {
    const dismissed = vi.fn()

    @Component({
      imports: [TagDirective],
      template: `
        <span q-tag variant="dismissable" (dismiss)="dismissed.emit()">
          Label
        </span>
      `,
    })
    class DismissableTagWithOutputComponent {
      readonly dismissed = output<void>()
    }

    await render(DismissableTagWithOutputComponent, {
      on: {
        dismissed,
      },
    })

    await page.getByRole("button", {name: "Dismiss"}).click()

    await expect.poll(() => dismissed).toHaveBeenCalledTimes(1)
  })

  test("exposes a selectable tag as a button with an accessible name", async () => {
    @Component({
      imports: [TagDirective],
      template: `
        <button q-tag variant="selectable">Label</button>
      `,
    })
    class SelectableTagComponent {}

    await render(SelectableTagComponent)

    await expect
      .element(page.getByRole("button", {name: "Label"}))
      .toBeVisible()
  })

  test("does not expose a default tag as a button", async () => {
    @Component({
      imports: [TagDirective],
      template: `
        <span q-tag>Label</span>
      `,
    })
    class DefaultTagComponent {}

    await render(DefaultTagComponent)

    await expect.element(page.getByText("Label")).toBeVisible()
    await expect
      .element(page.getByRole("button", {name: "Label"}))
      .not.toBeInTheDocument()
  })

  test("composes user click output on a selectable tag", async () => {
    const clicked = vi.fn()

    @Component({
      imports: [TagDirective],
      template: `
        <button q-tag variant="selectable" (click)="clicked.emit()">
          Label
        </button>
      `,
    })
    class SelectableTagWithOutputComponent {
      readonly clicked = output<void>()
    }

    await render(SelectableTagWithOutputComponent, {
      on: {
        clicked,
      },
    })

    await page.getByRole("button", {name: "Label"}).click()

    expect(clicked).toHaveBeenCalledTimes(1)
  })

  test("disables a selectable tag from receiving clicks when disabled", async () => {
    const clicked = vi.fn()

    @Component({
      imports: [TagDirective],
      template: `
        <button disabled q-tag variant="selectable" (click)="clicked.emit()">
          Label
        </button>
      `,
    })
    class DisabledSelectableTagComponent {
      readonly clicked = output<void>()
    }

    await render(DisabledSelectableTagComponent, {
      on: {
        clicked,
      },
    })

    const tag = page.getByRole("button", {name: "Label"})
    await expect.element(tag).toHaveAttribute("aria-disabled", "true")
    await expect.element(tag).toHaveAttribute("tabindex", "-1")
    await expect.element(tag).not.toHaveAttribute("disabled")

    await tag.click({force: true}).catch(() => {})

    expect(clicked).not.toHaveBeenCalled()
  })

  test("exposes the selectable tag's pressed state to assistive tech and toggles it when uncontrolled", async () => {
    @Component({
      imports: [TagDirective],
      template: `
        <button q-tag variant="selectable">Label</button>
      `,
    })
    class UncontrolledSelectableTagComponent {}

    await render(UncontrolledSelectableTagComponent)

    const tag = page.getByRole("button", {name: "Label"})
    await expect.element(tag).toHaveAttribute("aria-pressed", "false")

    await tag.click()
    await expect.element(tag).toHaveAttribute("aria-pressed", "true")

    await tag.click()
    await expect.element(tag).toHaveAttribute("aria-pressed", "false")
  })

  test("starts pressed when defaultSelected is true and toggles from there", async () => {
    @Component({
      imports: [TagDirective],
      template: `
        <button defaultSelected q-tag variant="selectable">Label</button>
      `,
    })
    class DefaultSelectedTagComponent {}

    await render(DefaultSelectedTagComponent)

    const tag = page.getByRole("button", {name: "Label"})
    await expect.element(tag).toHaveAttribute("aria-pressed", "true")

    await tag.click()
    await expect.element(tag).toHaveAttribute("aria-pressed", "false")
  })

  test("emits selectedChange with the next value on each toggle when uncontrolled", async () => {
    const selectedChange = vi.fn()

    @Component({
      imports: [TagDirective],
      template: `
        <button
          q-tag
          variant="selectable"
          (selectedChange)="changed.emit($event)"
        >
          Label
        </button>
      `,
    })
    class SelectedChangeTagComponent {
      readonly changed = output<boolean>()
    }

    await render(SelectedChangeTagComponent, {
      on: {
        changed: selectedChange,
      },
    })

    const tag = page.getByRole("button", {name: "Label"})
    await tag.click()
    await tag.click()

    await expect
      .poll(() => selectedChange.mock.calls)
      .toEqual([[true], [false]])
  })

  test("does not toggle pressed state when controlled, but emits selectedChange", async () => {
    const selectedChange = vi.fn()

    @Component({
      imports: [TagDirective],
      template: `
        <button
          q-tag
          variant="selectable"
          [selected]="false"
          (selectedChange)="changed.emit($event)"
        >
          Label
        </button>
      `,
    })
    class ControlledTagComponent {
      readonly changed = output<boolean>()
    }

    await render(ControlledTagComponent, {
      on: {
        changed: selectedChange,
      },
    })

    const tag = page.getByRole("button", {name: "Label"})
    await tag.click()

    expect(selectedChange).toHaveBeenCalledWith(true)
    await expect.element(tag).toHaveAttribute("aria-pressed", "false")
  })

  test("reflects parent-driven changes to selected via two-way binding", async () => {
    @Component({
      imports: [TagDirective],
      template: `
        <button q-tag variant="selectable" [(selected)]="selected">
          Label
        </button>
      `,
    })
    class TwoWayBoundTagComponent {
      readonly selected = signal(false)
    }

    await render(TwoWayBoundTagComponent)

    const tag = page.getByRole("button", {name: "Label"})
    await expect.element(tag).toHaveAttribute("aria-pressed", "false")

    await tag.click()
    await expect.element(tag).toHaveAttribute("aria-pressed", "true")

    await tag.click()
    await expect.element(tag).toHaveAttribute("aria-pressed", "false")
  })

  test("does not expose pressed state on non-selectable variants", async () => {
    @Component({
      imports: [TagDirective],
      template: `
        <button q-tag variant="link" [selected]="true">Label</button>
      `,
    })
    class SelectedLinkTagComponent {}

    await render(SelectedLinkTagComponent)

    await expect
      .element(page.getByRole("button", {name: "Label"}))
      .not.toHaveAttribute("aria-pressed")
  })

  test("disables the Dismiss button on a disabled dismissable tag", async () => {
    const dismissed = vi.fn()

    @Component({
      imports: [TagDirective],
      template: `
        <span disabled q-tag variant="dismissable" (dismiss)="dismissed.emit()">
          Label
        </span>
      `,
    })
    class DisabledDismissableTagComponent {
      readonly dismissed = output<void>()
    }

    await render(DisabledDismissableTagComponent, {
      on: {
        dismissed,
      },
    })

    const dismissButton = page.getByRole("button", {name: "Dismiss"})
    await expect.element(dismissButton).toBeDisabled()

    await dismissButton.click({force: true}).catch(() => {})

    expect(dismissed).not.toHaveBeenCalled()
  })

  test("exposes an anchor tag as a link with an accessible name", async () => {
    @Component({
      imports: [TagDirective],
      template: `
        <a href="/blog/ai" q-tag>Label</a>
      `,
    })
    class AnchorTagComponent {}

    await render(AnchorTagComponent)

    await expect.element(page.getByRole("link", {name: "Label"})).toBeVisible()
  })

  test("does not expose an anchor tag as a button", async () => {
    @Component({
      imports: [TagDirective],
      template: `
        <a href="/blog/ai" q-tag>Label</a>
      `,
    })
    class AnchorTagNotButtonComponent {}

    await render(AnchorTagNotButtonComponent)

    await expect
      .element(page.getByRole("button", {name: "Label"}))
      .not.toBeInTheDocument()
  })

  test("marks a disabled anchor tag inert via aria-disabled and tabindex and strips the invalid disabled attribute", async () => {
    @Component({
      imports: [TagDirective],
      template: `
        <a disabled href="/blog/ai" q-tag>Label</a>
      `,
    })
    class DisabledAnchorTagComponent {}

    await render(DisabledAnchorTagComponent)

    const link = page.getByRole("link", {name: "Label"})
    await expect.element(link).toHaveAttribute("aria-disabled", "true")
    await expect.element(link).toHaveAttribute("tabindex", "-1")
    await expect.element(link).not.toHaveAttribute("disabled")
  })

  test("does not set aria-disabled or tabindex on an enabled anchor tag", async () => {
    @Component({
      imports: [TagDirective],
      template: `
        <a href="/blog/ai" q-tag>Label</a>
      `,
    })
    class EnabledAnchorTagComponent {}

    await render(EnabledAnchorTagComponent)

    const link = page.getByRole("link", {name: "Label"})
    await expect.element(link).not.toHaveAttribute("aria-disabled")
    await expect.element(link).not.toHaveAttribute("tabindex")
  })
})
