import {useMemo} from "react"

import {createColumnHelper, getCoreRowModel} from "@qualcomm-ui/core/table"
import {flexRender, Table, useReactTable} from "@qualcomm-ui/react/table"

interface User {
  accountStatus: string
  averageSessionDuration: number
  country: string
  lastVisitedAt: string
  role: string
  username: string
}

const columnHelper = createColumnHelper<User>()

export function BasicDemo() {
  // always memoize your data
  const defaultData: User[] = useMemo(
    () => [
      {
        accountStatus: "active",
        averageSessionDuration: 12,
        country: "US",
        lastVisitedAt: "02 Sep 2025 07:21:43 PDT",
        role: "user",
        username: "john_pond1",
      },
      {
        accountStatus: "suspended",
        averageSessionDuration: 35,
        country: "US",
        lastVisitedAt: "02 Oct 2025 08:52:36 PDT",
        role: "user",
        username: "anne.m15",
      },
      {
        accountStatus: "pending",
        averageSessionDuration: 0,
        country: "US",
        lastVisitedAt: "19 Mar 2025 04:55:19 PDT",
        role: "admin",
        username: "joe_dirte",
      },
    ],
    [],
  )

  // always memoize your columns
  const columns = useMemo(
    () => [
      columnHelper.accessor("username", {
        cell: (info) => info.getValue(),
        header: () => "Username",
      }),
      columnHelper.accessor((row) => row.accountStatus, {
        cell: (info) => <i>{info.getValue()}</i>,
        header: "Account Status",
      }),
      columnHelper.accessor("country", {
        cell: (info) => info.getValue(),
        header: "Country",
      }),
      columnHelper.accessor("lastVisitedAt", {
        header: "Last Visited",
      }),
      columnHelper.accessor("role", {
        header: "Role",
      }),
      columnHelper.accessor("averageSessionDuration", {
        header: "Avg Session Duration",
      }),
    ],
    [],
  )

  const table = useReactTable({
    columns,
    data: defaultData,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <Table.Root>
      <Table.ScrollContainer>
        <Table.Table>
          <Table.Header>
            {table.getHeaderGroups().map((headerGroup) => (
              <Table.Row key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <Table.HeaderCell key={header.id} align="left">
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
      </Table.ScrollContainer>
    </Table.Root>
  )
}
