import AddRemoveDemo from "@qualcomm-ui/react-docs/components+/tabs+/demos/tabs-add-remove-demo"
import ContainedSizesDemo from "@qualcomm-ui/react-docs/components+/tabs+/demos/tabs-contained-sizes-demo"
import ContextDemo from "@qualcomm-ui/react-docs/components+/tabs+/demos/tabs-context-demo"
import ControlledValueDemo from "@qualcomm-ui/react-docs/components+/tabs+/demos/tabs-controlled-value-demo"
import DisabledDemo from "@qualcomm-ui/react-docs/components+/tabs+/demos/tabs-disabled-demo"
import HorizontalDemo from "@qualcomm-ui/react-docs/components+/tabs+/demos/tabs-horizontal-demo"
import IconsDemo from "@qualcomm-ui/react-docs/components+/tabs+/demos/tabs-icons-demo"
import LazyMountedDemo from "@qualcomm-ui/react-docs/components+/tabs+/demos/tabs-lazy-mounted-demo"
import LineSizesDemo from "@qualcomm-ui/react-docs/components+/tabs+/demos/tabs-line-sizes-demo"
import LinksDemo from "@qualcomm-ui/react-docs/components+/tabs+/demos/tabs-links-demo"
import VerticalDemo from "@qualcomm-ui/react-docs/components+/tabs+/demos/tabs-vertical-demo"

const demos = [
  {component: AddRemoveDemo, title: "Add Remove"},
  {component: ContainedSizesDemo, title: "Contained Sizes"},
  {component: ContextDemo, title: "Context"},
  {component: ControlledValueDemo, title: "Controlled Value"},
  {component: DisabledDemo, title: "Disabled"},
  {component: HorizontalDemo, title: "Horizontal"},
  {component: IconsDemo, title: "Icons"},
  {component: LazyMountedDemo, title: "Lazy Mounted"},
  {component: LineSizesDemo, title: "Line Sizes"},
  {component: LinksDemo, title: "Links"},
  {component: VerticalDemo, title: "Vertical"},
]

export default function TabsDemos() {
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
