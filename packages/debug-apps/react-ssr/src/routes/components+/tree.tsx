import {TreeAddRemoveDemo as AddRemoveDemo} from "@qualcomm-ui/react-docs/components+/tree+/demos/tree-add-remove-demo"
import {TreeCheckboxDemo as CheckboxDemo} from "@qualcomm-ui/react-docs/components+/tree+/demos/tree-checkbox-demo"
import {TreeDefaultExpandedDemo as DefaultExpandedDemo} from "@qualcomm-ui/react-docs/components+/tree+/demos/tree-default-expanded-demo"
import {TreeDisabledNodeDemo as DisabledNodeDemo} from "@qualcomm-ui/react-docs/components+/tree+/demos/tree-disabled-node-demo"
import {TreeFilteringDemo as FilteringDemo} from "@qualcomm-ui/react-docs/components+/tree+/demos/tree-filtering-demo"
import {TreeLinksDemo as LinksDemo} from "@qualcomm-ui/react-docs/components+/tree+/demos/tree-links-demo"
import {TreeNodeShorthandDemo as NodeShorthandDemo} from "@qualcomm-ui/react-docs/components+/tree+/demos/tree-node-shorthand-demo"
import {TreeNodesDemo as NodesDemo} from "@qualcomm-ui/react-docs/components+/tree+/demos/tree-nodes-demo"
import {TreeSizeDemo as SizeDemo} from "@qualcomm-ui/react-docs/components+/tree+/demos/tree-size-demo"

import {DemoPageLayout} from "~/components/demo-page-layout"

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
  return <DemoPageLayout componentName="tree" demos={demos} />
}
