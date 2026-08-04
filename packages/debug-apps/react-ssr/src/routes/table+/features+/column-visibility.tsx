import {ColumnVisibilityDemo} from "@qualcomm-ui/react-table-docs/features+/column-visibility+/demos"

import {DemoPageLayout} from "../../../components/demo-page-layout"

const demos = [{component: ColumnVisibilityDemo, title: "Column Visibility"}]

export default function ColumnVisibility() {
  return (
    <DemoPageLayout
      className="w-full"
      componentName="column-visibility"
      demos={demos}
    />
  )
}
