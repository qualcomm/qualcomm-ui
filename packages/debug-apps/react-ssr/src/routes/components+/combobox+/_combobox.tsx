import AriaLabelDemo from "./demos/combobox-aria-label-demo"
import AsyncDemo from "./demos/combobox-async-demo"
import CompositeDemo from "./demos/combobox-composite-demo"
import ControlledStateDemo from "./demos/combobox-controlled-state-demo"
import ErrorDemo from "./demos/combobox-error-demo"
import HighlightDemo from "./demos/combobox-highlight-demo"
import HintDemo from "./demos/combobox-hint-demo"
import HookFormDemo from "./demos/combobox-hook-form-demo"
import IconCustomizationDemo from "./demos/combobox-icon-customization-demo"
import IconDemo from "./demos/combobox-icon-demo"
import InputBehaviorDemo from "./demos/combobox-input-behavior-demo"
import ItemsDemo from "./demos/combobox-items-demo"
import MaxHeightDemo from "./demos/combobox-max-height-demo"
import MultiFieldSearchDemo from "./demos/combobox-multi-field-search-demo"
import MultipleDemo from "./demos/combobox-multiple-demo"
import OpenOnClickDemo from "./demos/combobox-open-on-click-demo"
import RenderItemDemo from "./demos/combobox-render-item-demo"
import SameWidthDemo from "./demos/combobox-same-width-demo"
import SimpleDemo from "./demos/combobox-simple-demo"
import SizesDemo from "./demos/combobox-sizes-demo"
import StatesDemo from "./demos/combobox-states-demo"
import TanstackFormDemo from "./demos/combobox-tanstack-form-demo"
import VirtualDemo from "./demos/combobox-virtual-demo"
import WithinDialogDemo from "./demos/combobox-within-dialog-demo"
import WithinPopoverDemo from "./demos/combobox-within-popover-demo"

const demos = [
  {component: AriaLabelDemo, title: "Aria Label"},
  {component: AsyncDemo, title: "Async"},
  {component: CompositeDemo, title: "Composite"},
  {component: ControlledStateDemo, title: "Controlled State"},
  {component: ErrorDemo, title: "Error"},
  {component: HighlightDemo, title: "Highlight"},
  {component: HintDemo, title: "Hint"},
  {component: HookFormDemo, title: "Hook Form"},
  {component: IconCustomizationDemo, title: "Icon Customization"},
  {component: IconDemo, title: "Icon"},
  {component: InputBehaviorDemo, title: "Input Behavior"},
  {component: ItemsDemo, title: "Items"},
  {component: MaxHeightDemo, title: "Max Height"},
  {component: MultiFieldSearchDemo, title: "Multi Field Search"},
  {component: MultipleDemo, title: "Multiple"},
  {component: OpenOnClickDemo, title: "Open On Click"},
  {component: RenderItemDemo, title: "Render Item"},
  {component: SameWidthDemo, title: "Same Width"},
  {component: SimpleDemo, title: "Simple"},
  {component: SizesDemo, title: "Sizes"},
  {component: StatesDemo, title: "States"},
  {component: TanstackFormDemo, title: "Tanstack Form"},
  {component: VirtualDemo, title: "Virtual"},
  {component: WithinDialogDemo, title: "Within Dialog"},
  {component: WithinPopoverDemo, title: "Within Popover"},
]

export default function ComboboxDemos() {
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
