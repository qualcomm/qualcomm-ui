import {useState} from "react"

import {describe, expect, test, vi} from "vitest"
import {render} from "vitest-browser-react"
import {page} from "vitest/browser"

// @ts-expect-error vitest understands this import
import imgURL from "./avatar-man.png"
import {TestAvatar, testIds} from "./test-avatar"

describe("Avatar", () => {
  test("Content should not be displayed if an image is loaded", async () => {
    await render(<TestAvatar src={imgURL} />)
    await expect.element(page.getByTestId(testIds.avatarImage)).toBeVisible()
    await expect
      .element(page.getByTestId(testIds.avatarContent))
      .not.toBeVisible()
  })

  test("Content should be displayed if an image can't be loaded", async () => {
    await render(<TestAvatar src="http://example.invalid" />)
    await expect
      .element(page.getByTestId(testIds.avatarImage))
      .not.toBeVisible()
    await expect.element(page.getByTestId(testIds.avatarContent)).toBeVisible()
  })

  test("`onStateChange` fires with `loaded` when image loads", async () => {
    const onStateChange = vi.fn()
    await render(<TestAvatar onStateChange={onStateChange} src={imgURL} />)
    await expect.element(page.getByTestId(testIds.avatarImage)).toBeVisible()
    await expect
      .poll(() => onStateChange)
      .toHaveBeenCalledWith({state: "loaded"})
  })

  test("`onStateChange` fires with `error` when image fails to load", async () => {
    const onStateChange = vi.fn()
    await render(
      <TestAvatar onStateChange={onStateChange} src="http://example.invalid" />,
    )
    await expect.element(page.getByTestId(testIds.avatarContent)).toBeVisible()
    await expect
      .poll(() => onStateChange)
      .toHaveBeenCalledWith({state: "error"})
  })

  test("Changing `src` from valid to invalid swaps image for fallback", async () => {
    function Wrapper() {
      const [src, setSrc] = useState<string>(imgURL)
      return (
        <>
          <button
            data-test-id="change-src"
            onClick={() => setSrc("http://example.invalid")}
            type="button"
          >
            Break image
          </button>
          <TestAvatar src={src} />
        </>
      )
    }

    await render(<Wrapper />)
    await expect.element(page.getByTestId(testIds.avatarImage)).toBeVisible()
    await expect
      .element(page.getByTestId(testIds.avatarContent))
      .not.toBeVisible()

    await page.getByTestId("change-src").click()

    await expect
      .element(page.getByTestId(testIds.avatarImage))
      .not.toBeVisible()
    await expect.element(page.getByTestId(testIds.avatarContent)).toBeVisible()
  })
})
