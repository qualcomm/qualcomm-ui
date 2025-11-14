import AddRemoveDemo from "./demos/tree-add-remove-demo"
import CheckboxDemo from "./demos/tree-checkbox-demo"
import DefaultExpandedDemo from "./demos/tree-default-expanded-demo"
import DisabledNodeDemo from "./demos/tree-disabled-node-demo"
import FilteringDemo from "./demos/tree-filtering-demo"
import LinksDemo from "./demos/tree-links-demo"
import NodeShorthandDemo from "./demos/tree-node-shorthand-demo"
import NodesDemo from "./demos/tree-nodes-demo"
import SizeDemo from "./demos/tree-size-demo"

const demos = [
  {component: AddRemoveDemo, title: "Add Remove"},
  {component: CheckboxDemo, title: "Checkbox"},
  {component: DefaultExpandedDemo, title: "Default Expanded"},
  {component: DisabledNodeDemo, title: "Disabled Node"},
  {component: FilteringDemo, title: "Filtering"},
  {component: LinksDemo, title: "Links"},
  {component: NodeShorthandDemo, title: "Node Shorthand"},
  {component: NodesDemo, title: "Nodes"},
  {component: SizeDemo, title: "Size"},
]

export default function TreeDemos() {
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
