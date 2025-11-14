import ShowcaseDemo from "./demos/inline-icon-button-showcase-demo"
import VariantsDemo from "./demos/inline-icon-button-variants-demo"

const demos = [
  {component: ShowcaseDemo, title: "Showcase"},
  {component: VariantsDemo, title: "Variants"},
]

export default function InlineIconButtonDemos() {
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
