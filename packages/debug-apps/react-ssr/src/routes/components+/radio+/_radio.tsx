import CompositeDemo from "@qualcomm-ui/react-docs/components+/radio+/demos/radio-composite-demo"
import CompositeLayoutDemo from "@qualcomm-ui/react-docs/components+/radio+/demos/radio-composite-layout-demo"
import ControlledDemo from "@qualcomm-ui/react-docs/components+/radio+/demos/radio-controlled-demo"
import DisabledDemo from "@qualcomm-ui/react-docs/components+/radio+/demos/radio-disabled-demo"
import OrientationDemo from "@qualcomm-ui/react-docs/components+/radio+/demos/radio-orientation-demo"
import ReactHookFormDemo from "@qualcomm-ui/react-docs/components+/radio+/demos/radio-react-hook-form-demo"
import SimpleDemo from "@qualcomm-ui/react-docs/components+/radio+/demos/radio-simple-demo"
import SizesDemo from "@qualcomm-ui/react-docs/components+/radio+/demos/radio-sizes-demo"
import TanstackFormDemo from "@qualcomm-ui/react-docs/components+/radio+/demos/radio-tanstack-form-demo"

const demos = [
  {component: CompositeDemo, title: "Composite"},
  {component: CompositeLayoutDemo, title: "Composite Layout"},
  {component: ControlledDemo, title: "Controlled"},
  {component: DisabledDemo, title: "Disabled"},
  {component: OrientationDemo, title: "Orientation"},
  {component: ReactHookFormDemo, title: "React Hook Form"},
  {component: SimpleDemo, title: "Simple"},
  {component: SizesDemo, title: "Sizes"},
  {component: TanstackFormDemo, title: "Tanstack Form"},
]

export default function RadioDemos() {
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
