import {FiltersFacetIndexDemo} from "@qualcomm-ui/react-table-docs/features+/filters-client-side+/facet-index+/demos"

import {DemoPageLayout} from "../../../components/demo-page-layout"

const demos = [{component: FiltersFacetIndexDemo, title: "Filters Facet Index"}]

export default function FiltersFacetIndex() {
  return (
    <DemoPageLayout
      className="w-full"
      componentName="filters-facet-index"
      demos={demos}
    />
  )
}
