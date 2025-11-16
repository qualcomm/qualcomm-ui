import ContrastDemo from "@qualcomm-ui/react-docs/components+/button+/demos/button-contrast-demo"
import DensityDemo from "@qualcomm-ui/react-docs/components+/button+/demos/button-density-demo"
import EmphasisDemo from "@qualcomm-ui/react-docs/components+/button+/demos/button-emphasis-demo"
import ShowcaseDemo from "@qualcomm-ui/react-docs/components+/button+/demos/button-showcase-demo"
import SizesDemo from "@qualcomm-ui/react-docs/components+/button+/demos/button-sizes-demo"
import VariantsDemo from "@qualcomm-ui/react-docs/components+/button+/demos/button-variants-demo"

const demos = [
  {component: ContrastDemo, title: "Contrast"},
  {component: DensityDemo, title: "Density"},
  {component: EmphasisDemo, title: "Emphasis"},
  {component: ShowcaseDemo, title: "Showcase"},
  {component: SizesDemo, title: "Sizes"},
  {component: VariantsDemo, title: "Variants"},
]

export default function ButtonDemos() {
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
