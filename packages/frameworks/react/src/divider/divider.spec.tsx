import {describe, expect, test} from "vitest"
import {page} from "vitest/browser"
import {render} from "vitest-browser-react"

import {Divider} from "@qualcomm-ui/react/divider"

describe("Divider", () => {
  test("should take up the full width of its parent container when horizontal", async () => {
    await render(
      <div style={{height: 100, width: 100}}>
        <Divider />
      </div>,
    )

    const divider = page.getByRole("separator")
    await expect.element(divider).toHaveStyle({width: "100px"})
  })

  test("should take up the full height of its parent container when vertical", async () => {
    await render(
      <div style={{height: 100, maxHeight: 100}}>
        <Divider aria-orientation="vertical" />
      </div>,
    )

    const divider = page.getByRole("separator")
    await expect.element(divider).toHaveStyle({height: "100px"})
  })
})
