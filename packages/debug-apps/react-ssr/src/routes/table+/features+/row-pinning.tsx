import {RowPinningDemo} from "@qualcomm-ui/react-table-docs/features+/row-pinning+/demos"

import {DemoPageLayout} from "../../../components/demo-page-layout"

const demos = [{component: RowPinningDemo, title: "Row Pinning"}]

export default function RowPinning() {
  return (
    <DemoPageLayout
      componentName="row-pinning"
      demos={demos}
      className="w-full"
    />
  )
}
