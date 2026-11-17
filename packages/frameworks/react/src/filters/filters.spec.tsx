import {type ReactNode, useState} from "react"

import {describe, expect, test, vi} from "vitest"
import {render} from "vitest-browser-react"
import {page, userEvent} from "vitest/browser"

import {
  type FilterPanelApiProps,
  type FilterPanelApplyMode,
  getFacetFilterPanelProps,
} from "@qualcomm-ui/core/filter-panel"
import {
  checkboxFilter,
  checkboxTreeFilter,
  comboboxFilter,
  dateFilter,
  defineFilters,
  type FilterValues,
  radioFilter,
  rangeFilter,
  selectFilter,
  textFilter,
} from "@qualcomm-ui/core/filters"
import {createTreeCollection} from "@qualcomm-ui/core/tree"
import {FilterPanel, useFilterPanel} from "@qualcomm-ui/react/filter-panel"
import {
  CheckboxFilter,
  CheckboxTreeFilter,
  ComboboxFilter,
  DateFilter,
  RadioFilter,
  RangeFilter,
  SelectFilter,
  TextFilter,
} from "@qualcomm-ui/react/filters"
import {FacetFilter} from "@qualcomm-ui/utils/facet-filter"

const filters = defineFilters({
  buildPath: textFilter({label: "Build path"}),
  chipset: checkboxTreeFilter({label: "Chipset"}),
  duration: rangeFilter({label: "Duration", max: 10, min: 0}),
  mode: radioFilter({
    label: "Mode",
    options: [
      {label: "All", value: ""},
      {label: "Debug", value: "debug"},
      {label: "Release", value: "release"},
    ],
  }),
  owner: comboboxFilter({
    label: "Owner",
    options: [
      {label: "Anna Robinson", value: "u1"},
      {label: "Ben Ortiz", value: "u2"},
    ],
  }),
  standard: selectFilter({
    label: "Standard",
    options: [
      {label: "Wi-Fi 6", value: "wifi6"},
      {label: "Wi-Fi 7", value: "wifi7"},
    ],
  }),
  status: checkboxFilter({
    label: "Status",
    options: ["Failed", "Passed", "Queued"],
  }),
  submitted: dateFilter({
    label: "Submitted",
    presets: [{label: "Last 7 days", value: "last7Days"}],
  }),
  user: checkboxFilter({label: "User"}),
})

const chipsets = createTreeCollection<{
  id: string
  nodes?: any[]
  text: string
}>({
  nodeText: "text",
  nodeValue: "id",
  rootNode: {
    id: "ROOT",
    nodes: [
      {
        id: "x",
        nodes: [
          {id: "sc8480xp", text: "SC8480XP"},
          {id: "sc8380xp", text: "SC8380XP"},
        ],
        text: "Snapdragon X",
      },
    ],
    text: "",
  },
})

type Values = FilterValues<typeof filters>

interface PanelProps extends Pick<
  FilterPanelApiProps,
  "getFilterOptionCounts" | "getFilterOptions"
> {
  applyMode?: FilterPanelApplyMode
  children: ReactNode
  defaultValue?: Values
  onValueChange?: (value: Values) => void
}

function Panel({
  applyMode,
  children,
  defaultValue,
  getFilterOptionCounts,
  getFilterOptions,
  onValueChange,
}: PanelProps) {
  return (
    <FilterPanel.Root
      applyMode={applyMode}
      defaultValue={defaultValue}
      filters={filters}
      getFilterOptionCounts={getFilterOptionCounts}
      getFilterOptions={getFilterOptions}
      onValueChange={onValueChange}
    >
      <FilterPanel.Header>
        <FilterPanel.Heading>
          Filters <FilterPanel.Count />
        </FilterPanel.Heading>
        <FilterPanel.ClearButton />
      </FilterPanel.Header>
      {children}
      <FilterPanel.Footer>
        <FilterPanel.ApplyButton />
      </FilterPanel.Footer>
    </FilterPanel.Root>
  )
}

