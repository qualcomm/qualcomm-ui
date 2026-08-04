import {describe, expect, test} from "vitest"
import {render} from "vitest-browser-react"
import {page} from "vitest/browser"

import {ActionGroup} from "@qualcomm-ui/react/action-group"

describe("ActionGroup", () => {
  test("renders its children", async () => {
    await render(
      <ActionGroup>
        <button type="button">First</button>
        <button type="button">Second</button>
      </ActionGroup>,
    )

    await expect
      .element(page.getByRole("button", {name: "First"}))
      .toBeVisible()
    await expect
      .element(page.getByRole("button", {name: "Second"}))
      .toBeVisible()
  })

  test("renders children through a user-supplied render prop", async () => {
    await render(
      <ActionGroup render={(props) => <section {...props} />}>
        <button type="button">Action</button>
      </ActionGroup>,
    )

    await expect
      .element(page.getByRole("button", {name: "Action"}))
      .toBeVisible()
  })
})
