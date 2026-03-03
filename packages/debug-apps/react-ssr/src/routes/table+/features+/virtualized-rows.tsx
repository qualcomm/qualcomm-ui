import {VirtualizedRowsDemo} from "@qualcomm-ui/react-table-docs/features+/virtualized-rows+/demos"

import {DemoPageLayout} from "../../../components/demo-page-layout"

const demos = [{component: VirtualizedRowsDemo, title: "Virtualized Rows"}]

export default function VirtualizedRows() {
  return (
    <DemoPageLayout
      componentName="virtualized-rows"
      demos={demos}
      className="w-full"
    />
  )
}
