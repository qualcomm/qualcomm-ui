import CompositeDemo from "./demos/popover-composite-demo"
import SimpleDemo from "./demos/popover-simple-demo"

const demos = [
  {component: CompositeDemo, title: "Composite"},
  {component: SimpleDemo, title: "Simple"},
]

export default function PopoverDemos() {
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
