import {FiltersServerSideDemo} from "@qualcomm-ui/react-table-docs/features+/filters-server-side+/column-header-filters+/demos"

import {DemoPageLayout} from "../../../components/demo-page-layout"

const demos = [{component: FiltersServerSideDemo, title: "Filters Server Side"}]

export default function FiltersServerSide() {
  return (
    <DemoPageLayout
      className="w-full"
      componentName="filters-server-side"
      demos={demos}
    />
  )
}
