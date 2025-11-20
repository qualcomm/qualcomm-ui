import {type ReactElement, useState} from "react"

import {Pagination} from "@qualcomm-ui/react/pagination"

export function PaginationControlledStateDemo(): ReactElement {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  return (
    <Pagination.Root
      count={100}
      onPageChange={(pageValue) => setPage(pageValue)}
      onPageSizeChange={(pageSizeValue) => {
        setPageSize(pageSizeValue)
      }}
      page={page}
      pageSize={pageSize}
    >
      <Pagination.PageSize options={[5, 10, 25, 50]}>
        <Pagination.PageSizeLabel>Items per page:</Pagination.PageSizeLabel>
      </Pagination.PageSize>

      <Pagination.PageButtons />

      <Pagination.PageMetadata>
        {({count, pageEnd, pageStart}) => (
          <span>
            Showing {pageStart}-{pageEnd} of {count} items
          </span>
        )}
      </Pagination.PageMetadata>
    </Pagination.Root>
  )
}
