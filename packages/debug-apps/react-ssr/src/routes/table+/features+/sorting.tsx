import {SortingDemo} from "@qualcomm-ui/react-table-docs/features+/sorting+/demos"

import {DemoPageLayout} from "../../../components/demo-page-layout"

const demos = [{component: SortingDemo, title: "Sorting"}]

export default function Sorting() {
  return (
    <DemoPageLayout className="w-full" componentName="sorting" demos={demos} />
  )
}
