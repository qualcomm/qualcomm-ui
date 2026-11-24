import {type ReactNode, useState} from "react"

import {describe, expect, test, vi} from "vitest"
import {render} from "vitest-browser-react"
import {page, userEvent} from "vitest/browser"

import {
  defineFilters,
  type FilterOptionObject,
  type FilterValues,
  listFilter,
  rangeFilter,
} from "@qualcomm-ui/core/filters"
import {
  createColumnHelper,
  getCoreRowModel,
  getFilteredRowModel,
} from "@qualcomm-ui/core/table"
import {FilterSetProvider, useFilterSet} from "@qualcomm-ui/react/filters"
import {flexRender, Table, useReactTable} from "@qualcomm-ui/react/table"
import {
  TableColumnFilterAction,
  TableFilterBar,
  type TableFilterBarRootProps,
} from "@qualcomm-ui/react/table-filters"
import {ListCollection} from "@qualcomm-ui/utils/collection"

import {type MultiComponentTestCase, runTests} from "~test-utils/runner"

function list<T extends FilterOptionObject | string>(items: T[]) {
  return new ListCollection<T>({items})
}

const filters = defineFilters({
  duration: rangeFilter({label: "Duration", max: 10, min: 0}),
  owner: listFilter({
    collection: list([
      {label: "Anna Robinson", value: "u1"},
      {label: "Ben Ortiz", value: "u2"},
    ]),
    label: "Owner",
  }),
  region: listFilter({
    collection: list([
      "APAC",
      "EMEA",
      "LATAM",
      "North America",
      "Oceania",
      "South Asia",
    ]),
    label: "Region",
  }),
  status: listFilter({
    collection: list(["Failed", "Passed", "Queued"]),
    label: "Status",
  }),
})

type Values = FilterValues<typeof filters>

const manyRegions: Values = {
  region: ["APAC", "EMEA", "LATAM", "North America", "Oceania", "South Asia"],
}

/**
 * Narrow enough that the chips for `manyRegions` overflow one row, wide enough
 * that a single chip fits beside the triggers.
 */
const narrow = {width: 400}

interface FilterBarTestProps extends Omit<
  TableFilterBarRootProps,
  "children" | "defaultValue"
> {
  defaultValue?: Values
  onValueChange?: (value: Values) => void
}

interface HarnessProps {
  children: ReactNode
  defaultValue?: Values
  onValueChange?: (value: Values) => void
}

/**
 * Hosts the filter bar in a table and a filter set. The "Filter failed runs"
 * button applies a filter from outside the bar.
 */
function Harness({children, defaultValue, onValueChange}: HarnessProps) {
  const filterSet = useFilterSet({defaultValue, filters, onValueChange})
  return (
    <FilterSetProvider value={filterSet}>
      <button
        onClick={() => filterSet.setFilterValue("status", ["Failed"])}
        type="button"
      >
        Filter failed runs
      </button>
      <Table.Root data-test-id="table">{children}</Table.Root>
    </FilterSetProvider>
  )
}

function chip(text: string) {
  return page.getByText(text, {exact: true})
}

function dismissButton(text: string) {
  return page.getByRole("button", {exact: true, name: `Remove ${text}`})
}

const clearAll = () => page.getByRole("button", {name: "Clear all"})
const showMore = () => page.getByRole("button", {name: /^\+\d+ more$/})
const showLess = () => page.getByRole("button", {name: "Show less"})

/**
 * Reads the number of hidden chips from the collapsed expand trigger's label.
 */
async function getHiddenCount(): Promise<number> {
  await expect.element(showMore()).toBeVisible()
  const label = showMore().element().textContent ?? ""
  return Number(/^\+(\d+) more$/.exec(label)?.[1])
}

