import {CollapsibleControlledStateDemo as ControlledStateDemo} from "@qualcomm-ui/react-docs/components+/collapsible+/demos/collapsible-controlled-state-demo"
import {CollapsibleShowcaseDemo as ShowcaseDemo} from "@qualcomm-ui/react-docs/components+/collapsible+/demos/collapsible-showcase-demo"

import {DemoPageLayout} from "~/components/demo-page-layout"

const demos = [
  {component: ControlledStateDemo, title: "Controlled State"},
  {component: ShowcaseDemo, title: "Showcase"},
]

export default function CollapsibleDemos() {
  return <DemoPageLayout componentName="collapsible" demos={demos} />
}
