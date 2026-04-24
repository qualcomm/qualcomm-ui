import {type ReactNode, useState} from "react"

import {describe, expect, test, vi} from "vitest"
import {page, userEvent} from "vitest/browser"
import {render} from "vitest-browser-react"

import {
  type AccordionApi,
  type AccordionApiProps,
  accordionMachine,
  createAccordionApi,
} from "@qualcomm-ui/core/accordion"
import {useOnDestroy} from "@qualcomm-ui/react-core/effects"
import {useControlledId} from "@qualcomm-ui/react-core/state"

import {normalizeProps} from "./normalize-props"
import {useMachine} from "./use-machine"

function useAccordion(props: AccordionApiProps): AccordionApi {
  const machine = useMachine(accordionMachine, props)
  return createAccordionApi(machine, normalizeProps)
}

function Root({
  api,
  children,
  id,
}: {
  api: AccordionApi
  children: ReactNode
  id?: string
}) {
  const controlledId = useControlledId(id)
  const onDestroy = useOnDestroy()
  return (
    <div {...api.getRootBindings({id: controlledId, onDestroy})}>
      {children}
    </div>
  )
}

function Item({
  api,
  children,
  id,
  value,
}: {
  api: AccordionApi
  children: ReactNode
  id?: string
  value: string
}) {
  const resolvedId = useControlledId(id)
  const onDestroy = useOnDestroy()
  return (
    <section
      {...api.getAccordionItemBindings({id: resolvedId, onDestroy, value})}
    >
      {children}
    </section>
  )
}

function Trigger({
  api,
  id,
  label,
  value,
}: {
  api: AccordionApi
  id?: string
  label: string
  value: string
}) {
  const resolvedId = useControlledId(id)
  const onDestroy = useOnDestroy()
  return (
    <button
      {...api.getAccordionItemTriggerBindings({
        id: resolvedId,
        onDestroy,
        value,
      })}
      aria-label={label}
    >
      {label}
    </button>
  )
}

function Content({
  api,
  children,
  id,
  value,
}: {
  api: AccordionApi
  children: ReactNode
  id?: string
  value: string
}) {
  const resolvedId = useControlledId(id)
  const onDestroy = useOnDestroy()
  return (
    <div
      {...api.getAccordionItemContentBindings({
        id: resolvedId,
        onDestroy,
        value,
      })}
    >
      {children}
    </div>
  )
}

type ItemDef = {content: string; label: string; value: string}

const defaultItems: ItemDef[] = [
  {content: "Panel A body", label: "Item A", value: "a"},
  {content: "Panel B body", label: "Item B", value: "b"},
  {content: "Panel C body", label: "Item C", value: "c"},
]

function TestAccordion({
  items,
  ...props
}: {items: ItemDef[]} & AccordionApiProps) {
  const api = useAccordion(props)
  return (
    <Root api={api}>
      {items.map((item) => (
        <Item key={item.value} api={api} value={item.value}>
          <h3>
            <Trigger api={api} label={item.label} value={item.value} />
          </h3>
          <Content api={api} value={item.value}>
            {item.content}
          </Content>
        </Item>
      ))}
    </Root>
  )
}

function getIds(label: string, content: string) {
  const trigger = page.getByRole("button", {name: label})
  const panel = page.getByText(content)
  return {
    contentId: panel.element().getAttribute("id"),
    triggerId: trigger.element().getAttribute("id"),
  }
}