const filterBarTests: MultiComponentTestCase<FilterBarTestProps>[] = [
  {
    composite({defaultValue, onValueChange, ...props} = {}) {
      return (
        <Harness defaultValue={defaultValue} onValueChange={onValueChange}>
          <TableFilterBar.Root {...props}>
            <TableFilterBar.FilterList>
              <TableFilterBar.ExpandTrigger />
            </TableFilterBar.FilterList>
            <TableFilterBar.ClearTrigger />
          </TableFilterBar.Root>
        </Harness>
      )
    },
    simple({defaultValue, onValueChange, ...props} = {}) {
      return (
        <Harness defaultValue={defaultValue} onValueChange={onValueChange}>
          <TableFilterBar {...props} />
        </Harness>
      )
    },
    testCase(getComponent) {
      test("renders nothing until a filter is applied", async () => {
        await render(getComponent())

        await expect.element(page.getByTestId("table")).toBeEmptyDOMElement()
        await expect.element(clearAll()).not.toBeInTheDocument()

        await page.getByRole("button", {name: "Filter failed runs"}).click()

        await expect.element(chip("Status: Failed")).toBeVisible()
        await expect.element(clearAll()).toBeVisible()
      })

      test("renders a chip per applied value, labeled with the filter and value labels", async () => {
        await render(
          getComponent({
            defaultExpanded: true,
            defaultValue: {
              duration: [2, 5],
              owner: ["u1"],
              status: ["Failed", "Queued"],
            },
          }),
        )

        await expect.element(chip("Duration: 2 – 5")).toBeVisible()
        await expect.element(chip("Owner: Anna Robinson")).toBeVisible()
        await expect.element(chip("Status: Failed")).toBeVisible()
        await expect.element(chip("Status: Queued")).toBeVisible()
        await expect
          .element(page.getByText("Owner: u1", {exact: true}))
          .not.toBeInTheDocument()
      })

      test("dismissing a chip removes only that value", async () => {
        const onValueChange = vi.fn()
        await render(
          getComponent({
            defaultExpanded: true,
            defaultValue: {owner: ["u1"], status: ["Failed", "Queued"]},
            onValueChange,
          }),
        )

        await dismissButton("Status: Queued").click()

        await expect.element(chip("Status: Queued")).not.toBeInTheDocument()
        await expect.element(chip("Status: Failed")).toBeVisible()
        await expect.element(chip("Owner: Anna Robinson")).toBeVisible()
        await expect
          .poll(() => onValueChange.mock.lastCall?.[0])
          .toEqual({owner: ["u1"], status: ["Failed"]})
      })

      test("dismissing a range filter's chip clears that filter", async () => {
        const onValueChange = vi.fn()
        await render(
          getComponent({
            defaultValue: {duration: [2, 5], status: ["Failed"]},
            onValueChange,
          }),
        )

        await dismissButton("Duration: 2 – 5").click()

        await expect.element(chip("Duration: 2 – 5")).not.toBeInTheDocument()
        await expect.element(chip("Status: Failed")).toBeVisible()
        await expect
          .poll(() => onValueChange.mock.lastCall?.[0])
          .toEqual({status: ["Failed"]})
      })

      test("Clear all removes every filter and hides the bar", async () => {
        const onValueChange = vi.fn()
        await render(
          getComponent({
            defaultValue: {
              duration: [2, 5],
              owner: ["u1"],
              status: ["Failed"],
            },
            onValueChange,
          }),
        )

        await clearAll().click()

        await expect.poll(() => onValueChange.mock.lastCall?.[0]).toEqual({})
        await expect.element(page.getByTestId("table")).toBeEmptyDOMElement()
      })

      test("hides the expand trigger while every chip fits on one row", async () => {
        await render(getComponent({defaultValue: {status: ["Failed"]}}))

        await expect.element(chip("Status: Failed")).toBeVisible()
        await expect.element(clearAll()).toBeVisible()
        await expect.element(showMore()).not.toBeInTheDocument()
        await expect.element(showLess()).not.toBeInTheDocument()
      })

      test("the expand trigger toggles between showing more and fewer chips when they overflow", async () => {
        await render(getComponent({defaultValue: manyRegions, style: narrow}))

        const lastChip = chip("Region: South Asia")
        await expect
          .element(showMore())
          .toHaveAttribute("aria-expanded", "false")
        await expect.element(lastChip).not.toBeVisible()

        await showMore().click()

        await expect
          .element(showLess())
          .toHaveAttribute("aria-expanded", "true")
        await expect.element(lastChip).toBeVisible()

        await showLess().click()

        await expect
          .element(showMore())
          .toHaveAttribute("aria-expanded", "false")
        await expect.element(lastChip).not.toBeVisible()
      })

      test("the collapsed expand trigger counts the hidden chips, and every other chip is fully visible", async () => {
        await render(getComponent({defaultValue: manyRegions, style: narrow}))

        const regions = manyRegions.region ?? []
        const hiddenCount = await getHiddenCount()
        const visibleCount = regions.length - hiddenCount
        expect(hiddenCount).toBeGreaterThan(0)
        expect(visibleCount).toBeGreaterThan(0)

        for (const [index, region] of regions.entries()) {
          const regionChip = chip(`Region: ${region}`)
          if (index < visibleCount) {
            await expect.element(regionChip).toBeInViewport({ratio: 1})
          } else {
            await expect.element(regionChip).not.toBeVisible()
          }
        }
      })

      test("hidden chips can't be focused until the filter bar is expanded", async () => {
        await render(getComponent({defaultValue: manyRegions, style: narrow}))

        const regions = manyRegions.region ?? []
        const lastVisibleRegion =
          regions[regions.length - (await getHiddenCount()) - 1]

        await showMore().click()
        await userEvent.tab({shift: true})
        await expect.element(dismissButton("Region: South Asia")).toHaveFocus()

        await userEvent.tab()
        await showLess().click()
        await userEvent.tab({shift: true})
        await expect
          .element(dismissButton(`Region: ${lastVisibleRegion}`))
          .toHaveFocus()
      })

      test("the expand trigger disappears once the remaining chips fit", async () => {
        await render(getComponent({defaultValue: manyRegions, style: narrow}))

        await expect.element(showMore()).toBeVisible()

        for (const region of [
          "APAC",
          "EMEA",
          "LATAM",
          "North America",
          "Oceania",
        ]) {
          await dismissButton(`Region: ${region}`).click()
        }

        await expect.element(chip("Region: South Asia")).toBeInViewport()
        await expect.element(showMore()).not.toBeInTheDocument()
      })

      test("defaultExpanded starts with every chip visible", async () => {
        await render(
          getComponent({
            defaultExpanded: true,
            defaultValue: manyRegions,
            style: narrow,
          }),
        )

        await expect
          .element(showLess())
          .toHaveAttribute("aria-expanded", "true")
        await expect.element(chip("Region: South Asia")).toBeInViewport()
      })

      test("onExpandedChange reports the next expanded state", async () => {
        const onExpandedChange = vi.fn()
        await render(
          getComponent({
            defaultValue: manyRegions,
            onExpandedChange,
            style: narrow,
          }),
        )

        await showMore().click()
        await expect.poll(() => onExpandedChange.mock.lastCall).toEqual([true])

        await showLess().click()
        await expect.poll(() => onExpandedChange.mock.lastCall).toEqual([false])
      })

      test("controlled expanded state only changes when the prop changes", async () => {
        const onExpandedChange = vi.fn()
        await render(
          getComponent({
            defaultValue: manyRegions,
            expanded: true,
            onExpandedChange,
            style: narrow,
          }),
        )

        await expect
          .element(showLess())
          .toHaveAttribute("aria-expanded", "true")

        await showLess().click()

        await expect.poll(() => onExpandedChange.mock.lastCall).toEqual([false])
        await expect
          .element(showLess())
          .toHaveAttribute("aria-expanded", "true")
        await expect.element(chip("Region: South Asia")).toBeInViewport()
      })
    },
  },
]

