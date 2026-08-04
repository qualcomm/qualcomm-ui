import {ColumnGroupingDemo} from "@qualcomm-ui/react-table-docs/features+/column-grouping+/demos"

import {DemoPageLayout} from "../../../components/demo-page-layout"

const demos = [{component: ColumnGroupingDemo, title: "Column Grouping"}]

export default function ColumnGrouping() {
  return (
    <DemoPageLayout
      className="w-full"
      componentName="column-grouping"
      demos={demos}
    />
  )
}
