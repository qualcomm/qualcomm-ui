import type {ReactElement} from "react"

import {Pagination} from "@qualcomm-ui/react/pagination"

export default function PaginationRangesDemo(): ReactElement {
  return (
    <div className="grid justify-center gap-4">
      <Pagination.Root count={12} defaultPage={6} siblingCount={0}>
        <Pagination.PageButtons />
      </Pagination.Root>

      {/* Default */}
      <Pagination.Root count={12} defaultPage={6}>
        <Pagination.PageButtons />
      </Pagination.Root>

      <Pagination.Root count={12} defaultPage={6} siblingCount={2}>
        <Pagination.PageButtons />
      </Pagination.Root>
    </div>
  )
}
