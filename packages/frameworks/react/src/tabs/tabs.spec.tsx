import {type ComponentProps, useState} from "react"

import {page, userEvent} from "@vitest/browser/context"
import {describe, expect, test, vi} from "vitest"
import {render} from "vitest-browser-react"

import {Button} from "@qualcomm-ui/react/button"

import {Tab, Tabs} from "./index"

const tabValues = ["documents", "products", "software", "hardware"]
const tabLabels = ["Documents", "Products", "Software", "Hardware"]
const panelContents = [
  "Documents content",
  "Products content",
  "Software content",
  "Hardware content",
]

const testIds = {
  indicator: "tabs-indicator",
}

function BasicTabs(props: Partial<ComponentProps<typeof Tabs.Root>> = {}) {
  return (
    <Tabs.Root defaultValue={tabValues[0]} {...props}>
      <Tabs.List>
        <Tabs.Indicator data-test-id={testIds.indicator} />
        {tabValues.map((value, index) => (
          <Tab.Root key={value} value={value}>
            <Tab.Button>{tabLabels[index]}</Tab.Button>
          </Tab.Root>
        ))}
      </Tabs.List>
      {tabValues.map((value, index) => (
        <Tabs.Panel key={value} value={value}>
          {panelContents[index]}
        </Tabs.Panel>
      ))}
    </Tabs.Root>
  )
}

function DisabledTabs() {
  return (
    <Tabs.Root defaultValue={tabValues[0]}>
      <Tabs.List>
        <Tabs.Indicator />
        <Tab.Root value={tabValues[0]}>
          <Tab.Button>{tabLabels[0]}</Tab.Button>
        </Tab.Root>
        <Tab.Root disabled value={tabValues[1]}>
          <Tab.Button>{tabLabels[1]}</Tab.Button>
        </Tab.Root>
        <Tab.Root value={tabValues[2]}>
          <Tab.Button>{tabLabels[2]}</Tab.Button>
        </Tab.Root>
        <Tab.Root value={tabValues[3]}>
          <Tab.Button>{tabLabels[3]}</Tab.Button>
        </Tab.Root>
      </Tabs.List>
      {tabValues.map((value, index) => (
        <Tabs.Panel key={value} value={value}>
          {panelContents[index]}
        </Tabs.Panel>
      ))}
    </Tabs.Root>
  )
}

function ControlledTabs() {
  const [value, setValue] = useState(tabValues[0])

  return (
    <div>
      <div className="mb-4 flex gap-2">
        <Button onClick={() => setValue(tabValues[0])}>Go to Documents</Button>
        <Button onClick={() => setValue(tabValues[2])}>Go to Software</Button>
      </div>
      <Tabs.Root onValueChange={setValue} value={value}>
        <Tabs.List>
          <Tabs.Indicator />
          {tabValues.map((value, index) => (
            <Tab.Root key={value} value={value}>
              <Tab.Button>{tabLabels[index]}</Tab.Button>
            </Tab.Root>
          ))}
        </Tabs.List>
        {tabValues.map((value, index) => (
          <Tabs.Panel key={value} value={value}>
            {panelContents[index]}
          </Tabs.Panel>
        ))}
      </Tabs.Root>
    </div>
  )
}

function LazyMountedTabs() {
  return (
    <Tabs.Root defaultValue={tabValues[0]} lazyMount unmountOnExit>
      <Tabs.List>
        <Tabs.Indicator />
        {tabValues.map((value, index) => (
          <Tab.Root key={value} value={value}>
            <Tab.Button>{tabLabels[index]}</Tab.Button>
          </Tab.Root>
        ))}
      </Tabs.List>
      {tabValues.map((value, index) => (
        <Tabs.Panel key={value} value={value}>
          {panelContents[index]}
        </Tabs.Panel>
      ))}
    </Tabs.Root>
  )
}

function getTabButton(label: string) {
  return page.getByRole("tab", {name: label})
}

function getPanel(content: string) {
  return page.getByText(content)
}

