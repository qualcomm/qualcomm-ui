import {type ReactNode, useState} from "react"

import {describe, expect, test, vi} from "vitest"
import {render} from "vitest-browser-react"
import {page, userEvent} from "vitest/browser"

import {
  type FilterSetApiProps,
  type FilterSetApplyMode,
  getFacetFilterSetProps,
} from "@qualcomm-ui/core/filter-set"
import {
  dateFilter,
  defineFilters,
  type FilterValues,
  optionFilter,
  rangeFilter,
  textFilter,
} from "@qualcomm-ui/core/filters"
import {createTreeCollection} from "@qualcomm-ui/core/tree"
import {FilterPanel} from "@qualcomm-ui/react/filter-panel"
import {
  CheckboxGroupFilter,
  CheckboxTreeFilter,
  ComboboxFilter,
  DateFilter,
  FilterProvider,
  FilterSetProvider,
  RadioGroupFilter,
  SelectFilter,
  SliderFilter,
  TextInputFilter,
  useFilterSet,
} from "@qualcomm-ui/react/filters"
import {FacetFilter} from "@qualcomm-ui/utils/facet-filter"

import {type MultiComponentTestCase, runTests} from "~test-utils/runner"

const filters = defineFilters({
  buildPath: textFilter({label: "Build path"}),
  chipset: optionFilter({label: "Chipset"}),
  duration: rangeFilter({label: "Duration", max: 10, min: 0}),
  mode: optionFilter({
    label: "Mode",
    options: [
      {label: "All", value: ""},
      {label: "Debug", value: "debug"},
      {label: "Release", value: "release"},
    ],
  }),
  owner: optionFilter({
    label: "Owner",
    options: [
      {label: "Anna Robinson", value: "u1"},
      {label: "Ben Ortiz", value: "u2"},
    ],
  }),
  standard: optionFilter({
    label: "Standard",
    options: [
      {label: "Wi-Fi 6", value: "wifi6"},
      {label: "Wi-Fi 7", value: "wifi7"},
    ],
  }),
  status: optionFilter({
    label: "Status",
    options: ["Failed", "Passed", "Queued"],
  }),
  submitted: dateFilter({
    label: "Submitted",
    presets: [{label: "Last 7 days", value: "last7Days"}],
  }),
  user: optionFilter({label: "User"}),
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
  FilterSetApiProps,
  "getFilterOptionCounts" | "getFilterOptions"
> {
  applyMode?: FilterSetApplyMode
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

const filterTests: MultiComponentTestCase[] = [
  {
    composite() {
      return (
        <Panel defaultValue={{status: ["Failed"]}}>
          <FilterPanel.FilterRoot filter={filters.status}>
            <FilterPanel.FilterTrigger>
              <FilterPanel.FilterLabel />
              <FilterPanel.FilterCount />
              <FilterPanel.FilterIndicator />
            </FilterPanel.FilterTrigger>
            <FilterPanel.FilterContent>
              <CheckboxGroupFilter />
            </FilterPanel.FilterContent>
          </FilterPanel.FilterRoot>
        </Panel>
      )
    },
    simple() {
      return (
        <Panel defaultValue={{status: ["Failed"]}}>
          <FilterPanel.Filter filter={filters.status}>
            <CheckboxGroupFilter />
          </FilterPanel.Filter>
        </Panel>
      )
    },
    testCase(getComponent) {
      test("the trigger names the control and collapses and expands its content", async () => {
        await render(getComponent())

        const trigger = page.getByRole("button", {name: "Status 1 selected"})
        await expect.element(trigger).toHaveAttribute("aria-expanded", "true")
        await expect
          .element(page.getByRole("group", {name: "Status"}))
          .toBeVisible()

        await trigger.click()
        await expect.element(trigger).toHaveAttribute("aria-expanded", "false")
        await expect.element(page.getByText("Failed")).not.toBeVisible()

        await trigger.click()
        await expect.element(page.getByText("Failed")).toBeVisible()
      })
    },
  },
]

describe("FilterPanel.Filter", () => {
  runTests(filterTests)
})

describe("filter panel", () => {
  test("manual mode stages changes until they are applied", async () => {
    const onValueChange = vi.fn()
    await render(
      <Panel applyMode="manual" onValueChange={onValueChange}>
        <FilterPanel.Filter filter={filters.status}>
          <CheckboxGroupFilter />
        </FilterPanel.Filter>
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
            <FilterPanel.Filter filter={filters.status}>
              <CheckboxGroupFilter />
            </FilterPanel.Filter>
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
      const filterSet = useFilterSet({
        applyMode: "manual",
        filters,
        onValueChange: setValue,
        value,
      })
      dirtyRenders.push(filterSet.isDirty)
      return (
        <>
          <button onClick={() => setValue({status: ["Passed"]})} type="button">
            Show passed
          </button>
          <FilterPanel.RootProvider value={filterSet}>
            <FilterPanel.Filter filter={filters.status}>
              <CheckboxGroupFilter />
            </FilterPanel.Filter>
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
        <FilterPanel.Filter filter={filters.status}>
          <CheckboxGroupFilter />
        </FilterPanel.Filter>
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
        <FilterPanel.Filter filter={filters.status}>
          <CheckboxGroupFilter />
        </FilterPanel.Filter>
        <FilterPanel.Filter filter={filters.buildPath}>
          <TextInputFilter />
        </FilterPanel.Filter>
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
        <FilterPanel.Filter filter={filters.status}>
          <CheckboxGroupFilter />
        </FilterPanel.Filter>
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

  test("labels the control with the filter label, which the label prop can render differently", async () => {
    await render(
      <Panel>
        <FilterPanel.Filter
          filter={filters.status}
          label={(label) => <em>{label} (runs)</em>}
        >
          <CheckboxGroupFilter />
        </FilterPanel.Filter>
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
        <FilterPanel.Filter filter={filters.user}>
          <CheckboxGroupFilter
            options={[{label: "Anna Robinson", value: "u1"}]}
          />
        </FilterPanel.Filter>
      </Panel>,
    )

    await expect.element(page.getByLabelText("Anna Robinson")).toBeVisible()
  })

  test("selected values missing from the options stay visible", async () => {
    await render(
      <Panel defaultValue={{status: ["Cancelled"]}}>
        <FilterPanel.Filter filter={filters.status}>
          <CheckboxGroupFilter />
        </FilterPanel.Filter>
      </Panel>,
    )

    await expect.element(page.getByLabelText("Cancelled")).toBeChecked()
  })
})

describe("RootProvider", () => {
  test("shares committed values and recorded option labels outside the panel", async () => {
    const onValueChange = vi.fn()

    function Example() {
      const filterSet = useFilterSet({
        applyMode: "manual",
        filters,
        onValueChange,
      })
      const [open, setOpen] = useState(true)
      const committed = filterSet.value.user ?? []

      return (
        <>
          <ul aria-label="Active filters">
            {committed.map((value) => (
              <li key={value}>
                {filterSet.getFilterOptionLabel("user", value)}
              </li>
            ))}
          </ul>
          <button onClick={() => setOpen((prev) => !prev)} type="button">
            Toggle panel
          </button>
          {open ? (
            <FilterPanel.RootProvider value={filterSet}>
              <FilterPanel.Filter filter={filters.user}>
                <CheckboxGroupFilter
                  options={[{label: "Anna Robinson", value: "u1"}]}
                />
              </FilterPanel.Filter>
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
      const filterSet = useFilterSet({applyMode: "manual", filters})
      return (
        <>
          <output aria-label="Applied">{filterSet.valueCount}</output>
          <output aria-label="Pending">{filterSet.draftValueCount}</output>
          <FilterPanel.RootProvider value={filterSet}>
            <FilterPanel.Filter filter={filters.status}>
              <CheckboxGroupFilter />
            </FilterPanel.Filter>
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
        <FilterPanel.Filter filter={filters.mode}>
          <RadioGroupFilter />
        </FilterPanel.Filter>
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
        <FilterPanel.Filter filter={filters.standard}>
          <SelectFilter />
        </FilterPanel.Filter>
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
        <FilterPanel.Filter filter={filters.buildPath}>
          <TextInputFilter />
        </FilterPanel.Filter>
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
        <FilterPanel.Filter filter={filters.buildPath}>
          <TextInputFilter debounce={50} />
        </FilterPanel.Filter>
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
        <FilterPanel.Filter filter={filters.duration}>
          <SliderFilter />
        </FilterPanel.Filter>
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
        <FilterPanel.Filter filter={filters.submitted}>
          <DateFilter />
        </FilterPanel.Filter>
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
        <FilterPanel.Filter filter={filters.owner}>
          <ComboboxFilter />
        </FilterPanel.Filter>
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
        <FilterPanel.Filter filter={filters.chipset}>
          <CheckboxTreeFilter
            collection={chipsets}
            defaultExpandedValue={["x"]}
          />
        </FilterPanel.Filter>
      </Panel>,
    )

    await page.getByRole("treeitem", {name: "SC8380XP"}).click()

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
        <FilterPanel.Filter filter={filters.status}>
          <CheckboxGroupFilter />
        </FilterPanel.Filter>
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
        <FilterPanel.Filter filter={filters.mode}>
          <RadioGroupFilter />
        </FilterPanel.Filter>
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

  test("combobox options with no results are disabled", async () => {
    await render(
      <Panel getFilterOptionCounts={getFilterOptionCounts}>
        <FilterPanel.Filter filter={filters.owner}>
          <ComboboxFilter />
        </FilterPanel.Filter>
      </Panel>,
    )

    await page.getByRole("combobox", {name: "Owner"}).fill("o")

    await expect
      .element(page.getByRole("option", {exact: true, name: "Anna Robinson"}))
      .toBeVisible()
    await expect
      .element(page.getByRole("option", {exact: true, name: "Ben Ortiz"}))
      .toHaveAttribute("aria-disabled", "true")
  })

  test("select options with no results are disabled", async () => {
    await render(
      <Panel getFilterOptionCounts={getFilterOptionCounts}>
        <FilterPanel.Filter filter={filters.standard}>
          <SelectFilter />
        </FilterPanel.Filter>
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
      <Panel applyMode="manual" {...getFacetFilterSetProps(facetFilter)}>
        <FilterPanel.Filter filter={filters.status}>
          <CheckboxGroupFilter />
        </FilterPanel.Filter>
        <FilterPanel.Filter filter={filters.user}>
          <CheckboxGroupFilter />
        </FilterPanel.Filter>
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

describe("outside a filter panel", () => {
  test("a widget reads and writes the filter set through FilterProvider", async () => {
    function Example() {
      const filterSet = useFilterSet({filters})
      return (
        <FilterSetProvider value={filterSet}>
          <output aria-label="Selected">
            {(filterSet.value.status ?? []).join(", ")}
          </output>
          <FilterProvider filter={filters.status}>
            <CheckboxGroupFilter />
          </FilterProvider>
        </FilterSetProvider>
      )
    }
    await render(<Example />)

    const group = page.getByRole("group", {name: "Status"})
    await expect.element(group).toBeVisible()

    await group.getByText("Queued").click()

    await expect.element(group.getByLabelText("Queued")).toBeChecked()
    await expect
      .element(page.getByLabelText("Selected"))
      .toHaveTextContent("Queued")
  })

  test("a labelId names the widget by the referenced element", async () => {
    function Example() {
      const filterSet = useFilterSet({filters})
      return (
        <FilterSetProvider value={filterSet}>
          <span id="status-heading">Run status</span>
          <FilterProvider filter={filters.status} labelId="status-heading">
            <CheckboxGroupFilter />
          </FilterProvider>
        </FilterSetProvider>
      )
    }
    await render(<Example />)

    await expect
      .element(page.getByRole("group", {name: "Run status"}))
      .toBeVisible()
  })

  test("shares values with a filter panel on the same filter set", async () => {
    function Example() {
      const filterSet = useFilterSet({filters})
      return (
        <>
          <FilterSetProvider value={filterSet}>
            <FilterProvider filter={filters.mode}>
              <RadioGroupFilter />
            </FilterProvider>
          </FilterSetProvider>
          <FilterPanel.RootProvider value={filterSet}>
            <FilterPanel.Heading>
              Filters <FilterPanel.Count />
            </FilterPanel.Heading>
            <FilterPanel.Filter filter={filters.status}>
              <CheckboxGroupFilter />
            </FilterPanel.Filter>
          </FilterPanel.RootProvider>
        </>
      )
    }
    await render(<Example />)

    await page.getByText("Debug").click()
    await page.getByText("Failed").click()

    await expect
      .element(page.getByRole("heading", {name: "Filters 2 selected"}))
      .toBeVisible()
  })

  test("warns when a widget renders a filter of another kind", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {})
    function Example() {
      const filterSet = useFilterSet({filters})
      return (
        <FilterSetProvider value={filterSet}>
          <FilterProvider filter={filters.buildPath}>
            <CheckboxGroupFilter />
          </FilterProvider>
        </FilterSetProvider>
      )
    }
    await render(<Example />)

    await expect
      .poll(() => warn.mock.calls.map(([message]) => String(message)))
      .toContainEqual(expect.stringContaining("CheckboxGroupFilter"))
    warn.mockRestore()
  })
})
