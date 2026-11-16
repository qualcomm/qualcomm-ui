import {describe, expect, test} from "vitest"

import {createColumnHelper} from "../"

import {createTableHarness, type TestPerson} from "./table-test-utils"

const columnHelper = createColumnHelper<TestPerson>()

describe("column filter labels", () => {
  test("getFilterLabel prefers filterLabel, then a string header, then the id", () => {
    const {table} = createTableHarness({
      columns: [
        columnHelper.accessor("status", {
          filterLabel: "Relationship status",
          header: "Status",
        }),
        columnHelper.accessor("firstName", {header: "First Name"}),
        columnHelper.accessor("lastName", {
          header: () => "Last Name",
          id: "lastName",
        }),
      ],
    })

    expect(table.getColumn("status")?.getFilterLabel()).toBe(
      "Relationship status",
    )
    expect(table.getColumn("firstName")?.getFilterLabel()).toBe("First Name")
    expect(table.getColumn("lastName")?.getFilterLabel()).toBe("lastName")
  })

  test("getFilterOptionLabel uses the column def resolver when provided", () => {
    const labels: Record<string, string> = {
      complicated: "It's complicated",
      single: "Single",
    }
    const {table} = createTableHarness({
      columns: [
        columnHelper.accessor("status", {
          getFilterOptionLabel: (value) => labels[value as string] ?? "",
          header: "Status",
        }),
      ],
    })

    expect(table.getColumn("status")?.getFilterOptionLabel("single")).toBe(
      "Single",
    )
  })

  test("getFilterOptionLabel stringifies primitives and returns an empty string otherwise", () => {
    const {table} = createTableHarness({
      columns: [columnHelper.accessor("visits", {header: "Visits"})],
    })
    const column = table.getColumn("visits")

    expect(column?.getFilterOptionLabel(12)).toBe("12")
    expect(column?.getFilterOptionLabel(true)).toBe("true")
    expect(column?.getFilterOptionLabel(null)).toBe("")
    expect(column?.getFilterOptionLabel(undefined)).toBe("")
    expect(column?.getFilterOptionLabel({id: 1})).toBe("")
  })
})