describe("TableFilterBar", () => {
  runTests(filterBarTests)

  test("expanded follows external state when controlled", async () => {
    function Controlled() {
      const [expanded, setExpanded] = useState(false)
      return (
        <>
          <button onClick={() => setExpanded(true)} type="button">
            Expand filters
          </button>
          <Harness defaultValue={manyRegions}>
            <TableFilterBar
              expanded={expanded}
              onExpandedChange={setExpanded}
              style={narrow}
            />
          </Harness>
        </>
      )
    }
    await render(<Controlled />)

    await expect.element(showMore()).toHaveAttribute("aria-expanded", "false")

    await page.getByRole("button", {name: "Expand filters"}).click()

    await expect.element(showLess()).toHaveAttribute("aria-expanded", "true")
    await expect.element(chip("Region: South Asia")).toBeInViewport()

    await showLess().click()

    await expect.element(showMore()).toHaveAttribute("aria-expanded", "false")
  })
})

interface Run {
  build: string
  owner: string
  status: string
}

const runs: Run[] = [
  {build: "1001", owner: "Anna Robinson", status: "Failed"},
  {build: "1002", owner: "Ben Ortiz", status: "Passed"},
]

const columnHelper = createColumnHelper<Run>()

const columns = [
  columnHelper.accessor("status", {
    filterLabel: "Run status",
    header: "Status",
  }),
  columnHelper.accessor("owner", {header: "Owner"}),
  columnHelper.accessor("build", {enableColumnFilter: false, header: "Build"}),
  columnHelper.display({header: "Actions", id: "actions"}),
]

