import CompositeDemo from "@qualcomm-ui/react-docs/components+/progress-ring+/demos/progress-ring-composite-demo"
import SimpleDemo from "@qualcomm-ui/react-docs/components+/progress-ring+/demos/progress-ring-simple-demo"
import SizesDemo from "@qualcomm-ui/react-docs/components+/progress-ring+/demos/progress-ring-sizes-demo"
import ThicknessDemo from "@qualcomm-ui/react-docs/components+/progress-ring+/demos/progress-ring-thickness-demo"
import ValueDemo from "@qualcomm-ui/react-docs/components+/progress-ring+/demos/progress-ring-value-demo"
import ValueTextDemo from "@qualcomm-ui/react-docs/components+/progress-ring+/demos/progress-ring-value-text-demo"

const demos = [
  {component: CompositeDemo, title: "Composite"},
  {component: SimpleDemo, title: "Simple"},
  {component: SizesDemo, title: "Sizes"},
  {component: ThicknessDemo, title: "Thickness"},
  {component: ValueDemo, title: "Value"},
  {component: ValueTextDemo, title: "Value Text"},
]

export default function ProgressRingDemos() {
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
