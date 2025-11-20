import type {ReactElement} from "react"

import {Pagination} from "@qualcomm-ui/react/pagination"

export function PaginationShowcaseDemo(): ReactElement {
  return (
    // preview
    <Pagination.Root count={120} pageSize={10}>
      <Pagination.PageButtons />
    </Pagination.Root>
    // preview
  )
}
