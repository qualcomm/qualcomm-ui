import CompositeDemo from "./demos/progress-composite-demo"
import EmphasisDemo from "./demos/progress-emphasis-demo"
import ErrorTextDemo from "./demos/progress-error-text-demo"
import LabelOrientationDemo from "./demos/progress-label-orientation-demo"
import SimpleDemo from "./demos/progress-simple-demo"
import SizeDemo from "./demos/progress-size-demo"

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
