import {ProgressCompositeDemo as CompositeDemo} from "@qualcomm-ui/react-docs/components+/progress+/demos/progress-composite-demo"
import {ProgressEmphasisDemo as EmphasisDemo} from "@qualcomm-ui/react-docs/components+/progress+/demos/progress-emphasis-demo"
import {ProgressErrorTextDemo as ErrorTextDemo} from "@qualcomm-ui/react-docs/components+/progress+/demos/progress-error-text-demo"
import {ProgressLabelOrientationDemo as LabelOrientationDemo} from "@qualcomm-ui/react-docs/components+/progress+/demos/progress-label-orientation-demo"
import {ProgressSimpleDemo as SimpleDemo} from "@qualcomm-ui/react-docs/components+/progress+/demos/progress-simple-demo"
import {ProgressSizeDemo as SizeDemo} from "@qualcomm-ui/react-docs/components+/progress+/demos/progress-size-demo"

import {DemoPageLayout} from "~/components/demo-page-layout"

const demos = [
  {component: CompositeDemo, title: "Composite"},
  {component: EmphasisDemo, title: "Emphasis"},
  {component: ErrorTextDemo, title: "Error Text"},
  {component: LabelOrientationDemo, title: "Label Orientation"},
  {component: SimpleDemo, title: "Simple"},
  {component: SizeDemo, title: "Size"},
]

export default function ProgressDemos() {
  return <DemoPageLayout componentName="progress" demos={demos} />
}
