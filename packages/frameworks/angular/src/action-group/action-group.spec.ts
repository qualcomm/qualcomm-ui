import {Component} from "@angular/core"
import {render} from "@testing-library/angular"
import {describe, expect, test} from "vitest"
import {page} from "vitest/browser"

import {ActionGroupDirective} from "@qualcomm-ui/angular/action-group"

@Component({
  imports: [ActionGroupDirective],
  template: `
    <div q-action-group>
      <button type="button">First</button>
      <button type="button">Second</button>
    </div>
  `,
})
class ActionGroupComponent {}

describe("ActionGroup", () => {
  test("renders its children", async () => {
    await render(ActionGroupComponent)

    await expect
      .element(page.getByRole("button", {name: "First"}))
      .toBeVisible()
    await expect
      .element(page.getByRole("button", {name: "Second"}))
      .toBeVisible()
  })
})
