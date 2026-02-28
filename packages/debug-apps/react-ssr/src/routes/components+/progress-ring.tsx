import {ProgressRingCompositeDemo as CompositeDemo} from "@qualcomm-ui/react-docs/components+/progress-ring+/demos/progress-ring-composite-demo"
import {ProgressRingSimpleDemo as SimpleDemo} from "@qualcomm-ui/react-docs/components+/progress-ring+/demos/progress-ring-simple-demo"
import {ProgressRingSizesDemo as SizesDemo} from "@qualcomm-ui/react-docs/components+/progress-ring+/demos/progress-ring-sizes-demo"
import {ProgressRingThicknessDemo as ThicknessDemo} from "@qualcomm-ui/react-docs/components+/progress-ring+/demos/progress-ring-thickness-demo"
import {ProgressRingValueDemo as ValueDemo} from "@qualcomm-ui/react-docs/components+/progress-ring+/demos/progress-ring-value-demo"
import {ProgressRingValueTextDemo as ValueTextDemo} from "@qualcomm-ui/react-docs/components+/progress-ring+/demos/progress-ring-value-text-demo"

import {DemoPageLayout} from "~/components/demo-page-layout"

const demos = [
  {component: CompositeDemo, title: "Composite"},
  {component: SimpleDemo, title: "Simple"},
  {component: SizesDemo, title: "Sizes"},
  {component: ThicknessDemo, title: "Thickness"},
  {component: ValueDemo, title: "Value"},
  {component: ValueTextDemo, title: "Value Text"},
]

export default function ProgressRingDemos() {
  return <DemoPageLayout componentName="progress-ring" demos={demos} />
}
