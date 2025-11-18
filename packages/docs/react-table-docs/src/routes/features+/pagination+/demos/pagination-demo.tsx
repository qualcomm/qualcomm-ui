import {useMemo, useState} from "react"

import {Search} from "lucide-react"

import {
  type ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
} from "@qualcomm-ui/core/table"
import {ActionGroup} from "@qualcomm-ui/react/action-group"
import {Button} from "@qualcomm-ui/react/button"
import {Pagination} from "@qualcomm-ui/react/pagination"
import {ProgressRing} from "@qualcomm-ui/react/progress-ring"
import {
  flexRender,
  Table,
  useReactTable,
  useTablePagination,
} from "@qualcomm-ui/react/table"
import {TextInput} from "@qualcomm-ui/react/text-input"
import {CodeHighlight} from "@qualcomm-ui/react-mdx/code-highlight"

import {type User, useUserData} from "./use-data"

export default function PaginationDemo() {
  const columns = useMemo<ColumnDef<User>[]>(
    () => [
      {
        accessorKey: "username",
        header: "Username",
        id: "username",
      },
      {
        accessorKey: "role",
        header: "Role",
        id: "role",
      },
      {
        accessorKey: "accountStatus",
        header: "Account Status",
        id: "accountStatus",
      },
      {
        accessorKey: "createdAt",
        header: "Account Created On",
        id: "createdAt",
        minSize: 205,
      },
      {
        accessorKey: "lastVisitedAt",
        header: "Last Visited At",
        id: "lastVisitedAt",
        minSize: 205,
      },
      {
        accessorKey: "visitCount",
        header: "Visit Count",
        id: "visitCount",
      },
    ],
    [],
  )

  const {data = [], isFetching, refetch} = useUserData(10000)

  const regenerateData = () => refetch()

  const [globalFilter, setGlobalFilter] = useState<string>("")

  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    state: {
      globalFilter,
    },
  })

  const paginationProps = useTablePagination(table)

  return (
    <div className="flex w-full flex-col gap-4">
      <Table.Root>
        <Table.ActionBar>
          <TextInput
            className="w-56"
            inputProps={{
              "aria-label": "Global filter",
            }}
            placeholder="Search..."
            size="sm"
            startIcon={Search}
            value={globalFilter}
          />
          <Button onClick={regenerateData} size="sm" variant="outline">
            Regenerate
          </Button>
          {isFetching ? <ProgressRing size="xs" /> : null}
        </Table.ActionBar>
        <Table.ScrollContainer>
          <Table.Table>
            <Table.Header>
              {table.getHeaderGroups().map((headerGroup) => (
                <Table.Row key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <Table.HeaderCell
                        key={header.id}
                        colSpan={header.colSpan}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </Table.HeaderCell>
                    )
                  })}
                </Table.Row>
              ))}
            </Table.Header>
            <Table.Body>
              {table.getRowModel().rows.map((row) => {
                return (
                  <Table.Row key={row.id}>
                    {row.getVisibleCells().map((cell) => {
                      return (
                        <Table.Cell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </Table.Cell>
                      )
                    })}
                  </Table.Row>
                )
              })}
            </Table.Body>
          </Table.Table>
        </Table.ScrollContainer>
        <Table.Pagination {...paginationProps}>
          <Pagination.PageMetadata>
            {({count, pageEnd, pageStart}) => (
              <>
                {pageStart}-{pageEnd} of {count} results
              </>
            )}
          </Pagination.PageMetadata>
          <ActionGroup>
            <Pagination.PageButtons />
            <Pagination.PageSize options={[10, 20, 50, 100]}>
              <Pagination.PageSizeLabel>Page size</Pagination.PageSizeLabel>
            </Pagination.PageSize>
          </ActionGroup>
        </Table.Pagination>
      </Table.Root>

      <CodeHighlight
        className="w-fit"
        code={JSON.stringify(
          {pagination: table.getState().pagination},
          null,
          2,
        )}
        disableCopy
        language="json"
      />
    </div>
  )
}
