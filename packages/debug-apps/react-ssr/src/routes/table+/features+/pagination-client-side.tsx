import {PaginationClientSideDemo} from "@qualcomm-ui/react-table-docs/features+/pagination-client-side+/demos"

import {DemoPageLayout} from "../../../components/demo-page-layout"

const demos = [
  {component: PaginationClientSideDemo, title: "Pagination Client Side"},
]

export default function PaginationClientSide() {
  return (
    <DemoPageLayout
      className="w-full"
      componentName="pagination-client-side"
      demos={demos}
    />
  )
}
