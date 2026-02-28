import {DrawerControlledStateDemo as ControlledStateDemo} from "@qualcomm-ui/react-docs/components+/drawer+/demos/drawer-controlled-state-demo"
import {DrawerCustomContainerDemo as CustomContainerDemo} from "@qualcomm-ui/react-docs/components+/drawer+/demos/drawer-custom-container-demo"
import {DrawerPlacementDemo as PlacementDemo} from "@qualcomm-ui/react-docs/components+/drawer+/demos/drawer-placement-demo"
import {DrawerPlacementStartDemo as PlacementStartDemo} from "@qualcomm-ui/react-docs/components+/drawer+/demos/drawer-placement-start-demo"

import {DemoPageLayout} from "~/components/demo-page-layout"

const demos = [
  {component: ControlledStateDemo, title: "Controlled State"},
  {component: CustomContainerDemo, title: "Custom Container"},
  {component: PlacementDemo, title: "Placement"},
  {component: PlacementStartDemo, title: "Placement Start"},
]

export default function DrawerDemos() {
  return <DemoPageLayout componentName="drawer" demos={demos} />
}
