import AnchorPointDemo from "./demos/menu-anchor-point-demo"
import AvatarDemo from "./demos/menu-avatar-demo"
import CheckboxItemsDemo from "./demos/menu-checkbox-items-demo"
import CheckboxSelectionStateDemo from "./demos/menu-checkbox-selection-state-demo"
import ContextMenuDemo from "./demos/menu-context-menu-demo"
import ControlledStateDemo from "./demos/menu-controlled-state-demo"
import HideWhenDetachedDemo from "./demos/menu-hide-when-detached-demo"
import ItemCustomizationDemo from "./demos/menu-item-customization-demo"
import LinksDemo from "./demos/menu-links-demo"
import NestedDemo from "./demos/menu-nested-demo"
import PlacementDemo from "./demos/menu-placement-demo"
import RadioGroupDemo from "./demos/menu-radio-group-demo"
import SizesDemo from "./demos/menu-sizes-demo"
import WithinDialogDemo from "./demos/menu-within-dialog-demo"

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
