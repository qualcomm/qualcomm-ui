import {InlineNotificationActionDemo as ActionDemo} from "@qualcomm-ui/react-docs/components+/inline-notification+/demos/inline-notification-action-demo"
import {InlineNotificationCompositeDemo as CompositeDemo} from "@qualcomm-ui/react-docs/components+/inline-notification+/demos/inline-notification-composite-demo"
import {InlineNotificationDismissableDemo as DismissableDemo} from "@qualcomm-ui/react-docs/components+/inline-notification+/demos/inline-notification-dismissable-demo"
import {InlineNotificationEmphasisDemo as EmphasisDemo} from "@qualcomm-ui/react-docs/components+/inline-notification+/demos/inline-notification-emphasis-demo"
import {InlineNotificationLayoutDemo as LayoutDemo} from "@qualcomm-ui/react-docs/components+/inline-notification+/demos/inline-notification-layout-demo"
import {InlineNotificationSimpleDemo as SimpleDemo} from "@qualcomm-ui/react-docs/components+/inline-notification+/demos/inline-notification-simple-demo"

import {DemoPageLayout} from "~/components/demo-page-layout"

const demos = [
  {component: ActionDemo, title: "Action"},
  {component: CompositeDemo, title: "Composite"},
  {component: DismissableDemo, title: "Dismissable"},
  {component: EmphasisDemo, title: "Emphasis"},
  {component: LayoutDemo, title: "Layout"},
  {component: SimpleDemo, title: "Simple"},
]

export default function InlineNotificationDemos() {
  return <DemoPageLayout componentName="inline-notification" demos={demos} />
}
