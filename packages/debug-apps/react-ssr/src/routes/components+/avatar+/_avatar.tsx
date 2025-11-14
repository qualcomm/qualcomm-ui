import ContentDemo from "./demos/avatar-content-demo"
import ShowcaseDemo from "./demos/avatar-showcase-demo"
import SizeDemo from "./demos/avatar-size-demo"
import StateCallbackDemo from "./demos/avatar-state-callback-demo"
import StatusDemo from "./demos/avatar-status-demo"
import VariantDemo from "./demos/avatar-variant-demo"

const demos = [
  {component: ContentDemo, title: "Content"},
  {component: ShowcaseDemo, title: "Showcase"},
  {component: SizeDemo, title: "Size"},
  {component: StateCallbackDemo, title: "State Callback"},
  {component: StatusDemo, title: "Status"},
  {component: VariantDemo, title: "Variant"},
]

export default function AvatarDemos() {
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
