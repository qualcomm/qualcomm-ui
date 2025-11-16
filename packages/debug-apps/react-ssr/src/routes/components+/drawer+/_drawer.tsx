import ControlledStateDemo from "@qualcomm-ui/react-docs/components+/drawer+/demos/drawer-controlled-state-demo"
import CustomContainerDemo from "@qualcomm-ui/react-docs/components+/drawer+/demos/drawer-custom-container-demo"
import PlacementDemo from "@qualcomm-ui/react-docs/components+/drawer+/demos/drawer-placement-demo"
import PlacementStartDemo from "@qualcomm-ui/react-docs/components+/drawer+/demos/drawer-placement-start-demo"

const demos = [
  {component: ControlledStateDemo, title: "Controlled State"},
  {component: CustomContainerDemo, title: "Custom Container"},
  {component: PlacementDemo, title: "Placement"},
  {component: PlacementStartDemo, title: "Placement Start"},
]

export default function DrawerDemos() {
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
