import {useMemo, useState} from "react"

import {useQuery} from "@tanstack/react-query"

import {getCoreRowModel, type PaginationState} from "@qualcomm-ui/core/table"
import {CodeHighlight} from "@qualcomm-ui/react-mdx/code-highlight"
import {Pagination} from "@qualcomm-ui/react/pagination"
import {ProgressRing} from "@qualcomm-ui/react/progress-ring"
import {
  flexRender,
  Table,
  useReactTable,
  useTablePagination,
} from "@qualcomm-ui/react/table"

import {fetchData, userColumns} from "./use-data"

export default function PaginationControlledDemo() {
  const [{pageIndex, pageSize}, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  const pagination = useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize],
  )

  const {data, fetchStatus, isFetching} = useQuery({
    placeholderData: (previousData) => previousData,
    queryFn: () => fetchData(pagination),
    queryKey: ["data", pagination],
  })

  const table = useReactTable({
    columns: userColumns,
    data: useMemo(() => data?.users ?? [], [data?.users]),
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    onPaginationChange: setPagination,
    pageCount: data?.pageCount,
    state: {
      pagination,
    },
  })

  const paginationProps = useTablePagination(table, {
    totalCount: data?.totalUsers,
  })

  return (
    <div className="flex w-full flex-col gap-4 p-2">
      <Table.Root>
        <Table.ActionBar>
          <div className="text-neutral-primary font-body-sm flex items-center gap-1">
            <span>Query:</span>
            <span>{fetchStatus}</span>{" "}
            {isFetching ? <ProgressRing className="ml-1" size="xs" /> : null}
          </div>
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
                        style={{width: header.getSize()}}
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
                {!data?.pageCount ? (
                  <ProgressRing size="xs" />
                ) : (
                  `${pageStart}-${pageEnd} of ${count} results`
                )}
              </>
            )}
          </Pagination.PageMetadata>
          <Pagination.PageButtons />
        </Table.Pagination>
      </Table.Root>

      <CodeHighlight
        className="w-fit"
        code={JSON.stringify({pagination}, null, 2)}
        disableCopy
        language="json"
      />
    </div>
  )
}
