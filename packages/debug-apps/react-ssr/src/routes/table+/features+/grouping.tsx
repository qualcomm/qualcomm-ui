import {GroupingDemo} from "@qualcomm-ui/react-table-docs/features+/grouping+/demos"

import {DemoPageLayout} from "../../../components/demo-page-layout"

const demos = [{component: GroupingDemo, title: "Grouping"}]

export default function Grouping() {
  return (
    <DemoPageLayout className="w-full" componentName="grouping" demos={demos} />
  )
}
