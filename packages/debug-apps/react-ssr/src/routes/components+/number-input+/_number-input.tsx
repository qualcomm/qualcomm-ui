import CompositeDemo from "./demos/number-input-composite-demo"
import ControlledDemo from "./demos/number-input-controlled-demo"
import ErrorTextDemo from "./demos/number-input-error-text-demo"
import MinMaxDemo from "./demos/number-input-min-max-demo"
import SimpleDemo from "./demos/number-input-simple-demo"
import SizesDemo from "./demos/number-input-sizes-demo"
import StatesDemo from "./demos/number-input-states-demo"
import StepDemo from "./demos/number-input-step-demo"

const demos = [
  {component: CompositeDemo, title: "Composite"},
  {component: ControlledDemo, title: "Controlled"},
  {component: ErrorTextDemo, title: "Error Text"},
  {component: MinMaxDemo, title: "Min Max"},
  {component: SimpleDemo, title: "Simple"},
  {component: SizesDemo, title: "Sizes"},
  {component: StatesDemo, title: "States"},
  {component: StepDemo, title: "Step"},
]

export default function NumberInputDemos() {
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
