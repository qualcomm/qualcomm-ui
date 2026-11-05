// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import figma from "@figma/code-connect"

import type {QdsPaginationSize} from "@qualcomm-ui/qds-core/pagination"
import {Pagination} from "@qualcomm-ui/react/pagination"

const FIGMA_URL = "<FIGMA_COMPONENTS_BASE>?node-id=3746-4648"

// Shared props for size (omitting default "sm")
const sharedProps = {
  size: figma.enum<QdsPaginationSize>("size", {
    md: "md",
  }),
}

/**
 * Basic - Simple page buttons only
 */
figma.connect(Pagination.Root, FIGMA_URL, {
  example: ({size}) => (
    <Pagination.Root count={100} defaultPageSize={10} size={size}>
      <Pagination.PageButtons />
    </Pagination.Root>
  ),
  props: sharedProps,
  variant: {variant: "basic"},
})

/**
 * Advanced
 * Layout: [PageSize] [PageMetadata] ... [PageButtons]
 */
figma.connect(Pagination.Root, FIGMA_URL, {
  example: ({pageSize, size}) => (
    <Pagination.Root count={360} defaultPageSize={100} size={size}>
      {pageSize}
      <Pagination.PageMetadata>
        {({count, pageEnd, pageStart}) =>
          `${pageStart} - ${pageEnd} of ${count} results`
        }
      </Pagination.PageMetadata>
      <Pagination.PageButtons />
    </Pagination.Root>
  ),
  props: {
    ...sharedProps,
    pageSize: figma.boolean("itemsPerPage", {
      false: undefined,
      true: (
        <Pagination.PageSize options={[10, 25, 50, 100]}>
          <Pagination.PageSizeLabel>Items per page</Pagination.PageSizeLabel>
        </Pagination.PageSize>
      ),
    }),
  },
  variant: {variant: "advanced"},
})