/**
 * Renders a filter action in every header cell. The "Filter failed runs" and
 * "Clear status filter" buttons change the status column's filter from
 * outside the action.
 */
function RunsTable() {
  /**
   * Specs are compiled with React Compiler, which would cache the header rows
   * against the stable table instance. Opting out renders like an app without
   * the compiler, where every table state change re-renders the headers.
   */
  "use no memo"
  const table = useReactTable({
    columns,
    data: runs,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })
  return (
    <>
      <button
        onClick={() => table.getColumn("status")?.setFilterValue("Failed")}
        type="button"
      >
        Filter failed runs
      </button>
      <button
        onClick={() => table.getColumn("status")?.setFilterValue(undefined)}
        type="button"
      >
        Clear status filter
      </button>
      <Table.Root>
        <Table.ScrollContainer>
          <Table.Table>
            <Table.Header>
              {table.getHeaderGroups().map((headerGroup) => (
                <Table.Row key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <Table.HeaderCell key={header.id} scope="col">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                      <TableColumnFilterAction header={header} />
                    </Table.HeaderCell>
                  ))}
                </Table.Row>
              ))}
            </Table.Header>
            <Table.Body>
              {table.getRowModel().rows.map((row) => (
                <Table.Row key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <Table.Cell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </Table.Cell>
                  ))}
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Table>
        </Table.ScrollContainer>
      </Table.Root>
    </>
  )
}

describe("TableColumnFilterAction", () => {
  test("renders nothing for columns that can't be filtered", async () => {
    await render(<RunsTable />)

    const build = page.getByRole("columnheader", {name: /^Build/})
    const actions = page.getByRole("columnheader", {name: /^Actions/})
    await expect
      .element(page.getByRole("button", {name: "Filter Run status"}))
      .toBeVisible()
    await expect.element(build).toBeVisible()
    await expect.element(actions).toBeVisible()
    await expect.element(build.getByRole("button")).not.toBeInTheDocument()
    await expect.element(actions.getByRole("button")).not.toBeInTheDocument()
  })

  test("is named after the header's column filter label", async () => {
    await render(<RunsTable />)

    await expect
      .element(
        page
          .getByRole("columnheader", {name: /^Status/})
          .getByRole("button", {exact: true, name: "Filter Run status"}),
      )
      .toBeVisible()
    await expect
      .element(
        page
          .getByRole("columnheader", {name: /^Owner/})
          .getByRole("button", {exact: true, name: "Filter Owner"}),
      )
      .toBeVisible()
  })

  test("is marked as filtered while the header's column is filtered", async () => {
    await render(<RunsTable />)

    const statusAction = page.getByRole("button", {name: "Filter Run status"})
    const ownerAction = page.getByRole("button", {name: "Filter Owner"})
    await expect.element(statusAction).not.toHaveAttribute("data-is-filtered")

    await page.getByRole("button", {name: "Filter failed runs"}).click()

    await expect
      .element(page.getByRole("cell", {name: "Ben Ortiz"}))
      .not.toBeInTheDocument()
    await expect.element(statusAction).toHaveAttribute("data-is-filtered")
    await expect.element(ownerAction).not.toHaveAttribute("data-is-filtered")

    await page.getByRole("button", {name: "Clear status filter"}).click()

    await expect
      .element(page.getByRole("cell", {name: "Ben Ortiz"}))
      .toBeVisible()
    await expect.element(statusAction).not.toHaveAttribute("data-is-filtered")
  })

  test("without a header, canFilter shows the action and isFiltered marks it", async () => {
    await render(
      <>
        <TableColumnFilterAction canFilter isFiltered />
        <TableColumnFilterAction />
      </>,
    )

    const action = page.getByRole("button", {exact: true, name: "Filter"})
    await expect.element(action).toBeVisible()
    await expect.element(action).toHaveAttribute("data-is-filtered")
    expect(page.getByRole("button").elements()).toHaveLength(1)
  })
})
