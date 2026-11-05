import {useState} from "react"

import {describe, expect, test, vi} from "vitest"
import {render} from "vitest-browser-react"
import {page, userEvent} from "vitest/browser"

import {Accordion} from "@qualcomm-ui/react/accordion"

import {items, TestAccordion, testIds} from "./test-accordion"

describe("Accordion", () => {
  const triggerA = page.getByTestId(testIds.accordionTrigger + items[0].value)
  const contentA = page.getByTestId(testIds.accordionContent + items[0].value)
  const triggerB = page.getByTestId(testIds.accordionTrigger + items[1].value)
  const contentB = page.getByTestId(testIds.accordionContent + items[1].value)
  const triggerC = page.getByTestId(testIds.accordionTrigger + items[2].value)
  const contentC = page.getByTestId(testIds.accordionContent + items[2].value)

  test("renders all items closed by default", async () => {
    await render(<TestAccordion />)
    for (let i = 0; i < items.length; i++) {
      await expect
        .element(page.getByTestId(testIds.accordionItem + items[i].value))
        .toBeVisible()
      await expect.element(page.getByText(items[i].title)).toBeVisible()
      await expect
        .element(page.getByTestId(testIds.accordionContent + items[i].value))
        .not.toBeVisible()
    }
  })

  test("Item renders indicator and secondary text", async () => {
    await render(
      <Accordion.Root>
        <Accordion.Item
          contentProps={{"data-test-id": "accordion-item-content"}}
          indicatorProps={{
            "data-test-id": "accordion-item-indicator",
            icon: <span>Toggle</span>,
          }}
          secondaryText="Updated yesterday"
          text="Account details"
          value="account-details"
        >
          Account content
        </Accordion.Item>
      </Accordion.Root>,
    )

    const trigger = page.getByRole("button", {name: /Account details/})
    const indicator = page.getByTestId("accordion-item-indicator")
    const content = page.getByTestId("accordion-item-content")

    await expect.element(page.getByText("Updated yesterday")).toBeVisible()
    await expect.element(page.getByText("Toggle")).toBeVisible()
    await expect.element(indicator).toHaveAttribute("data-state", "closed")
    await expect.element(content).not.toBeVisible()

    await trigger.click()

    await expect.element(indicator).toHaveAttribute("data-state", "open")
    await expect.element(content).toBeVisible()
  })

  test("single mode (default) should allow only open one item at a time", async () => {
    await render(<TestAccordion />)
    await triggerA.click()
    await expect.element(contentA).toBeVisible()
    await triggerB.click()
    await expect.element(contentA).not.toBeVisible()
    await expect.element(contentB).toBeVisible()
  })

  test("single mode (default) should not allow closing an open item", async () => {
    await render(<TestAccordion />)
    await expect.element(contentA).not.toBeVisible()
    await triggerA.click()
    await expect.element(contentA).toBeVisible()
    await triggerA.click()
    await expect.element(contentA).toBeVisible()
  })

  test("`collapsible` should allow closing an open item in single mode", async () => {
    await render(<TestAccordion collapsible />)
    await expect.element(contentA).not.toBeVisible()
    await triggerA.click()
    await expect.element(contentA).toBeVisible()
    await triggerA.click()
    await expect.element(contentA).not.toBeVisible()
  })

  test("`multiple` should allow multiple items to be open", async () => {
    await render(<TestAccordion multiple />)
    await triggerA.click()
    await triggerB.click()
    await expect.element(contentA).toBeVisible()
    await expect.element(contentB).toBeVisible()
  })

  test("`defaultValue` should open the correct items", async () => {
    await render(<TestAccordion defaultValue={[items[1].value]} />)
    await expect.element(contentB).toBeVisible()
  })

  test("`disabled` should prevent opening any item", async () => {
    await render(<TestAccordion disabled />)
    await expect.element(triggerA).toBeDisabled()
    await expect.element(triggerA).toHaveAttribute("aria-disabled", "true")
    await expect.element(contentA).not.toBeVisible()
    await expect.element(triggerB).toBeDisabled()
    await expect.element(triggerB).toHaveAttribute("aria-disabled", "true")
    await expect.element(contentB).not.toBeVisible()
    await expect.element(triggerC).toBeDisabled()
    await expect.element(triggerC).toHaveAttribute("aria-disabled", "true")
    await expect.element(contentC).not.toBeVisible()
  })

  test("items should have the proper aria attributes", async () => {
    await render(<TestAccordion />)
    const ids = {
      contentA: contentA.element().getAttribute("id"),
      triggerA: triggerA.element().getAttribute("id"),
    }
    await triggerA.click()
    await expect.element(triggerA).toHaveAttribute("aria-expanded", "true")
    await expect.element(contentA).toHaveAttribute("role", "region")
    await expect
      .element(triggerA)
      .toHaveAttribute("aria-controls", ids.contentA)
    await expect
      .element(contentA)
      .toHaveAttribute("aria-labelledby", ids.triggerA)
  })

  test("`onValueChange` should be called when value changes (single mode)", async () => {
    const onValueChange = vi.fn()
    await render(<TestAccordion onValueChange={onValueChange} />)
    await triggerA.click()
    expect(onValueChange).toHaveBeenCalledWith([items[0].value])
    await triggerC.click()
    expect(onValueChange).toHaveBeenCalledWith([items[2].value])
  })

  test("`onValueChange` should be called when value changes (multiple mode)", async () => {
    const onValueChange = vi.fn()
    await render(<TestAccordion multiple onValueChange={onValueChange} />)
    await triggerA.click()
    expect(onValueChange).toHaveBeenCalledWith([items[0].value])
    await triggerC.click()
    expect(onValueChange).toHaveBeenCalledWith([items[0].value, items[2].value])
  })

  test("`onFocusChange` should be called when focus changes", async () => {
    const onFocusChange = vi.fn()
    await render(<TestAccordion onFocusChange={onFocusChange} />)
    await userEvent.tab()
    expect(onFocusChange).toHaveBeenCalledWith(items[0].value)
    await triggerC.click()
    expect(onFocusChange).toHaveBeenCalledWith(items[2].value)
  })

  test("keyboard navigation", async () => {
    await render(<TestAccordion />)
    await userEvent.tab()
    expect(triggerA).toHaveFocus()
    // next
    await userEvent.keyboard("{ArrowDown}")
    expect(triggerB).toHaveFocus()
    await userEvent.keyboard("{ArrowRight}")
    expect(triggerC).toHaveFocus()
    // previous
    await userEvent.keyboard("{ArrowUp}")
    expect(triggerB).toHaveFocus()
    await userEvent.keyboard("{ArrowLeft}")
    expect(triggerA).toHaveFocus()
    // end/home
    await userEvent.keyboard("{End}")
    expect(triggerC).toHaveFocus()
    await userEvent.keyboard("{Home}")
    expect(triggerA).toHaveFocus()
    // wrap around
    await userEvent.keyboard("{ArrowUp}")
    expect(triggerC).toHaveFocus()
    await userEvent.keyboard("{ArrowDown}")
    expect(triggerA).toHaveFocus()
  })

  test("controlled value state (single mode)", async () => {
    function Component() {
      const [value, setValue] = useState<string[]>([])
      return <TestAccordion onValueChange={setValue} value={value} />
    }
    await render(<Component />)
    await expect.element(contentA).not.toBeVisible()
    await triggerA.click()
    await expect.element(contentA).toBeVisible()
    await triggerB.click()
    await expect.element(contentA).not.toBeVisible()
    await expect.element(contentB).toBeVisible()
  })

  test("controlled value state (multiple mode)", async () => {
    function Component() {
      const [value, setValue] = useState<string[]>([])
      return <TestAccordion multiple onValueChange={setValue} value={value} />
    }
    await render(<Component />)
    await expect.element(contentA).not.toBeVisible()
    await triggerA.click()
    await expect.element(contentA).toBeVisible()
    await triggerC.click()
    await expect.element(contentA).toBeVisible()
    await expect.element(contentC).toBeVisible()
  })

  test("`disabled` on a single item prevents it from opening without affecting others", async () => {
    await render(<TestAccordion disabledValues={[items[1].value]} />)
    await expect.element(triggerB).toBeDisabled()
    await expect.element(contentB).not.toBeVisible()
    // sibling items remain interactive
    await expect.element(triggerA).not.toBeDisabled()
    await triggerA.click()
    await expect.element(contentA).toBeVisible()
    await expect.element(contentB).not.toBeVisible()
    await expect.element(triggerC).not.toBeDisabled()
    await triggerC.click()
    await expect.element(contentC).toBeVisible()
    await expect.element(contentB).not.toBeVisible()
  })

  test("`defaultValue` with multiple values in multiple mode expands all specified items", async () => {
    await render(
      <TestAccordion
        defaultValue={[items[0].value, items[2].value]}
        multiple
      />,
    )
    await expect.element(contentA).toBeVisible()
    await expect.element(contentB).not.toBeVisible()
    await expect.element(contentC).toBeVisible()
  })

  test("`collapsible` fires `onValueChange` with an empty array when closing the open item", async () => {
    const onValueChange = vi.fn()
    await render(<TestAccordion collapsible onValueChange={onValueChange} />)
    await triggerA.click()
    expect(onValueChange).toHaveBeenLastCalledWith([items[0].value])
    await triggerA.click()
    expect(onValueChange).toHaveBeenLastCalledWith([])
  })
})
