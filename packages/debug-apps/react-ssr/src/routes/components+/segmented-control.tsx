import {SegmentedControlCompositeDemo as CompositeDemo} from "@qualcomm-ui/react-docs/components+/segmented-control+/demos/segmented-control-composite-demo"
import {SegmentedControlControlledDemo as ControlledDemo} from "@qualcomm-ui/react-docs/components+/segmented-control+/demos/segmented-control-controlled-demo"
import {SegmentedControlDisabledDemo as DisabledDemo} from "@qualcomm-ui/react-docs/components+/segmented-control+/demos/segmented-control-disabled-demo"
import {SegmentedControlIconDemo as IconDemo} from "@qualcomm-ui/react-docs/components+/segmented-control+/demos/segmented-control-icon-demo"
import {SegmentedControlIconOnlyDemo as IconOnlyDemo} from "@qualcomm-ui/react-docs/components+/segmented-control+/demos/segmented-control-icon-only-demo"
import {SegmentedControlLayoutDemo as LayoutDemo} from "@qualcomm-ui/react-docs/components+/segmented-control+/demos/segmented-control-layout-demo"
import {SegmentedControlMultipleDemo as MultipleDemo} from "@qualcomm-ui/react-docs/components+/segmented-control+/demos/segmented-control-multiple-demo"
import {SegmentedControlOrientationDemo as OrientationDemo} from "@qualcomm-ui/react-docs/components+/segmented-control+/demos/segmented-control-orientation-demo"
import {SegmentedControlSimpleDemo as SimpleDemo} from "@qualcomm-ui/react-docs/components+/segmented-control+/demos/segmented-control-simple-demo"
import {SegmentedControlSizeDemo as SizeDemo} from "@qualcomm-ui/react-docs/components+/segmented-control+/demos/segmented-control-size-demo"
import {SegmentedControlVariantDemo as VariantDemo} from "@qualcomm-ui/react-docs/components+/segmented-control+/demos/segmented-control-variant-demo"

import {DemoPageLayout} from "~/components/demo-page-layout"

const demos = [
  {component: CompositeDemo, title: "Composite"},
  {component: ControlledDemo, title: "Controlled"},
  {component: DisabledDemo, title: "Disabled"},
  {component: IconDemo, title: "Icon"},
  {component: IconOnlyDemo, title: "Icon Only"},
  {component: LayoutDemo, title: "Layout"},
  {component: MultipleDemo, title: "Multiple"},
  {component: OrientationDemo, title: "Orientation"},
  {component: SimpleDemo, title: "Simple"},
  {component: SizeDemo, title: "Size"},
  {component: VariantDemo, title: "Variant"},
]

export default function SegmentedControlDemos() {
  return <DemoPageLayout componentName="segmented-control" demos={demos} />
}
