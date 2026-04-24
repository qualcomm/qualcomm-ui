import {type ReactNode, useState} from "react"

import {describe, expect, test, vi} from "vitest"
import {page} from "vitest/browser"
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

function Root({api, children}: {api: AccordionApi; children: ReactNode}) {
  const id = useControlledId()
  const onDestroy = useOnDestroy()
  return <div {...api.getRootBindings({id, onDestroy})}>{children}</div>
}

function Item({
  api,
  children,
  value,
}: {
  api: AccordionApi
  children: ReactNode
  value: string
}) {
  const id = useControlledId()
  const onDestroy = useOnDestroy()
  return (
    <section {...api.getAccordionItemBindings({id, onDestroy, value})}>
      {children}
    </section>
  )
}

function Trigger({
  api,
  label,
  value,
}: {
  api: AccordionApi
  label: string
  value: string
}) {
  const id = useControlledId()
  const onDestroy = useOnDestroy()
  return (
    <button
      {...api.getAccordionItemTriggerBindings({id, onDestroy, value})}
      aria-label={label}
    >
      {label}
    </button>
  )
}

function Content({
  api,
  children,
  value,
}: {
  api: AccordionApi
  children: ReactNode
  value: string
}) {
  const id = useControlledId()
  const onDestroy = useOnDestroy()
  return (
    <div {...api.getAccordionItemContentBindings({id, onDestroy, value})}>
      {children}
    </div>
  )
}

const items = [
  {content: "Panel A body", label: "Item A", value: "a"},
  {content: "Panel B body", label: "Item B", value: "b"},
]

function TestAccordion(props: AccordionApiProps) {
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

function isExpanded(label: string) {
  return page
    .getByRole("button", {name: label})
    .element()
    .getAttribute("aria-expanded")
}

describe("useBindable (accordion value prop integration)", () => {
  describe("uncontrolled", () => {
    test("uses defaultValue on first paint", async () => {
      await render(<TestAccordion defaultValue={["a"]} />)

      await expect
        .element(page.getByRole("button", {name: "Item A"}))
        .toHaveAttribute("aria-expanded", "true")
      await expect
        .element(page.getByRole("button", {name: "Item B"}))
        .toHaveAttribute("aria-expanded", "false")
    })

    test("clicking a trigger toggles internal state (single mode, collapsible)", async () => {
      await render(<TestAccordion collapsible />)

      expect(isExpanded("Item A")).toBe("false")

      await page.getByRole("button", {name: "Item A"}).click()
      expect(isExpanded("Item A")).toBe("true")

      await page.getByRole("button", {name: "Item A"}).click()
      expect(isExpanded("Item A")).toBe("false")
    })

    test("onValueChange fires with the next value on user interaction", async () => {
      const onValueChange = vi.fn()

      await render(<TestAccordion onValueChange={onValueChange} />)

      await page.getByRole("button", {name: "Item A"}).click()

      expect(onValueChange).toHaveBeenCalledOnce()
      expect(onValueChange.mock.calls[0][0]).toEqual(["a"])
    })

    test("onValueChange is NOT fired when the next value equals the previous (single-mode click on already open)", async () => {
      const onValueChange = vi.fn()

      await render(
        <TestAccordion defaultValue={["a"]} onValueChange={onValueChange} />,
      )

      await page.getByRole("button", {name: "Item A"}).click()

      expect(onValueChange).not.toHaveBeenCalled()
    })
  })

  describe("controlled", () => {
    test("external value prop overrides internal state", async () => {
      function Host() {
        const [value, setValue] = useState<string[]>(["a"])
        return (
          <>
            <button onClick={() => setValue(["b"])}>swap</button>
            <TestAccordion value={value} />
          </>
        )
      }

      await render(<Host />)

      expect(isExpanded("Item A")).toBe("true")
      expect(isExpanded("Item B")).toBe("false")

      await page.getByRole("button", {name: "swap"}).click()

      expect(isExpanded("Item A")).toBe("false")
      expect(isExpanded("Item B")).toBe("true")
    })

    test("trigger click does NOT change UI when parent ignores onValueChange", async () => {
      const onValueChange = vi.fn()

      await render(<TestAccordion onValueChange={onValueChange} value={[]} />)

      await page.getByRole("button", {name: "Item A"}).click()

      expect(onValueChange).toHaveBeenCalled()
      expect(isExpanded("Item A")).toBe("false")
    })

    test("trigger click drives UI when parent reflects onValueChange back into value", async () => {
      function Host() {
        const [value, setValue] = useState<string[]>([])
        return (
          <TestAccordion
            onValueChange={(next) => setValue(next)}
            value={value}
          />
        )
      }

      await render(<Host />)

      expect(isExpanded("Item A")).toBe("false")

      await page.getByRole("button", {name: "Item A"}).click()

      expect(isExpanded("Item A")).toBe("true")
    })
  })

  describe("transitions", () => {
    test("switching uncontrolled → controlled takes the parent-supplied value", async () => {
      function Host() {
        const [controlled, setControlled] = useState(false)
        return (
          <>
            <button onClick={() => setControlled(true)}>control</button>
            {controlled ? (
              <TestAccordion value={["b"]} />
            ) : (
              <TestAccordion defaultValue={["a"]} />
            )}
          </>
        )
      }

      await render(<Host />)

      expect(isExpanded("Item A")).toBe("true")

      await page.getByRole("button", {name: "control"}).click()

      expect(isExpanded("Item A")).toBe("false")
      expect(isExpanded("Item B")).toBe("true")
    })
  })
})
