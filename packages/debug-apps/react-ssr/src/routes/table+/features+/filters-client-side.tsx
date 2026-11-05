import {FiltersClientSideDemo} from "@qualcomm-ui/react-table-docs/features+/filters-client-side+/demos"

import {DemoPageLayout} from "../../../components/demo-page-layout"

const demos = [{component: FiltersClientSideDemo, title: "Filters Client Side"}]

export default function FiltersClientSide() {
  return (
    <DemoPageLayout
      className="w-full"
      componentName="filters-client-side"
      demos={demos}
    />
  )
}
