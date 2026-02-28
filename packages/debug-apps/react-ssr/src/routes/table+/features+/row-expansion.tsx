import {RowExpansionDemo} from "@qualcomm-ui/react-table-docs/features+/row-expansion+/demos"

import {DemoPageLayout} from "../../../components/demo-page-layout"

const demos = [{component: RowExpansionDemo, title: "Row Expansion"}]

export default function RowExpansion() {
  return (
    <DemoPageLayout
      componentName="row-expansion"
      demos={demos}
      className="w-full"
    />
  )
}
