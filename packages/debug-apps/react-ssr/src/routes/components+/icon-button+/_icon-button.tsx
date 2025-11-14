import ContrastDemo from "./demos/icon-button-contrast-demo"
import DensityDemo from "./demos/icon-button-density-demo"
import EmphasisDemo from "./demos/icon-button-emphasis-demo"
import SizesDemo from "./demos/icon-button-sizes-demo"
import VariantCombinationsDemo from "./demos/icon-button-variant-combinations-demo"
import VariantsDemo from "./demos/icon-button-variants-demo"

const demos = [
  {component: ContrastDemo, title: "Contrast"},
  {component: DensityDemo, title: "Density"},
  {component: EmphasisDemo, title: "Emphasis"},
  {component: SizesDemo, title: "Sizes"},
  {component: VariantCombinationsDemo, title: "Variant Combinations"},
  {component: VariantsDemo, title: "Variants"},
]

export default function IconButtonDemos() {
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