describe("filter panel", () => {
  test("manual mode stages changes until they are applied", async () => {
    const onValueChange = vi.fn()
    await render(
      <Panel applyMode="manual" onValueChange={onValueChange}>
        <CheckboxFilter filter={filters.status} />
      </Panel>,
    )

    const apply = page.getByRole("button", {name: "Apply"})
    await expect.element(apply).toBeDisabled()

    await page.getByText("Failed").click()
    await page.getByText("Queued").click()

    await expect.element(page.getByLabelText("Failed")).toBeChecked()
    await expect.element(apply).toBeEnabled()
    expect(onValueChange).not.toHaveBeenCalled()

    await apply.click()

    await expect
      .poll(() => onValueChange.mock.lastCall?.[0])
      .toEqual({status: ["Failed", "Queued"]})
    await expect.element(apply).toBeDisabled()
  })

  test("setting the value from outside replaces unapplied changes in manual mode", async () => {
    function ControlledPanel() {
      const [value, setValue] = useState<Values>({status: ["Failed"]})
      return (
        <>
          <button onClick={() => setValue({})} type="button">
            Reset
          </button>
          <FilterPanel.Root
            applyMode="manual"
            filters={filters}
            onValueChange={setValue}
            value={value}
          >
            <CheckboxFilter filter={filters.status} />
            <FilterPanel.Footer>
              <FilterPanel.ApplyButton />
            </FilterPanel.Footer>
          </FilterPanel.Root>
        </>
      )
    }
    await render(<ControlledPanel />)

    await page.getByText("Queued").click()
    await expect.element(page.getByLabelText("Queued")).toBeChecked()

    await page.getByRole("button", {name: "Reset"}).click()

    await expect.element(page.getByLabelText("Failed")).not.toBeChecked()
    await expect.element(page.getByLabelText("Queued")).not.toBeChecked()
    await expect
      .element(page.getByRole("button", {name: "Apply"}))
      .toBeDisabled()
  })

  test("setting the value from outside never renders the panel as dirty in manual mode", async () => {
    const dirtyRenders: boolean[] = []
    function ControlledPanel() {
      const [value, setValue] = useState<Values>({status: ["Failed"]})
      const panel = useFilterPanel({
        applyMode: "manual",
        filters,
        onValueChange: setValue,
        value,
      })
      dirtyRenders.push(panel.isDirty)
      return (
        <>
          <button onClick={() => setValue({status: ["Passed"]})} type="button">
            Show passed
          </button>
          <FilterPanel.RootProvider value={panel}>
            <CheckboxFilter filter={filters.status} />
          </FilterPanel.RootProvider>
        </>
      )
    }
    await render(<ControlledPanel />)

    await page.getByRole("button", {name: "Show passed"}).click()

    await expect.element(page.getByLabelText("Passed")).toBeChecked()
    expect(dirtyRenders).not.toContain(true)
  })

  test("auto mode is the default and commits every change", async () => {
    const onValueChange = vi.fn()
    await render(
      <Panel onValueChange={onValueChange}>
        <CheckboxFilter filter={filters.status} />
      </Panel>,
    )

    await page.getByText("Passed").click()

    await expect
      .poll(() => onValueChange.mock.lastCall?.[0])
      .toEqual({status: ["Passed"]})
  })

  test("counts selected values per filter and for the panel", async () => {
    await render(
      <Panel defaultValue={{buildPath: "out/", status: ["Failed", "Queued"]}}>
        <CheckboxFilter filter={filters.status} />
        <TextFilter filter={filters.buildPath} />
      </Panel>,
    )

    await expect
      .element(page.getByRole("heading", {name: "Filters 3 selected"}))
      .toBeVisible()
    await expect
      .element(page.getByRole("button", {name: "Status 2 selected"}))
      .toBeVisible()
    await expect
      .element(page.getByRole("button", {name: "Build path 1 selected"}))
      .toBeVisible()
  })

  test("clear all removes every filter and must be applied in manual mode", async () => {
    const onValueChange = vi.fn()
    await render(
      <Panel
        applyMode="manual"
        defaultValue={{status: ["Failed"]}}
        onValueChange={onValueChange}
      >
        <CheckboxFilter filter={filters.status} />
      </Panel>,
    )

    await page.getByRole("button", {name: "Clear all"}).click()

    await expect.element(page.getByLabelText("Failed")).not.toBeChecked()
    await expect
      .element(page.getByRole("button", {name: "Clear all"}))
      .toBeDisabled()

    await page.getByRole("button", {name: "Apply"}).click()
    await expect.poll(() => onValueChange.mock.lastCall?.[0]).toEqual({})
  })

  test("the filter trigger collapses and expands its content", async () => {
    await render(
      <Panel>
        <CheckboxFilter filter={filters.status} />
      </Panel>,
    )

    const trigger = page.getByRole("button", {name: "Status"})
    await expect.element(trigger).toHaveAttribute("aria-expanded", "true")

    await trigger.click()
    await expect.element(trigger).toHaveAttribute("aria-expanded", "false")
    await expect.element(page.getByText("Failed")).not.toBeVisible()

    await trigger.click()
    await expect.element(page.getByText("Failed")).toBeVisible()
  })

  test("labels the control with the filter label, which the label prop can render differently", async () => {
    await render(
      <Panel>
        <CheckboxFilter
          filter={filters.status}
          label={(label) => <em>{label} (runs)</em>}
        />
      </Panel>,
    )

    await expect.element(page.getByText("Status (runs)")).toBeVisible()
    await expect
      .element(page.getByRole("group", {name: "Status (runs)"}))
      .toBeVisible()
  })

  test("component options take precedence over definition options", async () => {
    await render(
      <Panel>
        <CheckboxFilter
          filter={filters.user}
          options={[{label: "Anna Robinson", value: "u1"}]}
        />
      </Panel>,
    )

    await expect.element(page.getByLabelText("Anna Robinson")).toBeVisible()
  })

  test("selected values missing from the options stay visible", async () => {
    await render(
      <Panel defaultValue={{status: ["Cancelled"]}}>
        <CheckboxFilter filter={filters.status} />
      </Panel>,
    )

    await expect.element(page.getByLabelText("Cancelled")).toBeChecked()
  })
})

