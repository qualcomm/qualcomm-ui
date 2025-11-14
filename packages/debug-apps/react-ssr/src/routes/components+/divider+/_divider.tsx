import FocusableDemo from "./demos/divider-focusable-demo"
import OrientationDemo from "./demos/divider-orientation-demo"
import ShowcaseDemo from "./demos/divider-showcase-demo"
import ValueTextDemo from "./demos/divider-value-text-demo"
import VariantsDemo from "./demos/divider-variants-demo"

const demos = [
  {component: FocusableDemo, title: "Focusable"},
  {component: OrientationDemo, title: "Orientation"},
  {component: ShowcaseDemo, title: "Showcase"},
  {component: ValueTextDemo, title: "Value Text"},
  {component: VariantsDemo, title: "Variants"},
]

export default function DividerDemos() {
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
