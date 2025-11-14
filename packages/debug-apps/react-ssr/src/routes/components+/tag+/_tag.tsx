import EmphasisDemo from "./demos/tag-emphasis-demo"
import IconsDemo from "./demos/tag-icons-demo"
import RadiusDemo from "./demos/tag-radius-demo"
import SizesDemo from "./demos/tag-sizes-demo"
import StatesDemo from "./demos/tag-states-demo"
import VariantsDemo from "./demos/tag-variants-demo"

const demos = [
  {component: EmphasisDemo, title: "Emphasis"},
  {component: IconsDemo, title: "Icons"},
  {component: RadiusDemo, title: "Radius"},
  {component: SizesDemo, title: "Sizes"},
  {component: StatesDemo, title: "States"},
  {component: VariantsDemo, title: "Variants"},
]

export default function TagDemos() {
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
