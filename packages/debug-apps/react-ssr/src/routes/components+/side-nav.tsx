import {SideNavCollapsedDemo as CollapsedDemo} from "@qualcomm-ui/react-docs/components+/side-nav+/demos/side-nav-collapsed-demo"
import {SideNavDefaultExpandedDemo as DefaultExpandedDemo} from "@qualcomm-ui/react-docs/components+/side-nav+/demos/side-nav-default-expanded-demo"
import {SideNavDisabledNodeDemo as DisabledNodeDemo} from "@qualcomm-ui/react-docs/components+/side-nav+/demos/side-nav-disabled-node-demo"
import {SideNavFilteringDemo as FilteringDemo} from "@qualcomm-ui/react-docs/components+/side-nav+/demos/side-nav-filtering-demo"
import {SideNavGroupsDemo as GroupsDemo} from "@qualcomm-ui/react-docs/components+/side-nav+/demos/side-nav-groups-demo"
import {SideNavLinksDemo as LinksDemo} from "@qualcomm-ui/react-docs/components+/side-nav+/demos/side-nav-links-demo"
import {SideNavNodeShorthandDemo as NodeShorthandDemo} from "@qualcomm-ui/react-docs/components+/side-nav+/demos/side-nav-node-shorthand-demo"
import {SideNavSurfaceDemo as SurfaceDemo} from "@qualcomm-ui/react-docs/components+/side-nav+/demos/side-nav-surface-demo"

import {DemoPageLayout} from "~/components/demo-page-layout"

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
  return <DemoPageLayout componentName="side-nav" demos={demos} />
}
