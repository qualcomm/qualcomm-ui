import CompositeDemo from "@qualcomm-ui/react-docs/components+/progress+/demos/progress-composite-demo"
import EmphasisDemo from "@qualcomm-ui/react-docs/components+/progress+/demos/progress-emphasis-demo"
import ErrorTextDemo from "@qualcomm-ui/react-docs/components+/progress+/demos/progress-error-text-demo"
import LabelOrientationDemo from "@qualcomm-ui/react-docs/components+/progress+/demos/progress-label-orientation-demo"
import SimpleDemo from "@qualcomm-ui/react-docs/components+/progress+/demos/progress-simple-demo"
import SizeDemo from "@qualcomm-ui/react-docs/components+/progress+/demos/progress-size-demo"

const demos = [
  {component: CompositeDemo, title: "Composite"},
  {component: EmphasisDemo, title: "Emphasis"},
  {component: ErrorTextDemo, title: "Error Text"},
  {component: LabelOrientationDemo, title: "Label Orientation"},
  {component: SimpleDemo, title: "Simple"},
  {component: SizeDemo, title: "Size"},
]

export default function ProgressDemos() {
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
