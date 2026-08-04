import {RowExpansionCustomization as RowExpansionCustomizationDemo} from "@qualcomm-ui/react-table-docs/features+/row-expansion-customization+/demos"

import {DemoPageLayout} from "../../../components/demo-page-layout"

const demos = [
  {
    component: RowExpansionCustomizationDemo,
    title: "Row Expansion Customization",
  },
]

export default function RowExpansionCustomization() {
  return (
    <DemoPageLayout
      className="w-full"
      componentName="row-expansion-customization"
      demos={demos}
    />
  )
}
