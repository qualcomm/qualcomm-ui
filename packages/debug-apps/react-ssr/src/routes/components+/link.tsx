import {LinkColorsDemo as ColorsDemo} from "@qualcomm-ui/react-docs/components+/link+/demos/link-colors-demo"
import {LinkDisabledDemo as DisabledDemo} from "@qualcomm-ui/react-docs/components+/link+/demos/link-disabled-demo"
import {LinkIconsDemo as IconsDemo} from "@qualcomm-ui/react-docs/components+/link+/demos/link-icons-demo"
import {LinkRenderPropDemo as RenderPropDemo} from "@qualcomm-ui/react-docs/components+/link+/demos/link-render-prop-demo"
import {LinkSizesDemo as SizesDemo} from "@qualcomm-ui/react-docs/components+/link+/demos/link-sizes-demo"

import {DemoPageLayout} from "~/components/demo-page-layout"

const demos = [
  {component: ColorsDemo, title: "Colors"},
  {component: DisabledDemo, title: "Disabled"},
  {component: IconsDemo, title: "Icons"},
  {component: RenderPropDemo, title: "Render Prop"},
  {component: SizesDemo, title: "Sizes"},
]

export default function LinkDemos() {
  return <DemoPageLayout componentName="link" demos={demos} />
}
