import ActionDemo from "./demos/toast-action-demo"
import DurationDemo from "./demos/toast-duration-demo"
import EmphasisDemo from "./demos/toast-emphasis-demo"
import MaxVisibleDemo from "./demos/toast-max-visible-demo"
import OverlapDemo from "./demos/toast-overlap-demo"
import PauseDemo from "./demos/toast-pause-demo"
import PersistentDemo from "./demos/toast-persistent-demo"
import PlacementDemo from "./demos/toast-placement-demo"

const demos = [
  {component: ActionDemo, title: "Action"},
  {component: DurationDemo, title: "Duration"},
  {component: EmphasisDemo, title: "Emphasis"},
  {component: MaxVisibleDemo, title: "Max Visible"},
  {component: OverlapDemo, title: "Overlap"},
  {component: PauseDemo, title: "Pause"},
  {component: PersistentDemo, title: "Persistent"},
  {component: PlacementDemo, title: "Placement"},
]

export default function ToastDemos() {
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
