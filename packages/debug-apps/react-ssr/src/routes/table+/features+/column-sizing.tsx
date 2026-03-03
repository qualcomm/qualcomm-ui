import {ColumnSizingDemo} from "@qualcomm-ui/react-table-docs/features+/column-sizing+/demos"

import {DemoPageLayout} from "../../../components/demo-page-layout"

const demos = [{component: ColumnSizingDemo, title: "Column Sizing"}]

export default function ColumnSizing() {
  return (
    <DemoPageLayout
      componentName="column-sizing"
      demos={demos}
      className="w-full"
    />
  )
}
