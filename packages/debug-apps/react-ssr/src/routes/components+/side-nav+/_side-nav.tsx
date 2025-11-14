import CollapsedDemo from "./demos/side-nav-collapsed-demo"
import DefaultExpandedDemo from "./demos/side-nav-default-expanded-demo"
import DisabledNodeDemo from "./demos/side-nav-disabled-node-demo"
import FilteringDemo from "./demos/side-nav-filtering-demo"
import GroupsDemo from "./demos/side-nav-groups-demo"
import LinksDemo from "./demos/side-nav-links-demo"
import NodeShorthandDemo from "./demos/side-nav-node-shorthand-demo"
import SurfaceDemo from "./demos/side-nav-surface-demo"

const demos = [
  {component: CollapsedDemo, title: "Collapsed"},
  {component: DefaultExpandedDemo, title: "Default Expanded"},
  {component: DisabledNodeDemo, title: "Disabled Node"},
  {component: FilteringDemo, title: "Filtering"},
  {component: GroupsDemo, title: "Groups"},
  {component: LinksDemo, title: "Links"},
  {component: NodeShorthandDemo, title: "Node Shorthand"},
  {component: SurfaceDemo, title: "Surface"},
]

export default function SideNavDemos() {
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
