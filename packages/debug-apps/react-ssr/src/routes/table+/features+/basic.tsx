import {BasicDemo} from "@qualcomm-ui/react-table-docs/features+/basic+/demos"

import {DemoPageLayout} from "../../../components/demo-page-layout"

const demos = [{component: BasicDemo, title: "Basic"}]

export default function Basic() {
  return (
    <DemoPageLayout className="w-full" componentName="basic" demos={demos} />
  )
}
