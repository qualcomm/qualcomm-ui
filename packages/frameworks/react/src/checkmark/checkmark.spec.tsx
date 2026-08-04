import {describe, expect, test} from "vitest"
import {render} from "vitest-browser-react"
import {page} from "vitest/browser"

import {
  Checkmark,
  CheckmarkCheckedIcon,
  CheckmarkIcon,
  CheckmarkIndeterminateIcon,
} from "@qualcomm-ui/react/checkmark"

const rootTestId = "checkmark-root"
const iconTestId = "checkmark-icon"

describe("Checkmark", () => {
  test("renders when neither checked nor indeterminate", async () => {
    await render(<Checkmark data-test-id={rootTestId} />)

    await expect.element(page.getByTestId(rootTestId)).toBeVisible()
  })

  test("renders when checked", async () => {
    await render(<Checkmark checked data-test-id={rootTestId} />)

    await expect.element(page.getByTestId(rootTestId)).toBeVisible()
  })

  test("renders when indeterminate", async () => {
    await render(<Checkmark data-test-id={rootTestId} indeterminate />)

    await expect.element(page.getByTestId(rootTestId)).toBeVisible()
  })

  test("renders when checked and indeterminate are both set", async () => {
    await render(<Checkmark checked data-test-id={rootTestId} indeterminate />)

    await expect.element(page.getByTestId(rootTestId)).toBeVisible()
  })
})

describe("CheckmarkCheckedIcon", () => {
  test("renders a visible icon at each supported size", async () => {
    for (const size of ["sm", "md", "lg"] as const) {
      const {unmount} = await render(
        <CheckmarkCheckedIcon data-test-id={iconTestId} size={size} />,
      )
      await expect.element(page.getByTestId(iconTestId)).toBeVisible()
      unmount()
    }
  })

  test("forwards aria-label to the rendered icon", async () => {
    await render(<CheckmarkCheckedIcon aria-label="Checked" role="img" />)

    await expect.element(page.getByRole("img", {name: "Checked"})).toBeVisible()
  })
})

describe("CheckmarkIndeterminateIcon", () => {
  test("renders a visible icon at each supported size", async () => {
    for (const size of ["sm", "md", "lg"] as const) {
      const {unmount} = await render(
        <CheckmarkIndeterminateIcon data-test-id={iconTestId} size={size} />,
      )
      await expect.element(page.getByTestId(iconTestId)).toBeVisible()
      unmount()
    }
  })

  test("forwards aria-label to the rendered icon", async () => {
    await render(
      <CheckmarkIndeterminateIcon aria-label="Indeterminate" role="img" />,
    )

    await expect
      .element(page.getByRole("img", {name: "Indeterminate"}))
      .toBeVisible()
  })
})

describe("CheckmarkIcon", () => {
  test("renders a visible icon when indeterminate is false", async () => {
    await render(
      <CheckmarkIcon data-test-id={iconTestId} indeterminate={false} />,
    )
    await expect.element(page.getByTestId(iconTestId)).toBeVisible()
  })

  test("renders a visible icon when indeterminate is true", async () => {
    await render(<CheckmarkIcon data-test-id={iconTestId} indeterminate />)
    await expect.element(page.getByTestId(iconTestId)).toBeVisible()
  })
})
