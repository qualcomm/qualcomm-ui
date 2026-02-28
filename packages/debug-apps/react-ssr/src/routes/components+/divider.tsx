import {DividerFocusableDemo as FocusableDemo} from "@qualcomm-ui/react-docs/components+/divider+/demos/divider-focusable-demo"
import {DividerOrientationDemo as OrientationDemo} from "@qualcomm-ui/react-docs/components+/divider+/demos/divider-orientation-demo"
import {DividerShowcaseDemo as ShowcaseDemo} from "@qualcomm-ui/react-docs/components+/divider+/demos/divider-showcase-demo"
import {DividerValueTextDemo as ValueTextDemo} from "@qualcomm-ui/react-docs/components+/divider+/demos/divider-value-text-demo"
import {DividerVariantsDemo as VariantsDemo} from "@qualcomm-ui/react-docs/components+/divider+/demos/divider-variants-demo"

import {DemoPageLayout} from "~/components/demo-page-layout"

const demos = [
  {component: FocusableDemo, title: "Focusable"},
  {component: OrientationDemo, title: "Orientation"},
  {component: ShowcaseDemo, title: "Showcase"},
  {component: ValueTextDemo, title: "Value Text"},
  {component: VariantsDemo, title: "Variants"},
]

export default function DividerDemos() {
  return <DemoPageLayout componentName="divider" demos={demos} />
}
