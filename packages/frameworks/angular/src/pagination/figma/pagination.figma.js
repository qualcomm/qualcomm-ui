// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

// url=<FIGMA_COMPONENTS_BASE>?node-id=3746-4648
// component=Pagination

const figma = require("figma")

const instance = figma.selectedInstance

const isAdvanced = instance.getEnum("variant", {advanced: true})
const size = instance.getEnum("size", {
  md: "md",
})
const itemsPerPage = instance.getBoolean("itemsPerPage")

const sizeAttr = size ? ` size="${size}"` : ""
const count = isAdvanced ? "360" : "100"
const defaultPageSize = isAdvanced ? "100" : "10"

const pageMetadata = isAdvanced
  ? `
      <span *paginationContext="let context" q-pagination-page-metadata>
        @let meta = context.pageMetadata;
        {{ meta.pageStart }} - {{ meta.pageEnd }} of {{ meta.count }} results
      </span>`
  : ""

const pageSize =
  isAdvanced && itemsPerPage
    ? `
      <div q-pagination-page-size [options]="[10, 25, 50, 100]">
        <span q-pagination-page-size-label>Items per page</span>
      </div>`
    : ""

export default {
  example: figma.code`
    <div count="${count}" defaultPageSize="${defaultPageSize}" q-pagination-root${sizeAttr}>${pageSize}${pageMetadata}
      <div q-pagination-page-buttons></div>
    </div>`,
  id: "Pagination",
  imports: [`import {PaginationModule} from "@qualcomm-ui/angular/pagination"`],
}
