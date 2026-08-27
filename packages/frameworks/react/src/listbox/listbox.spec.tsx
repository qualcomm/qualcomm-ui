import {describe, expect, test} from "vitest"
import {render} from "vitest-browser-react"
import {page} from "vitest/browser"

import {listboxCollection} from "@qualcomm-ui/core/listbox"
import {Listbox} from "@qualcomm-ui/react/listbox"

const items = ["Option 1", "Option 2"]
const collection = listboxCollection({items})

describe("Listbox", () => {
  test("renders QDS listbox parts and selects an option", async () => {
    await render(
      <Listbox.Root collection={collection} data-test-id="root" size="lg">
        <Listbox.Label data-test-id="label">Choose an option</Listbox.Label>
        <Listbox.Content data-test-id="content">
          {items.map((item) => (
            <Listbox.Item key={item} item={item}>
              <Listbox.ItemLabel>{item}</Listbox.ItemLabel>
              <Listbox.ItemSecondaryText>
                Secondary text
              </Listbox.ItemSecondaryText>
            </Listbox.Item>
          ))}
        </Listbox.Content>
      </Listbox.Root>,
    )

    const option = page.getByRole("option", {name: "Option 1"})

    await expect
      .element(page.getByTestId("root"))
      .toHaveAttribute("data-size", "lg")
    await expect
      .element(page.getByTestId("label"))
      .toHaveAttribute("data-size", "lg")
    await expect
      .element(page.getByTestId("content"))
      .toHaveAttribute("role", "listbox")
    await expect.element(option).toHaveAttribute("data-size", "lg")
    await expect.element(option).toHaveTextContent("Option 1")
    await expect
      .element(page.getByText("Secondary text").first())
      .toHaveClass("qui-list-item__secondary-text")

    await option.click()

    await expect.element(option).toHaveAttribute("aria-selected", "true")
  })
})