describe("RootProvider", () => {
  test("shares committed values and recorded option labels outside the panel", async () => {
    const onValueChange = vi.fn()

    function Example() {
      const panel = useFilterPanel({
        applyMode: "manual",
        filters,
        onValueChange,
      })
      const [open, setOpen] = useState(true)
      const committed = panel.value.user ?? []

      return (
        <>
          <ul aria-label="Active filters">
            {committed.map((value) => (
              <li key={value}>{panel.getFilterOptionLabel("user", value)}</li>
            ))}
          </ul>
          <button onClick={() => setOpen((prev) => !prev)} type="button">
            Toggle panel
          </button>
          {open ? (
            <FilterPanel.RootProvider value={panel}>
              <CheckboxFilter
                filter={filters.user}
                options={[{label: "Anna Robinson", value: "u1"}]}
              />
              <FilterPanel.ApplyButton />
            </FilterPanel.RootProvider>
          ) : null}
        </>
      )
    }

    await render(<Example />)

    await page.getByText("Anna Robinson").click()
    await page.getByRole("button", {name: "Apply"}).click()

    await expect
      .poll(() => onValueChange.mock.lastCall)
      .toEqual([{user: ["u1"]}, {labels: {user: {u1: "Anna Robinson"}}}])

    await page.getByRole("button", {name: "Toggle panel"}).click()
    await expect
      .element(
        page
          .getByRole("list", {name: "Active filters"})
          .getByText("Anna Robinson"),
      )
      .toBeVisible()
  })
})

describe("counts", () => {
  test("valueCount counts the committed value, draftValueCount the draft", async () => {
    function Example() {
      const panel = useFilterPanel({applyMode: "manual", filters})
      return (
        <>
          <output aria-label="Applied">{panel.valueCount}</output>
          <output aria-label="Pending">{panel.draftValueCount}</output>
          <FilterPanel.RootProvider value={panel}>
            <CheckboxFilter filter={filters.status} />
            <FilterPanel.ApplyButton />
          </FilterPanel.RootProvider>
        </>
      )
    }

    await render(<Example />)

    await page.getByText("Failed").click()
    await page.getByText("Queued").click()

    await expect.element(page.getByLabelText("Pending")).toHaveTextContent("2")
    await expect.element(page.getByLabelText("Applied")).toHaveTextContent("0")

    await page.getByRole("button", {name: "Apply"}).click()

    await expect.element(page.getByLabelText("Applied")).toHaveTextContent("2")
  })
})

