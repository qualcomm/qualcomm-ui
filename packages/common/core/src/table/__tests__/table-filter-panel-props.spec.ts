import {describe, expect, test, vi} from "vitest"

import {createColumnHelper, getTableFilterPanelProps} from "../"

import {createTableHarness, type TestPerson} from "./table-test-utils"

const columnHelper = createColumnHelper<TestPerson>()

describe("getTableFilterPanelProps", () => {
  test("passes the table's column filters through as the value", () => {
    const {table} = createTableHarness({
      initialState: {columnFilters: [{id: "status", value: "single"}]},
    })

    expect(getTableFilterPanelProps(table).value).toEqual([
      {id: "status", value: "single"},
    ])
  })

  test("onValueChange writes to the table's column filters", () => {
    const {table} = createTableHarness()

    getTableFilterPanelProps(table).onValueChange?.([
      {id: "status", value: "single"},
    ])

    expect(table.getState().columnFilters).toEqual([
      {id: "status", value: "single"},
    ])
  })

  test("isEmptyValue uses the column filter function's autoRemove", () => {
    const {table} = createTableHarness()
    const {isEmptyValue} = getTableFilterPanelProps(table)

    // `visits` resolves to the inNumberRange auto filter fn.
    expect(isEmptyValue?.({id: "visits", value: [undefined, ""]})).toBe(true)
    expect(isEmptyValue?.({id: "visits", value: [10, ""]})).toBe(false)
  })

  test("labels resolve from the column", () => {
    const {table} = createTableHarness({
      columns: [
        columnHelper.accessor("status", {
          filterLabel: "Relationship status",
          getFilterOptionLabel: (value) =>
            value === "single" ? "Single" : String(value),
          header: "Status",
        }),
      ],
    })
    const {getFilterLabel, getFilterOptionLabel} =
      getTableFilterPanelProps(table)

    expect(getFilterLabel?.("status")).toBe("Relationship status")
    expect(getFilterOptionLabel?.("status", "single")).toBe("Single")
  })

  test("ids without a matching column fall back without logging", () => {
    const {table} = createTableHarness()
    const error = vi.spyOn(console, "error").mockImplementation(() => {})
    const {getFilterLabel, getFilterOptionLabel, isEmptyValue} =
      getTableFilterPanelProps(table)

    expect(getFilterLabel?.("server-only")).toBeUndefined()
    expect(getFilterOptionLabel?.("server-only", "7d")).toBeUndefined()
    expect(isEmptyValue?.({id: "server-only", value: "7d"})).toBe(false)
    expect(error).not.toHaveBeenCalled()

    error.mockRestore()
  })
})
