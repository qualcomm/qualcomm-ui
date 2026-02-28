import {IconShowcaseDemo as ShowcaseDemo} from "@qualcomm-ui/react-docs/components+/icon+/demos/icon-showcase-demo"
import {IconSizesDemo as SizesDemo} from "@qualcomm-ui/react-docs/components+/icon+/demos/icon-sizes-demo"

import {DemoPageLayout} from "~/components/demo-page-layout"

const demos = [
  {component: ShowcaseDemo, title: "Showcase"},
  {component: SizesDemo, title: "Sizes"},
]

export default function IconDemos() {
  return <DemoPageLayout componentName="icon" demos={demos} />
}