describe("filter types", () => {
  test("radio filter selects one option, and a blank option clears it", async () => {
    const onValueChange = vi.fn()
    await render(
      <Panel onValueChange={onValueChange}>
        <RadioFilter filter={filters.mode} />
      </Panel>,
    )

    await expect.element(page.getByLabelText("All")).toBeChecked()

    await page.getByText("Debug").click()
    await expect
      .poll(() => onValueChange.mock.lastCall?.[0])
      .toEqual({mode: ["debug"]})

    await page.getByText("All").click()
    await expect.poll(() => onValueChange.mock.lastCall?.[0]).toEqual({})
  })

  test("select filter writes the picked option values", async () => {
    const onValueChange = vi.fn()
    await render(
      <Panel onValueChange={onValueChange}>
        <SelectFilter filter={filters.standard} />
      </Panel>,
    )

    await page.getByRole("combobox", {name: "Standard"}).click()
    await page.getByRole("option", {name: "Wi-Fi 7"}).click()

    await expect
      .poll(() => onValueChange.mock.lastCall)
      .toEqual([
        {standard: ["wifi7"]},
        {labels: {standard: {wifi7: "Wi-Fi 7"}}},
      ])
  })

  test("text filter writes the draft as the user types in manual mode", async () => {
    const onValueChange = vi.fn()
    await render(
      <Panel applyMode="manual" onValueChange={onValueChange}>
        <TextFilter filter={filters.buildPath} />
      </Panel>,
    )

    await page.getByRole("textbox", {name: "Build path"}).fill("out/release")
    await page.getByRole("button", {name: "Apply"}).click()

    await expect
      .poll(() => onValueChange.mock.lastCall?.[0])
      .toEqual({buildPath: "out/release"})
  })

  test("text filter debounces commits in auto mode", async () => {
    const onValueChange = vi.fn()
    await render(
      <Panel onValueChange={onValueChange}>
        <TextFilter debounce={50} filter={filters.buildPath} />
      </Panel>,
    )

    const input = page.getByRole("textbox", {name: "Build path"})
    await input.fill("out")
    await expect.element(input).toHaveValue("out")
    expect(onValueChange).not.toHaveBeenCalled()

    await expect
      .poll(() => onValueChange.mock.lastCall?.[0])
      .toEqual({buildPath: "out"})
  })

  test("range filter leaves a bound resting on its limit unbounded", async () => {
    const onValueChange = vi.fn()
    await render(
      <Panel onValueChange={onValueChange}>
        <RangeFilter filter={filters.duration} />
      </Panel>,
    )

    await page.getByRole("slider", {name: "Duration"}).first().click()
    await userEvent.keyboard("{Home}{ArrowRight}")

    await expect
      .poll(() => onValueChange.mock.lastCall?.[0])
      .toEqual({duration: [1, null]})
  })

  test("date filter selects developer-defined presets or a custom range", async () => {
    const onValueChange = vi.fn()
    await render(
      <Panel onValueChange={onValueChange}>
        <DateFilter filter={filters.submitted} />
      </Panel>,
    )

    await expect.element(page.getByLabelText("Any time")).toBeChecked()

    await page.getByText("Last 7 days").click()
    await expect
      .poll(() => onValueChange.mock.lastCall?.[0])
      .toEqual({submitted: {preset: "last7Days"}})

    await page.getByText("Custom range").click()
    await expect.poll(() => onValueChange.mock.lastCall?.[0]).toEqual({})
    await expect.element(page.getByLabelText("Custom range")).toBeChecked()
  })

  test("combobox filter searches its options and writes the picked values", async () => {
    const onValueChange = vi.fn()
    await render(
      <Panel onValueChange={onValueChange}>
        <ComboboxFilter filter={filters.owner} />
      </Panel>,
    )

    await page.getByRole("combobox", {name: "Owner"}).fill("Ben")
    await expect
      .element(page.getByRole("option", {name: "Anna Robinson"}))
      .not.toBeInTheDocument()
    await page.getByRole("option", {name: "Ben Ortiz"}).click()

    await expect
      .poll(() => onValueChange.mock.lastCall)
      .toEqual([{owner: ["u2"]}, {labels: {owner: {u2: "Ben Ortiz"}}}])
  })

  test("checkbox tree filter writes checked leaves", async () => {
    const onValueChange = vi.fn()
    await render(
      <Panel onValueChange={onValueChange}>
        <CheckboxTreeFilter
          collection={chipsets}
          defaultExpandedValue={["x"]}
          filter={filters.chipset}
        />
      </Panel>,
    )

    await page
      .getByRole("treeitem", {name: "SC8380XP"})
      .getByRole("checkbox")
      .click()

    await expect
      .poll(() => onValueChange.mock.lastCall)
      .toEqual([
        {chipset: ["sc8380xp"]},
        {labels: {chipset: {sc8380xp: "SC8380XP"}}},
      ])
  })
})

