import {AvatarContentDemo as ContentDemo} from "@qualcomm-ui/react-docs/components+/avatar+/demos/avatar-content-demo"
import {AvatarEmphasisDemo as EmphasisDemo} from "@qualcomm-ui/react-docs/components+/avatar+/demos/avatar-emphasis-demo"
import {AvatarShowcaseDemo as ShowcaseDemo} from "@qualcomm-ui/react-docs/components+/avatar+/demos/avatar-showcase-demo"
import {AvatarSizeDemo as SizeDemo} from "@qualcomm-ui/react-docs/components+/avatar+/demos/avatar-size-demo"
import {AvatarStateCallbackDemo as StateCallbackDemo} from "@qualcomm-ui/react-docs/components+/avatar+/demos/avatar-state-callback-demo"
import {AvatarStatusDemo as StatusDemo} from "@qualcomm-ui/react-docs/components+/avatar+/demos/avatar-status-demo"

import {DemoPageLayout} from "~/components/demo-page-layout"

const demos = [
  {component: ContentDemo, title: "Content"},
  {component: EmphasisDemo, title: "Emphasis"},
  {component: ShowcaseDemo, title: "Showcase"},
  {component: SizeDemo, title: "Size"},
  {component: StateCallbackDemo, title: "State Callback"},
  {component: StatusDemo, title: "Status"},
]

export default function AvatarDemos() {
  return <DemoPageLayout componentName="avatar" demos={demos} />
}
