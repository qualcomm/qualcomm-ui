import {Fragment} from "react"

import {
  type ColumnDef,
  getCoreRowModel,
  getExpandedRowModel,
  type Row,
} from "@qualcomm-ui/core/table"
import {CodeHighlight} from "@qualcomm-ui/react-mdx/code-highlight"
import {Button} from "@qualcomm-ui/react/button"
import {ProgressRing} from "@qualcomm-ui/react/progress-ring"
import {flexRender, Table, useReactTable} from "@qualcomm-ui/react/table"

import {type User, useUserData} from "./use-data"

const columns: ColumnDef<User>[] = [
  {
    cell: ({row}) => {
      return !row.getCanExpand() ? (
        ""
      ) : (
        <div className="inline-flex items-center justify-center">
          <Table.RowExpandButton row={row} />
        </div>
      )
    },
    header: () => null,
    id: "expander",
    minSize: 52,
  },
  {
    accessorKey: "username",
    cell: ({getValue, row}) => (
      <div
        style={{
          // Since rows are flattened by default,
          // we can use the row.depth property
          // and paddingLeft to visually indicate the depth
          // of the row
          paddingLeft: `${row.depth * 2}rem`,
        }}
      >
        {getValue<string>()}
      </div>
    ),
    header: "Username",
  },
  {
    accessorKey: "accountStatus",
    header: "Account Status",
    id: "accountStatus",
  },
  {
    accessorKey: "role",
    header: "Role",
    id: "role",
    size: 120,
  },
  {
    accessorKey: "averageSessionDuration",
    header: "Avg Session Duration",
    id: "averageSessionDuration",
  },
  {
    accessorKey: "companyName",
    header: "Company Name",
    id: "companyName",
    minSize: 200,
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
]

const renderSubComponent = ({row}: {row: Row<User>}) => {
  return (
    <CodeHighlight
      className="w-fit"
      code={JSON.stringify(row.original, null, 2)}
      disableCopy
      language="json"
      preProps={{style: {background: "transparent"}}}
    />
  )
}

export default function SubComponentsDemo() {
  const {data = [], isFetching, refetch} = useUserData(10)

  const refreshData = () => refetch()

  const table = useReactTable<User>({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getRowCanExpand: () => true,
  })

  return (
    <Table.Root>
      <Table.ActionBar>
        <Button onClick={refreshData} variant="outline">
          Refresh Data
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
                      style={{minWidth: header.column.columnDef.minSize}}
                    >
                      {header.isPlaceholder ? null : (
                        <div>
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                        </div>
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
                <Fragment key={row.id}>
                  <Table.Row>
                    {/* first row is a normal row */}
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
                  {row.getIsExpanded() && (
                    <Table.Row>
                      {/* Expanded row contains a single cell that
                          spans the entire length of the table */}
                      <Table.Cell colSpan={row.getVisibleCells().length}>
                        {renderSubComponent({row})}
                      </Table.Cell>
                    </Table.Row>
                  )}
                </Fragment>
              )
            })}
          </Table.Body>
        </Table.Table>
      </Table.ScrollContainer>
    </Table.Root>
  )
}
