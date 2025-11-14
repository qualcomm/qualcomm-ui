import CompositeDemo from "@qualcomm-ui/react-docs/components+/segmented-control+/demos/segmented-control-composite-demo"
import ControlledDemo from "@qualcomm-ui/react-docs/components+/segmented-control+/demos/segmented-control-controlled-demo"
import DisabledDemo from "@qualcomm-ui/react-docs/components+/segmented-control+/demos/segmented-control-disabled-demo"
import IconDemo from "@qualcomm-ui/react-docs/components+/segmented-control+/demos/segmented-control-icon-demo"
import IconOnlyDemo from "@qualcomm-ui/react-docs/components+/segmented-control+/demos/segmented-control-icon-only-demo"
import LayoutDemo from "@qualcomm-ui/react-docs/components+/segmented-control+/demos/segmented-control-layout-demo"
import MultipleDemo from "@qualcomm-ui/react-docs/components+/segmented-control+/demos/segmented-control-multiple-demo"
import OrientationDemo from "@qualcomm-ui/react-docs/components+/segmented-control+/demos/segmented-control-orientation-demo"
import SimpleDemo from "@qualcomm-ui/react-docs/components+/segmented-control+/demos/segmented-control-simple-demo"
import SizeDemo from "@qualcomm-ui/react-docs/components+/segmented-control+/demos/segmented-control-size-demo"
import VariantDemo from "@qualcomm-ui/react-docs/components+/segmented-control+/demos/segmented-control-variant-demo"

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
  return (
    <div className="page">
      {demos.map(({component: Demo, title}) => (
        <div className="section" key={title}>
          <h2 className="section-title">{title}</h2>
          <div className="demo-container">
            <Demo />
          </div>
        </div>
      ))}
    </div>
  )
}