async function assertTabSelected(label: string) {
  await expect
    .element(getTabButton(label))
    .toHaveAttribute("aria-selected", "true")
}

async function assertTabNotSelected(label: string) {
  await expect
    .element(getTabButton(label))
    .not.toHaveAttribute("aria-selected", "true")
}

async function assertPanelVisible(content: string) {
  await expect.element(getPanel(content)).toBeVisible()
}

async function assertPanelNotVisible(content: string) {
  await expect.element(getPanel(content)).not.toBeVisible()
}

async function assertPanelNotInDOM(content: string) {
  await expect.element(getPanel(content)).not.toBeInTheDocument()
}

async function selectTab(label: string) {
  await getTabButton(label).click()
}

describe("Tabs", () => {
  test("renders all tabs and shows first panel by default", async () => {
    render(<BasicTabs />)

    for (const label of tabLabels) {
      await expect.element(getTabButton(label)).toBeVisible()
    }

    await assertTabSelected(tabLabels[0])
    await assertPanelVisible(panelContents[0])

    for (let i = 1; i < tabLabels.length; i++) {
      await assertTabNotSelected(tabLabels[i])
      await assertPanelNotVisible(panelContents[i])
    }
  })

  test("switches panels when tabs are clicked", async () => {
    render(<BasicTabs />)

    await assertTabSelected(tabLabels[0])
    await assertPanelVisible(panelContents[0])

    await selectTab(tabLabels[1])
    await assertTabSelected(tabLabels[1])
    await assertPanelVisible(panelContents[1])
    await assertPanelNotVisible(panelContents[0])

    await selectTab(tabLabels[2])
    await assertTabSelected(tabLabels[2])
    await assertPanelVisible(panelContents[2])
    await assertPanelNotVisible(panelContents[1])
  })

  test("respects defaultValue prop", async () => {
    render(<BasicTabs defaultValue={tabValues[2]} />)

    await assertTabSelected(tabLabels[2])
    await assertPanelVisible(panelContents[2])
    await assertPanelNotVisible(panelContents[0])
  })

  test("horizontal orientation keyboard navigation", async () => {
    render(<BasicTabs />)

    await userEvent.tab()
    await assertTabSelected(tabLabels[0])

    await userEvent.keyboard("{ArrowRight}")
    await assertTabSelected(tabLabels[1])

    await userEvent.keyboard("{ArrowRight}")
    await assertTabSelected(tabLabels[2])

    await userEvent.keyboard("{ArrowRight}")
    await assertTabSelected(tabLabels[3])

    await userEvent.keyboard("{ArrowRight}")
    await assertTabSelected(tabLabels[0])

    await userEvent.keyboard("{ArrowLeft}")
    await assertTabSelected(tabLabels[3])

    await userEvent.keyboard("{Home}")
    await assertTabSelected(tabLabels[0])

    await userEvent.keyboard("{End}")
    await assertTabSelected(tabLabels[3])
  })

  test("vertical orientation keyboard navigation", async () => {
    render(<BasicTabs orientation="vertical" />)

    await userEvent.tab()
    await assertTabSelected(tabLabels[0])

    await userEvent.keyboard("{ArrowDown}")
    await assertTabSelected(tabLabels[1])

    await userEvent.keyboard("{ArrowDown}")
    await assertTabSelected(tabLabels[2])

    await userEvent.keyboard("{ArrowDown}")
    await assertTabSelected(tabLabels[3])

    await userEvent.keyboard("{ArrowDown}")
    await assertTabSelected(tabLabels[0])

    await userEvent.keyboard("{ArrowUp}")
    await assertTabSelected(tabLabels[3])

    await userEvent.keyboard("{Home}")
    await assertTabSelected(tabLabels[0])

    await userEvent.keyboard("{End}")
    await assertTabSelected(tabLabels[3])
  })

  test("disabled tabs cannot be selected", async () => {
    render(<DisabledTabs />)

    await expect
      .element(getTabButton(tabLabels[1]))
      .toHaveAttribute("data-disabled", "")

    await assertTabNotSelected(tabLabels[1])
    await assertTabSelected(tabLabels[0])

    await userEvent.tab()
    await userEvent.keyboard("{ArrowRight}")
    await assertTabSelected(tabLabels[2])
  })

  test("controlled tabs work correctly", async () => {
    render(<ControlledTabs />)

    await assertTabSelected(tabLabels[0])
    await assertPanelVisible(panelContents[0])

    await page.getByText("Go to Software").click()
    await assertTabSelected(tabLabels[2])
    await assertPanelVisible(panelContents[2])

    await page.getByText("Go to Documents").click()
    await assertTabSelected(tabLabels[0])
    await assertPanelVisible(panelContents[0])
  })

  test("onValueChange callback is called", async () => {
    const onValueChange = vi.fn()
    render(<BasicTabs onValueChange={onValueChange} />)

    await selectTab(tabLabels[1])
    await expect.poll(() => onValueChange).toHaveBeenCalledWith(tabValues[1])

    await selectTab(tabLabels[2])
    await expect.poll(() => onValueChange).toHaveBeenCalledWith(tabValues[2])
  })

  test("lazy mounting - panels not in DOM initially", async () => {
    render(<LazyMountedTabs />)

    await assertPanelVisible(panelContents[0])

    for (let i = 1; i < panelContents.length; i++) {
      await assertPanelNotInDOM(panelContents[i])
    }

    await selectTab(tabLabels[1])
    await assertPanelVisible(panelContents[1])
    await assertPanelNotInDOM(panelContents[0])
  })

  test("manual activation mode", async () => {
    render(<BasicTabs activationMode="manual" />)

    await userEvent.tab()
    await assertTabSelected(tabLabels[0])

    await userEvent.keyboard("{ArrowRight}")
    await assertTabSelected(tabLabels[0])
    await expect
      .element(getTabButton(tabLabels[1]))
      .toHaveAttribute("data-focus")

    await userEvent.keyboard("{Enter}")
    await assertTabSelected(tabLabels[1])

    await userEvent.keyboard("{ArrowRight}")
    await userEvent.keyboard("{Space}")
    await assertTabSelected(tabLabels[2])
  })

  test("tab focus management", async () => {
    render(
      <div>
        <Button>Before Tabs</Button>
        <BasicTabs />
        <Button>After Tabs</Button>
      </div>,
    )

    await selectTab(tabLabels[1])
    await page.getByText("Before Tabs").click()

    await userEvent.tab()
    await expect
      .element(getTabButton(tabLabels[1]))
      .toHaveAttribute("data-focus")

    await userEvent.tab()
    await expect.element(page.getByText(panelContents[1])).toHaveFocus()
    await userEvent.tab()
    await expect.element(page.getByText("After Tabs")).toHaveFocus()
  })

  test("Context component provides access to tabs API", async () => {
    function ContextTabs() {
      return (
        <Tabs.Root defaultValue={tabValues[0]}>
          <Tabs.List>
            <Tabs.Indicator />
            {tabValues.map((value, index) => (
              <Tab.Root key={value} value={value}>
                <Tab.Button>{tabLabels[index]}</Tab.Button>
              </Tab.Root>
            ))}
          </Tabs.List>
          <Tabs.Context>
            {(api) => (
              <div>
                <div data-test-id="current-value">{api.value}</div>
                <Button onClick={() => api.setValue(tabValues[2])}>
                  Set to Software
                </Button>
              </div>
            )}
          </Tabs.Context>
          {tabValues.map((value, index) => (
            <Tabs.Panel key={value} value={value}>
              {panelContents[index]}
            </Tabs.Panel>
          ))}
        </Tabs.Root>
      )
    }

    render(<ContextTabs />)

    await expect
      .element(page.getByTestId("current-value"))
      .toHaveTextContent(tabValues[0])

    await page.getByText("Set to Software").click()
    await expect
      .element(page.getByTestId("current-value"))
      .toHaveTextContent(tabValues[2])
    await assertTabSelected(tabLabels[2])
    await assertPanelVisible(panelContents[2])
  })
})
