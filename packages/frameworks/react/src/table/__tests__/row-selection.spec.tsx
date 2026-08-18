import {useMemo} from "react"

import {
  type ColumnDef,
  getCoreRowModel,
  getExpandedRowModel,
  type RowSelectionState,
} from "@qualcomm-ui/core/table"
import {useReactTable} from "@qualcomm-ui/react/table"
import {describe, expect, test, vi} from "vitest"
import {page} from "vitest/browser"
import {render} from "vitest-browser-react"

import {makeGuideUsers, makeHierarchicalGuideUsers, type GuideUser} from "./fixtures"
import {useControlledState} from "./state"
import {GuideTable} from "./table-view"

interface SelectionExampleProps {
  nested?: boolean
  onRowSelectionChange?: (selection: RowSelectionState) => void
  single?: boolean
}

function SelectionExample({
  nested = false,
  onRowSelectionChange,
  single = false,
}: SelectionExampleProps) {
  const data = useMemo(
    () => (nested ? makeHierarchicalGuideUsers() : makeGuideUsers()),
    [nested],
  )
  const [rowSelection, setRowSelection] = useControlledState<RowSelectionState>(
    {},
    onRowSelectionChange,
  )
  const columns = useMemo<ColumnDef<GuideUser>[]>(
    () => [
      {
        cell: ({row}) => (
          <input
            aria-label={`Select ${row.original.name}`}
            checked={row.getIsSelected()}
            disabled={!row.getCanSelect()}
            onChange={(event) => row.toggleSelected(event.currentTarget.checked)}
            type="checkbox"
          />
        ),
        header: ({table}) => (
          <input
            aria-label="Select all users"
            checked={table.getIsAllRowsSelected()}
            onChange={(event) =>
              table.toggleAllRowsSelected(event.currentTarget.checked)
            }
            type="checkbox"
          />
        ),
        id: "select",
      },
      {
        accessorKey: "name",
        cell: (info) => String(info.getValue()),
        header: "Name",
        id: "name",
      },
    ],
    [],
  )
  const table = useReactTable({
    columns,
    data,
    enableMultiRowSelection: !single,
    enableRowSelection: (row) => row.original.role !== "Guest",
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: nested ? getExpandedRowModel() : undefined,
    getRowId: (row) => row.id,
    getSubRows: nested ? (row) => row.children : undefined,
    onRowSelectionChange: setRowSelection,
    state: {
      expanded: nested ? true : undefined,
      rowSelection,
    },
  })

  return <GuideTable label="Row selection" table={table} />
}

describe("Row Selection Guide", () => {
  test("selects a row and publishes its stable row ID", async () => {
    const onRowSelectionChange = vi.fn()

    await render(
      <SelectionExample onRowSelectionChange={onRowSelectionChange} />,
    )

    const ada = page.getByRole("checkbox", {name: "Select Ada Lovelace"})
    await ada.click()

    await expect.element(ada).toBeChecked()
    await expect.poll(() => onRowSelectionChange).toHaveBeenLastCalledWith({
      ada: true,
    })
  })

  test("selects all eligible rows without selecting a disabled row", async () => {
    await render(<SelectionExample />)

    await page.getByRole("checkbox", {name: "Select all users"}).click()

    await expect
      .element(page.getByRole("checkbox", {name: "Select Ada Lovelace"}))
      .toBeChecked()
    await expect
      .element(page.getByRole("checkbox", {name: "Select Linus Torvalds"}))
      .toBeDisabled()
    await expect
      .element(page.getByRole("checkbox", {name: "Select Linus Torvalds"}))
      .not.toBeChecked()
  })

  test("replaces the selection in single-selection mode", async () => {
    await render(<SelectionExample single />)

    const ada = page.getByRole("checkbox", {name: "Select Ada Lovelace"})
    const alice = page.getByRole("checkbox", {name: "Select Alice Johnson"})

    await ada.click()
    await alice.click()

    await expect.element(ada).not.toBeChecked()
    await expect.element(alice).toBeChecked()
  })

  test("selects child rows when a selectable parent is selected", async () => {
    await render(<SelectionExample nested />)

    await page.getByRole("checkbox", {name: "Select Ada Lovelace"}).click()

    await expect
      .element(page.getByRole("checkbox", {name: "Select Mina Lovelace"}))
      .toBeChecked()
    await expect
      .element(page.getByRole("checkbox", {name: "Select Noah Lovelace"}))
      .toBeDisabled()
  })
})
