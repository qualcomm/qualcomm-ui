import ClearTriggerDemo from "@qualcomm-ui/react-docs/components+/text-input+/demos/text-input-clear-trigger-demo"
import CompositeDemo from "@qualcomm-ui/react-docs/components+/text-input+/demos/text-input-composite-demo"
import CompositeLayoutDemo from "@qualcomm-ui/react-docs/components+/text-input+/demos/text-input-composite-layout-demo"
import ControlledStateDemo from "@qualcomm-ui/react-docs/components+/text-input+/demos/text-input-controlled-state-demo"
import ErrorTextDemo from "@qualcomm-ui/react-docs/components+/text-input+/demos/text-input-error-text-demo"
import ReactHookFormDemo from "@qualcomm-ui/react-docs/components+/text-input+/demos/text-input-react-hook-form-demo"
import SimpleDemo from "@qualcomm-ui/react-docs/components+/text-input+/demos/text-input-simple-demo"
import SimpleIconsDemo from "@qualcomm-ui/react-docs/components+/text-input+/demos/text-input-simple-icons-demo"
import SizesDemo from "@qualcomm-ui/react-docs/components+/text-input+/demos/text-input-sizes-demo"
import StatesDemo from "@qualcomm-ui/react-docs/components+/text-input+/demos/text-input-states-demo"
import TanstackFormDemo from "@qualcomm-ui/react-docs/components+/text-input+/demos/text-input-tanstack-form-demo"

const demos = [
  {component: ClearTriggerDemo, title: "Clear Trigger"},
  {component: CompositeDemo, title: "Composite"},
  {component: CompositeLayoutDemo, title: "Composite Layout"},
  {component: ControlledStateDemo, title: "Controlled State"},
  {component: ErrorTextDemo, title: "Error Text"},
  {component: ReactHookFormDemo, title: "React Hook Form"},
  {component: SimpleDemo, title: "Simple"},
  {component: SimpleIconsDemo, title: "Simple Icons"},
  {component: SizesDemo, title: "Sizes"},
  {component: StatesDemo, title: "States"},
  {component: TanstackFormDemo, title: "Tanstack Form"},
]

export default function TextInputDemos() {
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
