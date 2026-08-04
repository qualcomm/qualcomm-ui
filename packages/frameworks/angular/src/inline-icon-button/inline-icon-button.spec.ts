import {Component} from "@angular/core"
import {render} from "@testing-library/angular"
import {describe, expect, test} from "vitest"
import {page} from "vitest/browser"

import {InlineIconButtonComponent} from "@qualcomm-ui/angular/inline-icon-button"

describe("InlineIconButton", () => {
  test("renders as a button with a default icon", async () => {
    @Component({
      imports: [InlineIconButtonComponent],
      template: `
        <button
          aria-label="Dismiss"
          q-inline-icon-button
          type="button"
        ></button>
      `,
    })
    class DefaultInlineIconButtonComponent {}

    await render(DefaultInlineIconButtonComponent)

    const button = page.getByRole("button", {name: "Dismiss"})
    await expect.element(button).toBeVisible()
    expect(button.element().querySelector("svg")).toBeTruthy()
  })
})
