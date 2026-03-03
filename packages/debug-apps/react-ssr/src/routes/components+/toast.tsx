import {ToastActionDemo as ActionDemo} from "@qualcomm-ui/react-docs/components+/toast+/demos/toast-action-demo"
import {ToastDurationDemo as DurationDemo} from "@qualcomm-ui/react-docs/components+/toast+/demos/toast-duration-demo"
import {ToastEmphasisDemo as EmphasisDemo} from "@qualcomm-ui/react-docs/components+/toast+/demos/toast-emphasis-demo"
import {ToastMaxVisibleDemo as MaxVisibleDemo} from "@qualcomm-ui/react-docs/components+/toast+/demos/toast-max-visible-demo"
import {ToastOverlapDemo as OverlapDemo} from "@qualcomm-ui/react-docs/components+/toast+/demos/toast-overlap-demo"
import {ToastPauseDemo as PauseDemo} from "@qualcomm-ui/react-docs/components+/toast+/demos/toast-pause-demo"
import {ToastPersistentDemo as PersistentDemo} from "@qualcomm-ui/react-docs/components+/toast+/demos/toast-persistent-demo"
import {ToastPlacementDemo as PlacementDemo} from "@qualcomm-ui/react-docs/components+/toast+/demos/toast-placement-demo"

import {DemoPageLayout} from "~/components/demo-page-layout"

const demos = [
  {component: ActionDemo, title: "Action"},
  {component: DurationDemo, title: "Duration"},
  {component: EmphasisDemo, title: "Emphasis"},
  {component: MaxVisibleDemo, title: "Max Visible"},
  {component: OverlapDemo, title: "Overlap"},
  {component: PauseDemo, title: "Pause"},
  {component: PersistentDemo, title: "Persistent"},
  {component: PlacementDemo, title: "Placement"},
]

export default function ToastDemos() {
  return <DemoPageLayout componentName="toast" demos={demos} />
}
