import ColorsDemo from "./demos/link-colors-demo"
import DisabledDemo from "./demos/link-disabled-demo"
import IconsDemo from "./demos/link-icons-demo"
import RenderPropDemo from "./demos/link-render-prop-demo"
import SizesDemo from "./demos/link-sizes-demo"

const demos = [
  {component: ColorsDemo, title: "Colors"},
  {component: DisabledDemo, title: "Disabled"},
  {component: IconsDemo, title: "Icons"},
  {component: RenderPropDemo, title: "Render Prop"},
  {component: SizesDemo, title: "Sizes"},
]

export default function LinkDemos() {
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
