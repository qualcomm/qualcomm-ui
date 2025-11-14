import CloseEventsDemo from "@qualcomm-ui/react-docs/components+/tooltip+/demos/tooltip-close-events-demo"
import CompositeDemo from "@qualcomm-ui/react-docs/components+/tooltip+/demos/tooltip-composite-demo"
import ControlledStateDemo from "@qualcomm-ui/react-docs/components+/tooltip+/demos/tooltip-controlled-state-demo"
import DisabledDemo from "@qualcomm-ui/react-docs/components+/tooltip+/demos/tooltip-disabled-demo"
import PlacementDemo from "@qualcomm-ui/react-docs/components+/tooltip+/demos/tooltip-placement-demo"
import SimpleDemo from "@qualcomm-ui/react-docs/components+/tooltip+/demos/tooltip-simple-demo"

const demos = [
  {component: CloseEventsDemo, title: "Close Events"},
  {component: CompositeDemo, title: "Composite"},
  {component: ControlledStateDemo, title: "Controlled State"},
  {component: DisabledDemo, title: "Disabled"},
  {component: PlacementDemo, title: "Placement"},
  {component: SimpleDemo, title: "Simple"},
]

export default function TooltipDemos() {
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
