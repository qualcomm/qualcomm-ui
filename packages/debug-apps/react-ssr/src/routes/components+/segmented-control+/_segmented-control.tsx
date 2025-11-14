import CompositeDemo from "./demos/segmented-control-composite-demo"
import ControlledDemo from "./demos/segmented-control-controlled-demo"
import DisabledDemo from "./demos/segmented-control-disabled-demo"
import IconDemo from "./demos/segmented-control-icon-demo"
import IconOnlyDemo from "./demos/segmented-control-icon-only-demo"
import LayoutDemo from "./demos/segmented-control-layout-demo"
import MultipleDemo from "./demos/segmented-control-multiple-demo"
import OrientationDemo from "./demos/segmented-control-orientation-demo"
import SimpleDemo from "./demos/segmented-control-simple-demo"
import SizeDemo from "./demos/segmented-control-size-demo"
import VariantDemo from "./demos/segmented-control-variant-demo"

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
