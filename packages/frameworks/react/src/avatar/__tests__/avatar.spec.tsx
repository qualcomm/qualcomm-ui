import {page} from "@vitest/browser/context"
import {describe, expect, test} from "vitest"
import {render} from "vitest-browser-react"

// @ts-expect-error vitest understands this import
import imgURL from "./avatar-man.png"
import {TestAvatar, testIds} from "./test-avatar"

describe("Avatar", () => {
  test("Content should not be displayed if an image is loaded", async () => {
    render(<TestAvatar src={imgURL} />)
    await expect.element(page.getByTestId(testIds.avatarImage)).toBeVisible()
    await expect
      .element(page.getByTestId(testIds.avatarContent))
      .not.toBeVisible()
  })

  test("Content should be displayed if an image can't be loaded", async () => {
    render(<TestAvatar src="http://example.invalid" />)
    await expect
      .element(page.getByTestId(testIds.avatarImage))
      .not.toBeVisible()
    await expect.element(page.getByTestId(testIds.avatarContent)).toBeVisible()
  })
})
