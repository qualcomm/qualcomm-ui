import {FiltersColumnHeaderDemo} from "@qualcomm-ui/react-table-docs/features+/filters-client-side+/column-header-filters+/demos"

import {DemoPageLayout} from "../../../components/demo-page-layout"

const demos = [
  {component: FiltersColumnHeaderDemo, title: "Filters Column Header"},
]

export default function FiltersColumnHeader() {
  return (
    <DemoPageLayout
      className="w-full"
      componentName="filters-column-header"
      demos={demos}
    />
  )
}
