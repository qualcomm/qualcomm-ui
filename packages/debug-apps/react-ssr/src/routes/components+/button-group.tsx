import {ButtonGroupLayoutDemo as LayoutDemo} from "@qualcomm-ui/react-docs/components+/button-group+/demos/button-group-layout-demo"
import {ButtonGroupSharedPropsDemo as SharedPropsDemo} from "@qualcomm-ui/react-docs/components+/button-group+/demos/button-group-shared-props-demo"

import {DemoPageLayout} from "~/components/demo-page-layout"

const demos = [
  {component: LayoutDemo, title: "Layout"},
  {component: SharedPropsDemo, title: "Shared Props"},
]

export default function ButtonGroupDemos() {
  return <DemoPageLayout componentName="button-group" demos={demos} />
}
