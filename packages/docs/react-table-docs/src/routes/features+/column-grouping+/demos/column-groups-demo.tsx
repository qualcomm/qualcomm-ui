import {createColumnHelper, getCoreRowModel} from "@qualcomm-ui/core/table"
import {Button} from "@qualcomm-ui/react/button"
import {ProgressRing} from "@qualcomm-ui/react/progress-ring"
import {flexRender, Table, useReactTable} from "@qualcomm-ui/react/table"

import {type User, useUserData} from "./use-data"

const columnHelper = createColumnHelper<User>()

const columns = [
  columnHelper.group({
    columns: [
      columnHelper.accessor("username", {
        header: "Username",
      }),
      columnHelper.accessor("companyName", {
        header: "Company Name",
      }),
    ],
    header: () => "User Identification",
    id: "userData",
  }),
  columnHelper.group({
    columns: [
      columnHelper.accessor("lastVisitedAt", {
        header: "Last Visited At",
      }),
      columnHelper.accessor("role", {
        header: "Role",
      }),
      columnHelper.accessor("visitCount", {
        header: "Visit Count",
      }),
      columnHelper.accessor("accountStatus", {
        header: "Account Status",
      }),
    ],
    header: "User Info",
  }),
]

export default function ColumnGroupsDemo() {
  const {data = [], isFetching, refetch} = useUserData(10)

  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="w-full p-2">
      <Table.Root>
        <Table.ActionBar>
          <Button onClick={() => refetch()} variant="outline">
            Regenerate
          </Button>
          {isFetching ? <ProgressRing size="xs" /> : null}
        </Table.ActionBar>
        <Table.ScrollContainer>
          <Table.Table>
            <Table.Header>
              {table.getHeaderGroups().map((headerGroup) => (
                <Table.Row key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <Table.HeaderCell
                      key={header.id}
                      className="text-center"
                      colSpan={header.colSpan}
                    >
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
    </div>
  )
}
