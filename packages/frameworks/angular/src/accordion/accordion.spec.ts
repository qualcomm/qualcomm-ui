import {Component, input, output, signal} from "@angular/core"
import {render} from "@testing-library/angular"
import {describe, expect, test, vi} from "vitest"
import {page, userEvent} from "vitest/browser"

import {AccordionModule} from "@qualcomm-ui/angular/accordion"

const LoremIpsum =
  "Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor"

const items = [
  {
    content: LoremIpsum,
    secondary: "Secondary text 1",
    title: "Accordion Header 1",
    value: "a",
  },
  {
    content: LoremIpsum,
    secondary: "Secondary text 2",
    title: "Accordion Header 2",
    value: "b",
  },
  {
    content: LoremIpsum,
    secondary: "Secondary text 3",
    title: "Accordion Header 3",
    value: "c",
  },
]

const testIds = {
  accordionContent: "accordion-content-",
  accordionIndicator: "accordion-indicator-",
  accordionItem: "accordion-item-",
  accordionRoot: "accordion-root",
  accordionTrigger: "accordion-trigger-",
} as const

@Component({
  imports: [AccordionModule],
  standalone: true,
  template: `
    <div
      q-accordion
      [attr.data-test-id]="testIds.accordionRoot"
      [collapsible]="collapsible()"
      [defaultValue]="defaultValue()"
      [disabled]="disabled()"
      [multiple]="multiple()"
      [value]="value()"
      (focusChanged)="focusChanged.emit($event)"
      (valueChanged)="valueChanged.emit($event)"
    >
      @for (item of items; track item.value) {
        <div
          q-accordion-item-root
          [attr.data-test-id]="testIds.accordionItem + item.value"
          [disabled]="disabledValues().includes(item.value)"
          [value]="item.value"
        >
          <button
            q-accordion-item-trigger
            [attr.data-test-id]="testIds.accordionTrigger + item.value"
          >
            {{ item.title }}
            <span q-accordion-item-secondary-text>{{ item.secondary }}</span>
            <q-accordion-item-indicator
              [attr.data-test-id]="testIds.accordionIndicator + item.value"
            />
          </button>
          <div
            q-accordion-item-content
            [attr.data-test-id]="testIds.accordionContent + item.value"
          >
            {{ item.content }}
          </div>
        </div>
      }
    </div>
  `,
})
class TestAccordionComponent {
  readonly items = items
  readonly testIds = testIds
  readonly collapsible = input(false)
  readonly multiple = input(false)
  readonly defaultValue = input<string[]>([])
  readonly disabled = input(false)
  readonly disabledValues = input<string[]>([])
  readonly value = input<string[] | undefined>()
  readonly valueChanged = output<string[]>()
  readonly focusChanged = output<string | null>()
}

@Component({
  imports: [AccordionModule],
  standalone: true,
  template: `
    <div
      q-accordion
      [multiple]="multiple()"
      [value]="value()"
      (valueChanged)="value.set($event)"
    >
      @for (item of items; track item.value) {
        <div q-accordion-item-root [value]="item.value">
          <button
            q-accordion-item-trigger
            [attr.data-test-id]="testIds.accordionTrigger + item.value"
          >
            {{ item.title }}
          </button>
          <div
            q-accordion-item-content
            [attr.data-test-id]="testIds.accordionContent + item.value"
          >
            {{ item.content }}
          </div>
        </div>
      }
    </div>
  `,
})
class ControlledAccordionComponent {
  readonly items = items
  readonly testIds = testIds
  readonly multiple = input(false)
  readonly value = signal<string[]>([])
}

