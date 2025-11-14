import AlertDialogDemo from "./demos/dialog-alert-dialog-demo"
import ControlledStateDemo from "./demos/dialog-controlled-state-demo"
import EmphasisDemo from "./demos/dialog-emphasis-demo"
import InsideScrollDemo from "./demos/dialog-inside-scroll-demo"
import OutsideScrollDemo from "./demos/dialog-outside-scroll-demo"
import PlacementDemo from "./demos/dialog-placement-demo"
import SizesDemo from "./demos/dialog-sizes-demo"

const demos = [
  {component: AlertDialogDemo, title: "Alert Dialog"},
  {component: ControlledStateDemo, title: "Controlled State"},
  {component: EmphasisDemo, title: "Emphasis"},
  {component: InsideScrollDemo, title: "Inside Scroll"},
  {component: OutsideScrollDemo, title: "Outside Scroll"},
  {component: PlacementDemo, title: "Placement"},
  {component: SizesDemo, title: "Sizes"},
]

export default function DialogDemos() {
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
