import {TabsAddRemoveDemo as AddRemoveDemo} from "@qualcomm-ui/react-docs/components+/tabs+/demos/tabs-add-remove-demo"
import {TabsContainedSizesDemo as ContainedSizesDemo} from "@qualcomm-ui/react-docs/components+/tabs+/demos/tabs-contained-sizes-demo"
import {TabsContextDemo as ContextDemo} from "@qualcomm-ui/react-docs/components+/tabs+/demos/tabs-context-demo"
import {TabsControlledValueDemo as ControlledValueDemo} from "@qualcomm-ui/react-docs/components+/tabs+/demos/tabs-controlled-value-demo"
import {TabsDisabledDemo as DisabledDemo} from "@qualcomm-ui/react-docs/components+/tabs+/demos/tabs-disabled-demo"
import {TabsHorizontalDemo as HorizontalDemo} from "@qualcomm-ui/react-docs/components+/tabs+/demos/tabs-horizontal-demo"
import {TabsIconsDemo as IconsDemo} from "@qualcomm-ui/react-docs/components+/tabs+/demos/tabs-icons-demo"
import {TabsLazyMountedDemo as LazyMountedDemo} from "@qualcomm-ui/react-docs/components+/tabs+/demos/tabs-lazy-mounted-demo"
import {TabsLineSizesDemo as LineSizesDemo} from "@qualcomm-ui/react-docs/components+/tabs+/demos/tabs-line-sizes-demo"
import {TabsLinksDemo as LinksDemo} from "@qualcomm-ui/react-docs/components+/tabs+/demos/tabs-links-demo"
import {TabsVerticalDemo as VerticalDemo} from "@qualcomm-ui/react-docs/components+/tabs+/demos/tabs-vertical-demo"

import {DemoPageLayout} from "~/components/demo-page-layout"

const demos = [
  {component: AddRemoveDemo, title: "Add Remove"},
  {component: ContainedSizesDemo, title: "Contained Sizes"},
  {component: ContextDemo, title: "Context"},
  {component: ControlledValueDemo, title: "Controlled Value"},
  {component: DisabledDemo, title: "Disabled"},
  {component: HorizontalDemo, title: "Horizontal"},
  {component: IconsDemo, title: "Icons"},
  {component: LazyMountedDemo, title: "Lazy Mounted"},
  {component: LineSizesDemo, title: "Line Sizes"},
  {component: LinksDemo, title: "Links"},
  {component: VerticalDemo, title: "Vertical"},
]

export default function TabsDemos() {
  return <DemoPageLayout componentName="tabs" demos={demos} />
}