describe("accordion", () => {
  const triggerA = () =>
    page.getByTestId(testIds.accordionTrigger + items[0].value)
  const triggerB = () =>
    page.getByTestId(testIds.accordionTrigger + items[1].value)
  const triggerC = () =>
    page.getByTestId(testIds.accordionTrigger + items[2].value)
  const contentA = () =>
    page.getByTestId(testIds.accordionContent + items[0].value)
  const contentB = () =>
    page.getByTestId(testIds.accordionContent + items[1].value)
  const contentC = () =>
    page.getByTestId(testIds.accordionContent + items[2].value)
  const indicatorA = () =>
    page.getByTestId(testIds.accordionIndicator + items[0].value)

  test("renders all items closed by default", async () => {
    await render(TestAccordionComponent)
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

  test("item renders indicator and secondary text state", async () => {
    await render(TestAccordionComponent)

    await expect.element(page.getByText(items[0].secondary)).toBeVisible()
    await expect.element(indicatorA()).toHaveAttribute("data-state", "closed")
    await expect.element(contentA()).toHaveAttribute("data-state", "closed")
    await expect.element(contentA()).not.toBeVisible()

    await triggerA().click()

    await expect.element(indicatorA()).toHaveAttribute("data-state", "open")
    await expect.element(contentA()).toHaveAttribute("data-state", "open")
    await expect.element(contentA()).toBeVisible()
  })

  test("single mode (default) should allow only open one item at a time", async () => {
    await render(TestAccordionComponent)
    await userEvent.click(triggerA())
    await expect.element(contentA()).toBeVisible()
    await userEvent.click(triggerB())
    await expect.element(contentA()).not.toBeVisible()
    await expect.element(contentB()).toBeVisible()
  })

  test("single mode (default) should not allow closing an open item", async () => {
    await render(TestAccordionComponent)
    expect(contentA()).not.toBeVisible()
    await triggerA().click()
    await expect.element(contentA()).toBeVisible()
    await triggerA().click()
    await expect.element(contentA()).toBeVisible()
  })

  test("`collapsible` should allow closing an open item in single mode", async () => {
    await render(TestAccordionComponent, {
      inputs: {
        collapsible: true,
      },
    })
    expect(contentA()).not.toBeVisible()
    await triggerA().click()
    await expect.element(contentA()).toBeVisible()
    await triggerA().click()
    await expect.element(contentA()).not.toBeVisible()
  })

  test("`collapsible` should emit an empty value when closing an open item", async () => {
    const valueChangedSpy = vi.fn()
    await render(TestAccordionComponent, {
      inputs: {
        collapsible: true,
      },
      on: {
        valueChanged: (event): void => {
          valueChangedSpy(event)
        },
      },
    })

    await triggerA().click()
    expect(valueChangedSpy).toHaveBeenLastCalledWith([items[0].value])

    await triggerA().click()
    expect(valueChangedSpy).toHaveBeenLastCalledWith([])
  })

  test("`multiple` should allow multiple items to be open", async () => {
    await render(TestAccordionComponent, {
      inputs: {
        multiple: true,
      },
    })
    await triggerA().click()
    await triggerB().click()
    await expect.element(contentA()).toBeVisible()
    await expect.element(contentB()).toBeVisible()
  })

  test("`defaultValue` should open the correct items", async () => {
    await render(TestAccordionComponent, {
      inputs: {
        defaultValue: [items[1].value],
      },
    })
    await expect.element(contentB()).toBeVisible()
  })

  test("`defaultValue` should open multiple items in multiple mode", async () => {
    await render(TestAccordionComponent, {
      inputs: {
        defaultValue: [items[0].value, items[2].value],
        multiple: true,
      },
    })

    await expect.element(contentA()).toBeVisible()
    await expect.element(contentB()).not.toBeVisible()
    await expect.element(contentC()).toBeVisible()
  })

  test("`disabled` should prevent opening any item", async () => {
    await render(TestAccordionComponent, {
      inputs: {
        disabled: true,
      },
    })

    await expect.element(triggerA()).toBeDisabled()
    expect(triggerA()).toHaveAttribute("aria-disabled", "true")
    expect(contentA()).not.toBeVisible()
    expect(triggerB()).toBeDisabled()
    expect(triggerB()).toHaveAttribute("aria-disabled", "true")
    expect(contentB()).not.toBeVisible()
    expect(triggerC()).toBeDisabled()
    expect(triggerC()).toHaveAttribute("aria-disabled", "true")
    expect(contentC()).not.toBeVisible()
  })

  test("`disabled` on an item should prevent opening it without affecting others", async () => {
    await render(TestAccordionComponent, {
      inputs: {
        disabledValues: [items[1].value],
      },
    })

    await expect.element(triggerB()).toBeDisabled()
    await triggerB().click({force: true})
    await expect.element(contentB()).not.toBeVisible()

    await expect.element(triggerA()).not.toBeDisabled()
    await triggerA().click()
    await expect.element(contentA()).toBeVisible()
    await expect.element(contentB()).not.toBeVisible()

    await expect.element(triggerC()).not.toBeDisabled()
    await triggerC().click()
    await expect.element(contentC()).toBeVisible()
    await expect.element(contentB()).not.toBeVisible()
  })

  test("items should have the proper aria attributes", async () => {
    await render(TestAccordionComponent)

    await triggerA().click()
    await expect.element(contentA()).toBeVisible()
    const ids = {
      contentA: contentA().element().getAttribute("id"),
      triggerA: triggerA().element().getAttribute("id"),
    }
    expect(triggerA()).toHaveAttribute("aria-expanded", "true")
    expect(contentA()).toHaveAttribute("role", "region")
    expect(triggerA()).toHaveAttribute("aria-controls", ids.contentA)
    expect(contentA()).toHaveAttribute("aria-labelledby", ids.triggerA)
  })

  test("`valueChanged` should be called when value changes (single mode)", async () => {
    const valueChangedSpy = vi.fn()
    await render(TestAccordionComponent, {
      on: {
        valueChanged: (event: string[]): void => {
          valueChangedSpy(event)
        },
      },
    })
    await triggerA().click()
    await triggerC().click()
    await expect.poll(() => valueChangedSpy).toHaveBeenCalledTimes(2)
    expect(valueChangedSpy.mock.calls[0][0]).toEqual([items[0].value])
    expect(valueChangedSpy.mock.calls[1][0]).toEqual([items[2].value])
  })

  test("`valueChanged` should be called when value changes (multiple mode)", async () => {
    const valueChangedSpy = vi.fn()
    await render(TestAccordionComponent, {
      inputs: {
        multiple: true,
      },
      on: {
        valueChanged: (event): void => {
          valueChangedSpy(event)
        },
      },
    })
    await triggerA().click()
    await triggerC().click()
    expect(valueChangedSpy).toHaveBeenCalledTimes(2)
    expect(valueChangedSpy.mock.calls[0][0]).toEqual([items[0].value])
    expect(valueChangedSpy.mock.calls[1][0]).toEqual([
      items[0].value,
      items[2].value,
    ])
  })

  test("`focusChanged` should be called when focus changes", async () => {
    const focusChangedSpy = vi.fn()
    await render(TestAccordionComponent, {
      on: {
        focusChanged: (event): void => {
          focusChangedSpy(event)
        },
      },
    })
    await userEvent.tab()
    await expect
      .poll(() => focusChangedSpy)
      .toHaveBeenCalledWith(items[0].value)
    await triggerC().click()
    await expect
      .poll(() => focusChangedSpy)
      .toHaveBeenCalledWith(items[2].value)
  })

  test("controlled value state in single mode", async () => {
    await render(ControlledAccordionComponent)

    await expect.element(contentA()).not.toBeVisible()
    await triggerA().click()
    await expect.element(contentA()).toBeVisible()

    await triggerB().click()
    await expect.element(contentA()).not.toBeVisible()
    await expect.element(contentB()).toBeVisible()
  })

  test("controlled value state in multiple mode", async () => {
    await render(ControlledAccordionComponent, {
      inputs: {
        multiple: true,
      },
    })

    await expect.element(contentA()).not.toBeVisible()
    await triggerA().click()
    await expect.element(contentA()).toBeVisible()

    await triggerC().click()
    await expect.element(contentA()).toBeVisible()
    await expect.element(contentC()).toBeVisible()
  })

  test("keyboard navigation", async () => {
    await render(TestAccordionComponent)
    await userEvent.tab()
    expect(triggerA()).toHaveFocus()
    // next
    await userEvent.keyboard("{ArrowDown}")
    expect(triggerB()).toHaveFocus()
    await userEvent.keyboard("{ArrowRight}")
    expect(triggerC()).toHaveFocus()
    // previous
    await userEvent.keyboard("{ArrowUp}")
    expect(triggerB()).toHaveFocus()
    await userEvent.keyboard("{ArrowLeft}")
    expect(triggerA()).toHaveFocus()
    // end/home
    await userEvent.keyboard("{End}")
    expect(triggerC()).toHaveFocus()
    await userEvent.keyboard("{Home}")
    expect(triggerA()).toHaveFocus()
    // wrap around
    await userEvent.keyboard("{ArrowUp}")
    expect(triggerC()).toHaveFocus()
    await userEvent.keyboard("{ArrowDown}")
    expect(triggerA()).toHaveFocus()
  })
})