describe("useBindableIdCollection (accordion integration)", () => {
  test("initial render wires aria-controls and aria-labelledby between trigger and content for every item", async () => {
    await render(<TestAccordion items={defaultItems} />)

    for (const item of defaultItems) {
      const {contentId, triggerId} = getIds(item.label, item.content)

      await expect
        .element(page.getByRole("button", {name: item.label}))
        .toHaveAttribute("aria-controls", contentId!)
      await expect
        .element(page.getByText(item.content))
        .toHaveAttribute("aria-labelledby", triggerId!)
    }
  })

  test("adding an item at runtime registers new ids and wires them correctly", async () => {
    function Host() {
      const [items, setItems] = useState(defaultItems)
      return (
        <>
          <button
            onClick={() =>
              setItems((prev) => [
                ...prev,
                {content: "Panel D body", label: "Item D", value: "d"},
              ])
            }
          >
            add-item
          </button>
          <TestAccordion items={items} />
        </>
      )
    }

    await render(<Host />)

    await expect
      .element(page.getByRole("button", {name: "Item D"}))
      .not.toBeInTheDocument()

    await page.getByRole("button", {name: "add-item"}).click()

    const {contentId, triggerId} = getIds("Item D", "Panel D body")
    await expect
      .element(page.getByRole("button", {name: "Item D"}))
      .toHaveAttribute("aria-controls", contentId!)
    await expect
      .element(page.getByText("Panel D body"))
      .toHaveAttribute("aria-labelledby", triggerId!)
  })

  test("removing an item unregisters its ids without breaking sibling wiring", async () => {
    function Host() {
      const [items, setItems] = useState(defaultItems)
      return (
        <>
          <button
            onClick={() =>
              setItems((prev) => prev.filter((i) => i.value !== "b"))
            }
          >
            drop-b
          </button>
          <TestAccordion items={items} />
        </>
      )
    }

    await render(<Host />)

    await expect
      .element(page.getByRole("button", {name: "Item B"}))
      .toBeInTheDocument()

    await page.getByRole("button", {name: "drop-b"}).click()

    await expect
      .element(page.getByRole("button", {name: "Item B"}))
      .not.toBeInTheDocument()

    for (const item of defaultItems.filter((i) => i.value !== "b")) {
      const {contentId, triggerId} = getIds(item.label, item.content)
      await expect
        .element(page.getByRole("button", {name: item.label}))
        .toHaveAttribute("aria-controls", contentId!)
      await expect
        .element(page.getByText(item.content))
        .toHaveAttribute("aria-labelledby", triggerId!)
    }
  })

  test("remounting the same item key re-registers fresh ids and rewires attributes", async () => {
    function Host() {
      const [key, setKey] = useState(0)
      const items = [
        {content: "Panel A body", label: "Item A", value: `a-${key}`},
      ]
      return (
        <>
          <button onClick={() => setKey((k) => k + 1)}>remount</button>
          <TestAccordion items={items} />
        </>
      )
    }

    await render(<Host />)

    const firstTriggerId = page
      .getByRole("button", {name: "Item A"})
      .element()
      .getAttribute("id")
    const firstContentLabelledBy = page
      .getByText("Panel A body")
      .element()
      .getAttribute("aria-labelledby")

    expect(firstTriggerId).toBe(firstContentLabelledBy)

    await page.getByRole("button", {name: "remount"}).click()

    const nextTriggerId = page
      .getByRole("button", {name: "Item A"})
      .element()
      .getAttribute("id")
    const nextContentLabelledBy = page
      .getByText("Panel A body")
      .element()
      .getAttribute("aria-labelledby")

    expect(nextTriggerId).toBe(nextContentLabelledBy)
    expect(nextTriggerId).not.toBe(firstTriggerId)
  })

  test("keyboard navigation uses registered trigger ids to move focus (scope.getById path)", async () => {
    await render(<TestAccordion items={defaultItems} />)

    const triggerA = page.getByRole("button", {name: "Item A"})
    const triggerB = page.getByRole("button", {name: "Item B"})
    const triggerC = page.getByRole("button", {name: "Item C"})

    await triggerA.click()
    await expect.element(triggerA).toHaveFocus()

    await userEvent.keyboard("{ArrowDown}")
    await expect.element(triggerB).toHaveFocus()

    await userEvent.keyboard("{ArrowDown}")
    await expect.element(triggerC).toHaveFocus()

    await userEvent.keyboard("{Home}")
    await expect.element(triggerA).toHaveFocus()

    await userEvent.keyboard("{End}")
    await expect.element(triggerC).toHaveFocus()
  })

  test("concurrent register of many items in a single render produces complete wiring on first paint", async () => {
    const many: ItemDef[] = Array.from({length: 10}).map((_, i) => ({
      content: `Panel ${i} body`,
      label: `Item ${i}`,
      value: `v-${i}`,
    }))

    await render(<TestAccordion items={many} />)

    for (const item of many) {
      const {contentId, triggerId} = getIds(item.label, item.content)
      expect(contentId).toBeTruthy()
      expect(triggerId).toBeTruthy()
      await expect
        .element(page.getByRole("button", {name: item.label}))
        .toHaveAttribute("aria-controls", contentId!)
      await expect
        .element(page.getByText(item.content))
        .toHaveAttribute("aria-labelledby", triggerId!)
    }
  })

  test("cleanup callback fires exactly once when an item unmounts", async () => {
    const destroyed = vi.fn()

    function TrackedTrigger({
      api,
      label,
      value,
    }: {
      api: AccordionApi
      label: string
      value: string
    }) {
      const id = useControlledId()
      const register = useOnDestroy()
      const onDestroy = (cb: () => void) => {
        register(() => {
          destroyed(value)
          cb()
        })
      }
      return (
        <button
          {...api.getAccordionItemTriggerBindings({id, onDestroy, value})}
          aria-label={label}
        >
          {label}
        </button>
      )
    }

    function Host() {
      const [items, setItems] = useState(defaultItems)
      const api = useAccordion({})
      return (
        <>
          <button onClick={() => setItems((prev) => prev.slice(0, -1))}>
            drop-last
          </button>
          <Root api={api}>
            {items.map((item) => (
              <Item key={item.value} api={api} value={item.value}>
                <h3>
                  <TrackedTrigger
                    api={api}
                    label={item.label}
                    value={item.value}
                  />
                </h3>
                <Content api={api} value={item.value}>
                  {item.content}
                </Content>
              </Item>
            ))}
          </Root>
        </>
      )
    }

    await render(<Host />)
    expect(destroyed).not.toHaveBeenCalled()

    await page.getByRole("button", {name: "drop-last"}).click()

    expect(destroyed).toHaveBeenCalledTimes(1)
    expect(destroyed).toHaveBeenCalledWith("c")
  })

  test("first paint: aria wiring is correct synchronously after render resolves (no stale intermediate)", async () => {
    await render(<TestAccordion items={defaultItems} />)

    for (const item of defaultItems) {
      const trigger = page.getByRole("button", {name: item.label}).element()
      const content = page.getByText(item.content).element()

      const contentId = content.getAttribute("id")
      const triggerId = trigger.getAttribute("id")

      expect(contentId).toBeTruthy()
      expect(triggerId).toBeTruthy()
      expect(trigger.getAttribute("aria-controls")).toBe(contentId)
      expect(content.getAttribute("aria-labelledby")).toBe(triggerId)
    }
  })

  test("conditional toggle of an item (not array add/remove) wires and unwires aria correctly", async () => {
    function Host() {
      const [show, setShow] = useState(false)
      const api = useAccordion({})
      return (
        <>
          <button onClick={() => setShow((s) => !s)}>toggle-b</button>
          <Root api={api}>
            <Item api={api} value="a">
              <h3>
                <Trigger api={api} label="Item A" value="a" />
              </h3>
              <Content api={api} value="a">
                Panel A body
              </Content>
            </Item>
            {show ? (
              <Item api={api} value="b">
                <h3>
                  <Trigger api={api} label="Item B" value="b" />
                </h3>
                <Content api={api} value="b">
                  Panel B body
                </Content>
              </Item>
            ) : null}
          </Root>
        </>
      )
    }

    await render(<Host />)

    await expect
      .element(page.getByRole("button", {name: "Item B"}))
      .not.toBeInTheDocument()

    await page.getByRole("button", {name: "toggle-b"}).click()

    const bTrigger = page.getByRole("button", {name: "Item B"}).element()
    const bContent = page.getByText("Panel B body").element()
    expect(bTrigger.getAttribute("aria-controls")).toBe(
      bContent.getAttribute("id"),
    )
    expect(bContent.getAttribute("aria-labelledby")).toBe(
      bTrigger.getAttribute("id"),
    )

    await page.getByRole("button", {name: "toggle-b"}).click()

    await expect
      .element(page.getByRole("button", {name: "Item B"}))
      .not.toBeInTheDocument()

    const aTrigger = page.getByRole("button", {name: "Item A"}).element()
    const aContent = page.getByText("Panel A body").element()
    expect(aTrigger.getAttribute("aria-controls")).toBe(
      aContent.getAttribute("id"),
    )
    expect(aContent.getAttribute("aria-labelledby")).toBe(
      aTrigger.getAttribute("id"),
    )
  })

  test("remove-then-reregister the same item key produces fresh ids and correct wiring", async () => {
    function Host() {
      const [version, setVersion] = useState(0)
      const [present, setPresent] = useState(true)
      const api = useAccordion({})
      return (
        <>
          <button onClick={() => setPresent((p) => !p)}>toggle</button>
          <button onClick={() => setVersion((v) => v + 1)}>bump</button>
          <Root api={api}>
            {present ? (
              <Item key={`a-${version}`} api={api} value="a">
                <h3>
                  <Trigger api={api} label="Item A" value="a" />
                </h3>
                <Content api={api} value="a">
                  Panel A body
                </Content>
              </Item>
            ) : null}
          </Root>
        </>
      )
    }

    await render(<Host />)

    const firstTriggerId = page
      .getByRole("button", {name: "Item A"})
      .element()
      .getAttribute("id")

    await page.getByRole("button", {name: "toggle"}).click()
    await expect
      .element(page.getByRole("button", {name: "Item A"}))
      .not.toBeInTheDocument()

    await page.getByRole("button", {name: "bump"}).click()
    await page.getByRole("button", {name: "toggle"}).click()

    const nextTriggerId = page
      .getByRole("button", {name: "Item A"})
      .element()
      .getAttribute("id")
    const nextContent = page.getByText("Panel A body").element()

    expect(nextTriggerId).not.toBe(firstTriggerId)
    expect(nextContent.getAttribute("aria-labelledby")).toBe(nextTriggerId)
  })

  test("two independent accordions render without id cross-contamination", async () => {
    function Host() {
      const first = useAccordion({})
      const second = useAccordion({})
      return (
        <>
          <Root api={first}>
            <Item api={first} value="x">
              <h3>
                <Trigger api={first} label="First X" value="x" />
              </h3>
              <Content api={first} value="x">
                First X body
              </Content>
            </Item>
          </Root>
          <Root api={second}>
            <Item api={second} value="x">
              <h3>
                <Trigger api={second} label="Second X" value="x" />
              </h3>
              <Content api={second} value="x">
                Second X body
              </Content>
            </Item>
          </Root>
        </>
      )
    }

    await render(<Host />)

    const firstTrigger = page.getByRole("button", {name: "First X"}).element()
    const firstContent = page.getByText("First X body").element()
    const secondTrigger = page.getByRole("button", {name: "Second X"}).element()
    const secondContent = page.getByText("Second X body").element()

    expect(firstTrigger.getAttribute("id")).not.toBe(
      secondTrigger.getAttribute("id"),
    )
    expect(firstContent.getAttribute("id")).not.toBe(
      secondContent.getAttribute("id"),
    )
    expect(firstTrigger.getAttribute("aria-controls")).toBe(
      firstContent.getAttribute("id"),
    )
    expect(secondTrigger.getAttribute("aria-controls")).toBe(
      secondContent.getAttribute("id"),
    )
    expect(firstContent.getAttribute("aria-labelledby")).toBe(
      firstTrigger.getAttribute("id"),
    )
    expect(secondContent.getAttribute("aria-labelledby")).toBe(
      secondTrigger.getAttribute("id"),
    )
  })

  test("user-provided ids on items flow through to aria attributes", async () => {
    function Host() {
      const api = useAccordion({})
      return (
        <Root api={api}>
          <Item api={api} value="a">
            <h3>
              <Trigger api={api} id="my-trigger" label="Item A" value="a" />
            </h3>
            <Content api={api} id="my-content" value="a">
              Panel A body
            </Content>
          </Item>
        </Root>
      )
    }

    await render(<Host />)

    await expect
      .element(page.getByRole("button", {name: "Item A"}))
      .toHaveAttribute("id", "my-trigger")
    await expect
      .element(page.getByRole("button", {name: "Item A"}))
      .toHaveAttribute("aria-controls", "my-content")
    await expect
      .element(page.getByText("Panel A body"))
      .toHaveAttribute("id", "my-content")
    await expect
      .element(page.getByText("Panel A body"))
      .toHaveAttribute("aria-labelledby", "my-trigger")
  })

  test("changing an item's user-provided id at runtime rewires sibling aria attributes", async () => {
    function Host() {
      const [triggerId, setTriggerId] = useState("trig-1")
      const api = useAccordion({})
      return (
        <>
          <button onClick={() => setTriggerId("trig-2")}>rename-trigger</button>
          <Root api={api}>
            <Item api={api} value="a">
              <h3>
                <Trigger api={api} id={triggerId} label="Item A" value="a" />
              </h3>
              <Content api={api} value="a">
                Panel A body
              </Content>
            </Item>
          </Root>
        </>
      )
    }

    await render(<Host />)

    await expect
      .element(page.getByRole("button", {name: "Item A"}))
      .toHaveAttribute("id", "trig-1")
    await expect
      .element(page.getByText("Panel A body"))
      .toHaveAttribute("aria-labelledby", "trig-1")

    await page.getByRole("button", {name: "rename-trigger"}).click()

    await expect
      .element(page.getByRole("button", {name: "Item A"}))
      .toHaveAttribute("id", "trig-2")
    await expect
      .element(page.getByText("Panel A body"))
      .toHaveAttribute("aria-labelledby", "trig-2")
  })
})
