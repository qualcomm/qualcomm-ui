import {DialogAlertDialogDemo as AlertDialogDemo} from "@qualcomm-ui/react-docs/components+/dialog+/demos/dialog-alert-dialog-demo"
import {DialogControlledStateDemo as ControlledStateDemo} from "@qualcomm-ui/react-docs/components+/dialog+/demos/dialog-controlled-state-demo"
import {DialogEmphasisDemo as EmphasisDemo} from "@qualcomm-ui/react-docs/components+/dialog+/demos/dialog-emphasis-demo"
import {DialogInsideScrollDemo as InsideScrollDemo} from "@qualcomm-ui/react-docs/components+/dialog+/demos/dialog-inside-scroll-demo"
import {DialogOutsideScrollDemo as OutsideScrollDemo} from "@qualcomm-ui/react-docs/components+/dialog+/demos/dialog-outside-scroll-demo"
import {DialogPlacementDemo as PlacementDemo} from "@qualcomm-ui/react-docs/components+/dialog+/demos/dialog-placement-demo"
import {DialogSizesDemo as SizesDemo} from "@qualcomm-ui/react-docs/components+/dialog+/demos/dialog-sizes-demo"

import {DemoPageLayout} from "~/components/demo-page-layout"

const demos = [
  {component: AlertDialogDemo, title: "Alert Dialog"},
  {component: ControlledStateDemo, title: "Controlled State"},
  {component: EmphasisDemo, title: "Emphasis"},
  {component: InsideScrollDemo, title: "Inside Scroll"},
  {component: OutsideScrollDemo, title: "Outside Scroll"},
  {component: PlacementDemo, title: "Placement"},
  {component: SizesDemo, title: "Sizes"},
]

export default function DialogDemos() {
  return <DemoPageLayout componentName="dialog" demos={demos} />
}
