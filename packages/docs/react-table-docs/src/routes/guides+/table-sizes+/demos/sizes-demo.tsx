import type {ReactNode} from "react"

import {
  createColumnHelper,
  getCoreRowModel,
  type TableInstance,
} from "@qualcomm-ui/core/table"
import {flexRender, Table, useReactTable} from "@qualcomm-ui/react/table"

interface Person {
  age: number
  firstName: string
  lastName: string
  progress: number
  status: string
  visits: number
}

const defaultData: Person[] = [
  {
    age: 24,
    firstName: "tanner",
    lastName: "linsley",
    progress: 50,
    status: "In Relationship",
    visits: 100,
  },
  {
    age: 40,
    firstName: "tandy",
    lastName: "miller",
    progress: 80,
    status: "Single",
    visits: 40,
  },
  {
    age: 45,
    firstName: "joe",
    lastName: "dirte",
    progress: 10,
    status: "Complicated",
    visits: 20,
  },
]

const columnHelper = createColumnHelper<Person>()

const columns = [
  columnHelper.accessor("firstName", {
    cell: (info) => info.getValue(),
    footer: (info) => info.column.id,
    header: () => "First Name",
  }),
  columnHelper.accessor((row) => row.lastName, {
    cell: (info) => <i>{info.getValue()}</i>,
    footer: (info) => info.column.id,
    header: "Last Name",
    id: "lastName",
  }),
  columnHelper.accessor("age", {
    cell: (info) => info.getValue(),
    footer: (info) => info.column.id,
    header: "Age",
  }),
  columnHelper.accessor("visits", {
    footer: (info) => info.column.id,
    header: "Visits",
  }),
  columnHelper.accessor("status", {
    footer: (info) => info.column.id,
    header: "Status",
  }),
  columnHelper.accessor("progress", {
    footer: (info) => info.column.id,
    header: "Profile Progress",
  }),
]

interface Props {
  table: TableInstance<Person>
}

function TableBody({table}: Props) {
  return (
    <Table.Table>
      <Table.Header>
        {table.getHeaderGroups().map((headerGroup) => (
          <Table.Row key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <Table.HeaderCell key={header.id}>
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
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
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </Table.Cell>
            ))}
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Table>
  )
}

export function SizesDemo(): ReactNode {
  const table = useReactTable({
    columns,
    data: defaultData,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="flex flex-col gap-4">
      <Table.Root size="sm">
        <TableBody table={table} />
      </Table.Root>

      <Table.Root>
        <TableBody table={table} />
      </Table.Root>

      <Table.Root size="lg">
        <TableBody table={table} />
      </Table.Root>
    </div>
  )
}
