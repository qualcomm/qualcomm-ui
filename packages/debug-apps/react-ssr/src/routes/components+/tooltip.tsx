import {TooltipCloseEventsDemo as CloseEventsDemo} from "@qualcomm-ui/react-docs/components+/tooltip+/demos/tooltip-close-events-demo"
import {TooltipCompositeDemo as CompositeDemo} from "@qualcomm-ui/react-docs/components+/tooltip+/demos/tooltip-composite-demo"
import {TooltipControlledStateDemo as ControlledStateDemo} from "@qualcomm-ui/react-docs/components+/tooltip+/demos/tooltip-controlled-state-demo"
import {TooltipDisabledDemo as DisabledDemo} from "@qualcomm-ui/react-docs/components+/tooltip+/demos/tooltip-disabled-demo"
import {TooltipPlacementDemo as PlacementDemo} from "@qualcomm-ui/react-docs/components+/tooltip+/demos/tooltip-placement-demo"
import {TooltipSimpleDemo as SimpleDemo} from "@qualcomm-ui/react-docs/components+/tooltip+/demos/tooltip-simple-demo"

import {DemoPageLayout} from "~/components/demo-page-layout"

const demos = [
  {component: CloseEventsDemo, title: "Close Events"},
  {component: CompositeDemo, title: "Composite"},
  {component: ControlledStateDemo, title: "Controlled State"},
  {component: DisabledDemo, title: "Disabled"},
  {component: PlacementDemo, title: "Placement"},
  {component: SimpleDemo, title: "Simple"},
]

export default function TooltipDemos() {
  return <DemoPageLayout componentName="tooltip" demos={demos} />
}
