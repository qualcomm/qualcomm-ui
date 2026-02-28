import {RowSelectionDemo} from "@qualcomm-ui/react-table-docs/features+/row-selection+/demos"

import {DemoPageLayout} from "../../../components/demo-page-layout"

const demos = [{component: RowSelectionDemo, title: "Row Selection"}]

export default function RowSelection() {
  return (
    <DemoPageLayout
      componentName="row-selection"
      demos={demos}
      className="w-full"
    />
  )
}
