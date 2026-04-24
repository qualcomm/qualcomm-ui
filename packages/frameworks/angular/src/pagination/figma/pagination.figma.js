// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

// url=<FIGMA_COMPONENTS_BASE>?node-id=3746-4648
// component=Pagination

const figma = require("figma")

const instance = figma.selectedInstance

const isTableBar = instance.getEnum("type", {"table-bar": true})
const control = instance.getEnum("control", {left: "left", right: "right"})
const size = instance.getEnum("size", {
  md: "md",
})
const range = instance.getBoolean("range")
const items = instance.getBoolean("items")

const sizeAttr = size ? ` size="${size}"` : ""
const count = isTableBar ? "360" : "100"
const defaultPageSize = isTableBar ? "100" : "10"

const pageMetadata = range
  ? `
      <span *paginationContext="let context" q-pagination-page-metadata>
        @let meta = context.pageMetadata;
        {{ meta.pageStart }} - {{ meta.pageEnd }} of {{ meta.count }} results
      </span>`
  : ""

const pageSize = items
  ? `
      <div q-pagination-page-size [options]="[10, 25, 50, 100]">
        <span q-pagination-page-size-label>Items per page</span>
      </div>`
  : ""

const controls = `${pageSize}${pageMetadata}`
const before = control === "left" ? controls : ""
const after = control === "right" ? controls : ""

export default {
  example: figma.code`
    <div count="${count}" defaultPageSize="${defaultPageSize}" q-pagination-root${sizeAttr}>${before}
      <div q-pagination-page-buttons></div>${after}
    </div>`,
  id: "Pagination",
  imports: [`import {PaginationModule} from "@qualcomm-ui/angular/pagination"`],
}
