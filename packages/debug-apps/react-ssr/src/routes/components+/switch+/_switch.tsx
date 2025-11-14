import CompositeLayoutDemo from "./demos/switch-composite-layout-demo"
import ControlledDemo from "./demos/switch-controlled-demo"
import DisabledDemo from "./demos/switch-disabled-demo"
import ReactHookFormDemo from "./demos/switch-react-hook-form-demo"
import SimpleDemo from "./demos/switch-simple-demo"
import SizesDemo from "./demos/switch-sizes-demo"
import StatesDemo from "./demos/switch-states-demo"
import TanstackFormDemo from "./demos/switch-tanstack-form-demo"

const demos = [
  {component: CompositeLayoutDemo, title: "Composite Layout"},
  {component: ControlledDemo, title: "Controlled"},
  {component: DisabledDemo, title: "Disabled"},
  {component: ReactHookFormDemo, title: "React Hook Form"},
  {component: SimpleDemo, title: "Simple"},
  {component: SizesDemo, title: "Sizes"},
  {component: StatesDemo, title: "States"},
  {component: TanstackFormDemo, title: "Tanstack Form"},
]

export default function SwitchDemos() {
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
