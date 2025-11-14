import ControlledStateDemo from "@qualcomm-ui/react-docs/components+/collapsible+/demos/collapsible-controlled-state-demo"
import ShowcaseDemo from "@qualcomm-ui/react-docs/components+/collapsible+/demos/collapsible-showcase-demo"

const demos = [
  {component: ControlledStateDemo, title: "Controlled State"},
  {component: ShowcaseDemo, title: "Showcase"},
]

export default function CollapsibleDemos() {
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
