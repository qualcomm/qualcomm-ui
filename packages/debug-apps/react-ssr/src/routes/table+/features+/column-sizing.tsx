import {ColumnSizingDemo} from "@qualcomm-ui/react-table-docs/features+/column-sizing+/demos"

import {DemoPageLayout} from "../../../components/demo-page-layout"

const demos = [{component: ColumnSizingDemo, title: "Column Sizing"}]

export default function ColumnSizing() {
  return (
    <DemoPageLayout
      className="w-full"
      componentName="column-sizing"
      demos={demos}
    />
  )
}
