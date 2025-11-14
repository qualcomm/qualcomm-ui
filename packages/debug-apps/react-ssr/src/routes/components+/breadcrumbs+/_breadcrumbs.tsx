import DisabledDemo from "./demos/breadcrumbs-disabled-demo"
import EmphasisDemo from "./demos/breadcrumbs-emphasis-demo"
import LinksDemo from "./demos/breadcrumbs-links-demo"
import SizesDemo from "./demos/breadcrumbs-sizes-demo"

const demos = [
  {component: DisabledDemo, title: "Disabled"},
  {component: EmphasisDemo, title: "Emphasis"},
  {component: LinksDemo, title: "Links"},
  {component: SizesDemo, title: "Sizes"},
]

export default function BreadcrumbsDemos() {
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
