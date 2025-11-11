import {Component} from "@angular/core"
import {render} from "@testing-library/angular"
import {page} from "@vitest/browser/context"
import {describe, expect, test} from "vitest"

import {DividerDirective} from "@qualcomm-ui/angular/divider"

describe("Divider", () => {
  test("should take up the full width of its parent container when horizontal", async () => {
    @Component({
      imports: [DividerDirective],
      template: `
        <div style="height: 100px; width: 100px"><div q-divider></div></div>
      `,
    })
    class TestComponent {}

    await render(TestComponent)

    await expect
      .element(page.getByRole("separator"))
      .toHaveStyle({width: "100px"})
  })

  test("should take up the full height of its parent container when vertical", async () => {
    @Component({
      imports: [DividerDirective],
      template: `
        <div style="height: 100px; width: 100px">
          <div orientation="vertical" q-divider></div>
        </div>
      `,
    })
    class TestComponent {}

    await render(TestComponent)
    await expect
      .element(page.getByRole("separator"))
      .toHaveStyle({height: "100px"})
  })
})
