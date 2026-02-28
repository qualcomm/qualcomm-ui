import {MenuAnchorPointDemo as AnchorPointDemo} from "@qualcomm-ui/react-docs/components+/menu+/demos/menu-anchor-point-demo"
import {MenuAvatarDemo as AvatarDemo} from "@qualcomm-ui/react-docs/components+/menu+/demos/menu-avatar-demo"
import {MenuCheckboxItemsDemo as CheckboxItemsDemo} from "@qualcomm-ui/react-docs/components+/menu+/demos/menu-checkbox-items-demo"
import {MenuCheckboxSelectionStateDemo as CheckboxSelectionStateDemo} from "@qualcomm-ui/react-docs/components+/menu+/demos/menu-checkbox-selection-state-demo"
import {MenuContextMenuDemo as ContextMenuDemo} from "@qualcomm-ui/react-docs/components+/menu+/demos/menu-context-menu-demo"
import {MenuControlledStateDemo as ControlledStateDemo} from "@qualcomm-ui/react-docs/components+/menu+/demos/menu-controlled-state-demo"
import {MenuHideWhenDetachedDemo as HideWhenDetachedDemo} from "@qualcomm-ui/react-docs/components+/menu+/demos/menu-hide-when-detached-demo"
import {MenuItemCustomizationDemo as ItemCustomizationDemo} from "@qualcomm-ui/react-docs/components+/menu+/demos/menu-item-customization-demo"
import {MenuLinksDemo as LinksDemo} from "@qualcomm-ui/react-docs/components+/menu+/demos/menu-links-demo"
import {MenuNestedDemo as NestedDemo} from "@qualcomm-ui/react-docs/components+/menu+/demos/menu-nested-demo"
import {MenuPlacementDemo as PlacementDemo} from "@qualcomm-ui/react-docs/components+/menu+/demos/menu-placement-demo"
import {MenuRadioGroupDemo as RadioGroupDemo} from "@qualcomm-ui/react-docs/components+/menu+/demos/menu-radio-group-demo"
import {MenuSizesDemo as SizesDemo} from "@qualcomm-ui/react-docs/components+/menu+/demos/menu-sizes-demo"
import {MenuWithinDialogDemo as WithinDialogDemo} from "@qualcomm-ui/react-docs/components+/menu+/demos/menu-within-dialog-demo"

import {DemoPageLayout} from "~/components/demo-page-layout"

const demos = [
  {component: AnchorPointDemo, title: "Anchor Point"},
  {component: AvatarDemo, title: "Avatar"},
  {component: CheckboxItemsDemo, title: "Checkbox Items"},
  {component: CheckboxSelectionStateDemo, title: "Checkbox Selection State"},
  {component: ContextMenuDemo, title: "Context Menu"},
  {component: ControlledStateDemo, title: "Controlled State"},
  {component: HideWhenDetachedDemo, title: "Hide When Detached"},
  {component: ItemCustomizationDemo, title: "Item Customization"},
  {component: LinksDemo, title: "Links"},
  {component: NestedDemo, title: "Nested"},
  {component: PlacementDemo, title: "Placement"},
  {component: RadioGroupDemo, title: "Radio Group"},
  {component: SizesDemo, title: "Sizes"},
  {component: WithinDialogDemo, title: "Within Dialog"},
]

export default function MenuDemos() {
  return <DemoPageLayout componentName="menu" demos={demos} />
}
