import type {ReactElement} from "react"

import {Pagination} from "@qualcomm-ui/react/pagination"

export default function PaginationPageSizeDemo(): ReactElement {
  return (
    // preview
    <Pagination.Root count={120} defaultPageSize={10}>
      <Pagination.PageButtons />
      <Pagination.PageSize options={[10, 20, 50, 100]}>
        <Pagination.PageSizeLabel>Page size</Pagination.PageSizeLabel>
      </Pagination.PageSize>
    </Pagination.Root>
    // preview
  )
}
