import type {ReactElement} from "react"

import {Pagination} from "@qualcomm-ui/react/pagination"

export function PaginationMetadataDemo(): ReactElement {
  return (
    <div className="flex flex-col">
      <div className="text-neutral-primary font-heading-xxs mb-2">Default</div>
      <Pagination.Root count={115} pageSize={10}>
        <Pagination.PageMetadata />
        <Pagination.PageButtons />
      </Pagination.Root>

      <div className="text-neutral-primary font-heading-xxs mt-4 mb-2">
        Customized
      </div>
      <Pagination.Root count={115} pageSize={10}>
        <Pagination.PageMetadata>
          {({count, page, pageCount, pageEnd, pageStart}) => (
            <div className="flex gap-2">
              <span>
                {pageStart}-{pageEnd} of {count}
              </span>
              <span>
                (page {page} of {pageCount})
              </span>
            </div>
          )}
        </Pagination.PageMetadata>
        <Pagination.PageButtons />
      </Pagination.Root>
    </div>
  )
}
