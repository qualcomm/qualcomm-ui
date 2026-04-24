import {type ReactNode, useState} from "react"

import {describe, expect, test} from "vitest"
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
    <div
      data-test-id="root"
      {...api.getRootBindings({id: controlledId, onDestroy})}
    >
      {children}
    </div>
  )
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

const singleItem = [{content: "Panel A body", label: "Item A", value: "a"}]

function TestAccordion({
  rootId,
  ...props
}: {rootId?: string} & AccordionApiProps) {
  const api = useAccordion(props)
  return (
    <Root api={api} id={rootId}>
      {singleItem.map((item) => (
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

describe("useBindableId (accordion root id integration)", () => {
  test("generates a stable root id when no id is provided, and triggers reference it via data-ownedby", async () => {
    await render(<TestAccordion />)

    const rootId = page.getByTestId("root").element().getAttribute("id")
    expect(rootId).toBeTruthy()

    await expect
      .element(page.getByRole("button", {name: "Item A"}))
      .toHaveAttribute("data-ownedby", rootId!)
  })

  test("a user-provided root id wins over the generated one", async () => {
    await render(<TestAccordion rootId="my-root" />)

    await expect
      .element(page.getByTestId("root"))
      .toHaveAttribute("id", "my-root")
    await expect
      .element(page.getByRole("button", {name: "Item A"}))
      .toHaveAttribute("data-ownedby", "my-root")
  })

  test("changing the user-provided root id rewires data-ownedby on descendants", async () => {
    function Host() {
      const [id, setId] = useState("first")
      return (
        <>
          <button onClick={() => setId("second")}>rotate</button>
          <TestAccordion rootId={id} />
        </>
      )
    }

    await render(<Host />)

    await expect
      .element(page.getByTestId("root"))
      .toHaveAttribute("id", "first")
    await expect
      .element(page.getByRole("button", {name: "Item A"}))
      .toHaveAttribute("data-ownedby", "first")

    await page.getByRole("button", {name: "rotate"}).click()

    await expect
      .element(page.getByTestId("root"))
      .toHaveAttribute("id", "second")
    await expect
      .element(page.getByRole("button", {name: "Item A"}))
      .toHaveAttribute("data-ownedby", "second")
  })

  test("unmounting the root with its late cleanup does not throw", async () => {
    function Host() {
      const [mounted, setMounted] = useState(true)
      return (
        <>
          <button onClick={() => setMounted(false)}>unmount</button>
          {mounted ? <TestAccordion /> : <p>gone</p>}
        </>
      )
    }

    await render(<Host />)

    await expect.element(page.getByTestId("root")).toBeInTheDocument()

    await page.getByRole("button", {name: "unmount"}).click()

    await expect.element(page.getByText("gone")).toBeInTheDocument()
    await expect.element(page.getByTestId("root")).not.toBeInTheDocument()
  })
})
