import {ColumnPinningDemo} from "@qualcomm-ui/react-table-docs/features+/column-pinning+/demos"

import {DemoPageLayout} from "../../../components/demo-page-layout"

const demos = [{component: ColumnPinningDemo, title: "Column Pinning"}]

export default function ColumnPinning() {
  return (
    <DemoPageLayout
      className="w-full"
      componentName="column-pinning"
      demos={demos}
    />
  )
}
