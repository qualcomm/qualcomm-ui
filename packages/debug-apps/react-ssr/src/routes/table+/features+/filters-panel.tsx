import {FiltersPanelDemo} from "@qualcomm-ui/react-table-docs/features+/filters-client-side+/filter-panel+/demos"

import {DemoPageLayout} from "../../../components/demo-page-layout"

const demos = [{component: FiltersPanelDemo, title: "Filters Panel"}]

export default function FiltersPanel() {
  return (
    <DemoPageLayout
      className="w-full"
      componentName="filters-panel"
      demos={demos}
    />
  )
}