describe("option counts", () => {
  const counts: Record<string, Record<string, number>> = {
    mode: {debug: 3, release: 0},
    owner: {u1: 2, u2: 0},
    standard: {wifi6: 4, wifi7: 0},
    status: {Failed: 2, Passed: 0, Queued: 1},
  }
  const getFilterOptionCounts = (id: string) => counts[id]

  test("checkbox options show counts and disable unselected options with none", async () => {
    await render(
      <Panel
        defaultValue={{status: ["Passed"]}}
        getFilterOptionCounts={getFilterOptionCounts}
      >
        <CheckboxFilter filter={filters.status} />
      </Panel>,
    )

    await expect
      .element(page.getByRole("checkbox", {name: "Failed 2"}))
      .toBeEnabled()
    await expect
      .element(page.getByRole("checkbox", {name: "Queued 1"}))
      .toBeEnabled()
    await expect
      .element(page.getByRole("checkbox", {name: "Passed 0"}))
      .toBeEnabled()

    await page.getByText("Passed").click()

    await expect
      .element(page.getByRole("checkbox", {name: "Passed 0"}))
      .toBeDisabled()
  })

  test("radio options show counts, except the blank option", async () => {
    await render(
      <Panel getFilterOptionCounts={getFilterOptionCounts}>
        <RadioFilter filter={filters.mode} />
      </Panel>,
    )

    await expect
      .element(page.getByRole("radio", {exact: true, name: "All"}))
      .toBeEnabled()
    await expect
      .element(page.getByRole("radio", {name: "Debug 3"}))
      .toBeEnabled()
    await expect
      .element(page.getByRole("radio", {name: "Release 0"}))
      .toBeDisabled()
  })

  test("combobox options show counts", async () => {
    await render(
      <Panel getFilterOptionCounts={getFilterOptionCounts}>
        <ComboboxFilter filter={filters.owner} />
      </Panel>,
    )

    await page.getByRole("combobox", {name: "Owner"}).fill("o")

    await expect
      .element(page.getByRole("option", {name: "Anna Robinson 2"}))
      .toBeVisible()
    await expect
      .element(page.getByRole("option", {name: "Ben Ortiz 0"}))
      .toHaveAttribute("aria-disabled", "true")
  })

  test("select options with no results are disabled", async () => {
    await render(
      <Panel getFilterOptionCounts={getFilterOptionCounts}>
        <SelectFilter filter={filters.standard} />
      </Panel>,
    )

    await page.getByRole("combobox", {name: "Standard"}).click()

    await expect
      .element(page.getByRole("option", {name: "Wi-Fi 7"}))
      .toHaveAttribute("aria-disabled", "true")
  })

  test("counts follow the draft in manual mode", async () => {
    const facetFilter = new FacetFilter(
      [
        {id: "1", status: ["Failed"], user: ["Ana"]},
        {id: "2", status: ["Passed"], user: ["Ben"]},
        {id: "3", status: ["Failed"], user: ["Ben"]},
      ],
      {fields: {status: {}, user: {}}},
    )
    await render(
      <Panel applyMode="manual" {...getFacetFilterPanelProps(facetFilter)}>
        <CheckboxFilter filter={filters.status} />
        <CheckboxFilter filter={filters.user} />
      </Panel>,
    )

    await expect
      .element(page.getByRole("checkbox", {name: "Passed 1"}))
      .toBeEnabled()

    await page.getByText("Ana").click()

    await expect
      .element(page.getByRole("checkbox", {name: "Failed 1"}))
      .toBeEnabled()
    await expect
      .element(page.getByRole("checkbox", {name: "Passed 0"}))
      .toBeDisabled()
  })
})
