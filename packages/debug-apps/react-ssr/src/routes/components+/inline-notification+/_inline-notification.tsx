import ActionDemo from "@qualcomm-ui/react-docs/components+/inline-notification+/demos/inline-notification-action-demo"
import CompositeDemo from "@qualcomm-ui/react-docs/components+/inline-notification+/demos/inline-notification-composite-demo"
import DismissableDemo from "@qualcomm-ui/react-docs/components+/inline-notification+/demos/inline-notification-dismissable-demo"
import EmphasisDemo from "@qualcomm-ui/react-docs/components+/inline-notification+/demos/inline-notification-emphasis-demo"
import LayoutDemo from "@qualcomm-ui/react-docs/components+/inline-notification+/demos/inline-notification-layout-demo"
import SimpleDemo from "@qualcomm-ui/react-docs/components+/inline-notification+/demos/inline-notification-simple-demo"

const demos = [
  {component: ActionDemo, title: "Action"},
  {component: CompositeDemo, title: "Composite"},
  {component: DismissableDemo, title: "Dismissable"},
  {component: EmphasisDemo, title: "Emphasis"},
  {component: LayoutDemo, title: "Layout"},
  {component: SimpleDemo, title: "Simple"},
]

export default function InlineNotificationDemos() {
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
