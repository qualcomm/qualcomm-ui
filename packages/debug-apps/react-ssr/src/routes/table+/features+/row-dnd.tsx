import {RowDndDemo} from "@qualcomm-ui/react-table-docs/features+/row-dnd+/demos"

import {DemoPageLayout} from "../../../components/demo-page-layout"

const demos = [{component: RowDndDemo, title: "Row Dnd"}]

export default function RowDnd() {
  return (
    <DemoPageLayout className="w-full" componentName="row-dnd" demos={demos} />
  )
}
