import {ColumnDndDemo} from "@qualcomm-ui/react-table-docs/features+/column-dnd+/demos"

import {DemoPageLayout} from "../../../components/demo-page-layout"

const demos = [{component: ColumnDndDemo, title: "Column Dnd"}]

export default function ColumnDnd() {
  return (
    <DemoPageLayout
      componentName="column-dnd"
      demos={demos}
      className="w-full"
    />
  )
}
