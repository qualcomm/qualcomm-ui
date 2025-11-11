import type {ReactElement} from "react"

import {Pagination} from "@qualcomm-ui/react/pagination"

export default function PaginationSizesDemo(): ReactElement {
  return (
    <div className="flex flex-col gap-4">
      <Pagination.Root count={120} defaultPageSize={10} size="sm">
        <Pagination.PageButtons />
        <Pagination.PageSize options={[10, 20, 50, 100]}>
          <Pagination.PageSizeLabel>Page size</Pagination.PageSizeLabel>
        </Pagination.PageSize>
      </Pagination.Root>

      <Pagination.Root count={120} defaultPageSize={10} size="md">
        <Pagination.PageButtons />
        <Pagination.PageSize options={[10, 20, 50, 100]}>
          <Pagination.PageSizeLabel>Page size</Pagination.PageSizeLabel>
        </Pagination.PageSize>
      </Pagination.Root>
    </div>
  )
}
