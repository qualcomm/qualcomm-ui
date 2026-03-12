import {Component, output, signal} from "@angular/core"
import {render} from "@testing-library/angular"
import {Plus, Star} from "lucide-angular"
import {describe, expect, test, vi} from "vitest"
import {page} from "vitest/browser"

import {provideIcons} from "@qualcomm-ui/angular-core/lucide"

import {TagDirective} from "./tag.directive"

describe("Tag", () => {
  describe("rendering", () => {
    test("renders children text", async () => {
      @Component({
        imports: [TagDirective],
        template: `
          <button q-tag>Hello</button>
        `,
      })
      class TestComponent {}

      await render(TestComponent)
      await expect.element(page.getByText("Hello")).toBeVisible()
    })

    test("link variant renders as button", async () => {
      @Component({
        imports: [TagDirective],
        template: `
          <button q-tag variant="link">Link</button>
        `,
      })
      class TestComponent {}

      await render(TestComponent)
      await expect
        .element(page.getByRole("button", {name: "Link"}))
        .toBeVisible()
    })
  })

  describe("selectable variant", () => {
    test("click toggles selection", async () => {
      const spy = vi.fn()

      @Component({
        imports: [TagDirective],
        template: `
          <button
            q-tag
            variant="selectable"
            (selectedChanged)="changed.emit($event)"
          >
            Toggle
          </button>
        `,
      })
      class TestComponent {
        changed = output<boolean | undefined>()
      }

      await render(TestComponent, {
        on: {changed: (val) => spy(val)},
      })

      await page.getByRole("button", {name: "Toggle"}).click()
      await expect.poll(() => spy).toHaveBeenCalledWith(true)

      await page.getByRole("button", {name: "Toggle"}).click()
      await expect.poll(() => spy).toHaveBeenCalledWith(false)
    })

    test("defaultSelected starts selected", async () => {
      const spy = vi.fn()

      @Component({
        imports: [TagDirective],
        template: `
          <button
            defaultSelected
            q-tag
            variant="selectable"
            (selectedChanged)="changed.emit($event)"
          >
            Default
          </button>
        `,
      })
      class TestComponent {
        changed = output<boolean | undefined>()
      }

      await render(TestComponent, {
        on: {changed: (val) => spy(val)},
      })

      await page.getByRole("button", {name: "Default"}).click()
      await expect.poll(() => spy).toHaveBeenCalledWith(false)
    })

    test("controlled state - initially selected", async () => {
      @Component({
        imports: [TagDirective],
        template: `
          <button
            q-tag
            variant="selectable"
            [selected]="selected()"
            (selectedChanged)="selected.set(!!$event)"
          >
            Controlled
          </button>
        `,
      })
      class TestComponent {
        readonly selected = signal(true)
      }

      await render(TestComponent)
      const button = page.getByRole("button", {name: "Controlled"})

      await expect.element(button).toHaveAttribute("data-selected")
      await button.click()
      await expect.element(button).not.toHaveAttribute("data-selected")
      await button.click()
      await expect.element(button).toHaveAttribute("data-selected")
    })

    test("controlled state - initially unselected", async () => {
      @Component({
        imports: [TagDirective],
        template: `
          <button
            q-tag
            variant="selectable"
            [selected]="selected()"
            (selectedChanged)="selected.set(!!$event)"
          >
            Controlled
          </button>
        `,
      })
      class TestComponent {
        readonly selected = signal(false)
      }

      await render(TestComponent)
      const button = page.getByRole("button", {name: "Controlled"})

      await expect.element(button).not.toHaveAttribute("data-selected")
      await button.click()
      await expect.element(button).toHaveAttribute("data-selected")
      await button.click()
      await expect.element(button).not.toHaveAttribute("data-selected")
    })
  })

  describe("dismissable variant", () => {
    test("clicking dismiss fires dismiss", async () => {
      const spy = vi.fn()

      @Component({
        imports: [TagDirective],
        template: `
          <span q-tag variant="dismissable" (dismiss)="dismissed.emit()">
            Dismiss Me
          </span>
        `,
      })
      class TestComponent {
        dismissed = output<void>()
      }

      await render(TestComponent, {
        on: {dismissed: () => spy()},
      })

      await page.getByRole("button", {name: "Dismiss"}).click()
      await expect.poll(() => spy).toHaveBeenCalled()
    })

    test("dismissed state after clicking dismiss", async () => {
      @Component({
        imports: [TagDirective],
        template: `
          <span data-test-id="tag-root" q-tag variant="dismissable">
            Dismiss Me
          </span>
        `,
      })
      class TestComponent {}

      await render(TestComponent)

      const root = page.getByTestId("tag-root")
      await expect.element(root).not.toHaveAttribute("data-dismissed")

      await page.getByRole("button", {name: "Dismiss"}).click()
      await expect.element(root).toHaveAttribute("data-dismissed")
    })
  })

  describe("disabled state", () => {
    test("disabled link variant", async () => {
      @Component({
        imports: [TagDirective],
        template: `
          <button disabled q-tag variant="link">Disabled</button>
        `,
      })
      class TestComponent {}

      await render(TestComponent)
      await expect
        .element(page.getByRole("button", {name: "Disabled"}))
        .toBeDisabled()
    })

    test("disabled prevents selection toggle", async () => {
      const spy = vi.fn()

      @Component({
        imports: [TagDirective],
        template: `
          <button
            disabled
            q-tag
            variant="selectable"
            (selectedChanged)="changed.emit($event)"
          >
            Disabled Select
          </button>
        `,
      })
      class TestComponent {
        changed = output<boolean | undefined>()
      }

      await render(TestComponent, {
        on: {changed: (val) => spy(val)},
      })

      await page
        .getByRole("button", {name: "Disabled Select"})
        .click({force: true})
      expect(spy).not.toHaveBeenCalled()
    })

    test("disabled prevents dismiss", async () => {
      const spy = vi.fn()

      @Component({
        imports: [TagDirective],
        template: `
          <span
            data-test-id="tag-root"
            disabled
            q-tag
            variant="dismissable"
            (dismiss)="dismissed.emit()"
          >
            Disabled Dismiss
          </span>
        `,
      })
      class TestComponent {
        dismissed = output<void>()
      }

      await render(TestComponent, {
        on: {dismissed: () => spy()},
      })

      await page.getByRole("button", {name: "Dismiss"}).click({force: true})
      expect(spy).not.toHaveBeenCalled()

      await expect
        .element(page.getByTestId("tag-root"))
        .not.toHaveAttribute("data-dismissed")
    })
  })

  describe("icons", () => {
    test("startIcon renders", async () => {
      @Component({
        imports: [TagDirective],
        providers: [provideIcons({Plus})],
        template: `
          <button q-tag startIcon="Plus" variant="selectable">
            With Start Icon
          </button>
        `,
      })
      class TestComponent {}

      await render(TestComponent)

      await expect
        .element(page.getByRole("button", {name: "With Start Icon"}))
        .toBeVisible()
      await expect.element(page.getByTestId("qui-icon").first()).toBeVisible()
    })

    test("endIcon renders on non-dismissable", async () => {
      @Component({
        imports: [TagDirective],
        providers: [provideIcons({Star})],
        template: `
          <button endIcon="Star" q-tag variant="selectable">
            With End Icon
          </button>
        `,
      })
      class TestComponent {}

      await render(TestComponent)

      await expect
        .element(page.getByRole("button", {name: "With End Icon"}))
        .toBeVisible()
      await expect.element(page.getByTestId("qui-icon").first()).toBeVisible()
    })

    test("endIcon is ignored for dismissable variant", async () => {
      @Component({
        imports: [TagDirective],
        providers: [provideIcons({Star})],
        template: `
          <span endIcon="Star" q-tag variant="dismissable">Dismiss Only</span>
        `,
      })
      class TestComponent {}

      await render(TestComponent)

      await expect
        .element(page.getByRole("button", {name: "Dismiss"}))
        .toBeVisible()

      const icons = page.getByTestId("qui-icon")
      await expect.element(icons.first()).toBeVisible()
      expect(icons.all()).toHaveLength(1)
    })
  })
})
