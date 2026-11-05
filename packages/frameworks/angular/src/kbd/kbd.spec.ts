import {Component} from "@angular/core"
import {render} from "@testing-library/angular"
import {describe, expect, test} from "vitest"
import {page} from "vitest/browser"

import {KbdDirective} from "@qualcomm-ui/angular/kbd"

describe("Kbd", () => {
  test("renders keyboard shortcut content with kbd bindings", async () => {
    @Component({
      imports: [KbdDirective],
      template: `
        <kbd q-kbd>Ctrl+K</kbd>
      `,
    })
    class KbdComponent {}

    await render(KbdComponent)

    const kbd = page.getByText("Ctrl+K")
    await expect.element(kbd).toBeVisible()
  })
})
