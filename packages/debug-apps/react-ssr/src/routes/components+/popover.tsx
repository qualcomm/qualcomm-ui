import {PopoverCompositeDemo as CompositeDemo} from "@qualcomm-ui/react-docs/components+/popover+/demos/popover-composite-demo"
import {PopoverSimpleDemo as SimpleDemo} from "@qualcomm-ui/react-docs/components+/popover+/demos/popover-simple-demo"

import {DemoPageLayout} from "~/components/demo-page-layout"

const demos = [
  {component: CompositeDemo, title: "Composite"},
  {component: SimpleDemo, title: "Simple"},
]

export default function PopoverDemos() {
  return <DemoPageLayout componentName="popover" demos={demos} />
}
