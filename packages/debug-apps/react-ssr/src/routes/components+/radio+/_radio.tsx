import CompositeDemo from "./demos/radio-composite-demo"
import CompositeLayoutDemo from "./demos/radio-composite-layout-demo"
import ControlledDemo from "./demos/radio-controlled-demo"
import DisabledDemo from "./demos/radio-disabled-demo"
import OrientationDemo from "./demos/radio-orientation-demo"
import ReactHookFormDemo from "./demos/radio-react-hook-form-demo"
import SimpleDemo from "./demos/radio-simple-demo"
import SizesDemo from "./demos/radio-sizes-demo"
import TanstackFormDemo from "./demos/radio-tanstack-form-demo"

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
