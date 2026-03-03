import {PaginationServerSideDemo} from "@qualcomm-ui/react-table-docs/features+/pagination-server-side+/demos"

import {DemoPageLayout} from "../../../components/demo-page-layout"

const demos = [
  {component: PaginationServerSideDemo, title: "Pagination Server Side"},
]

export default function PaginationServerSide() {
  return (
    <DemoPageLayout
      componentName="pagination-server-side"
      demos={demos}
      className="w-full"
    />
  )
}
