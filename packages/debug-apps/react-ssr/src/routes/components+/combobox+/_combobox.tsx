import AriaLabelDemo from "@qualcomm-ui/react-docs/components+/combobox+/demos/combobox-aria-label-demo"
import AsyncDemo from "@qualcomm-ui/react-docs/components+/combobox+/demos/combobox-async-demo"
import CompositeDemo from "@qualcomm-ui/react-docs/components+/combobox+/demos/combobox-composite-demo"
import ControlledStateDemo from "@qualcomm-ui/react-docs/components+/combobox+/demos/combobox-controlled-state-demo"
import ErrorDemo from "@qualcomm-ui/react-docs/components+/combobox+/demos/combobox-error-demo"
import HighlightDemo from "@qualcomm-ui/react-docs/components+/combobox+/demos/combobox-highlight-demo"
import HintDemo from "@qualcomm-ui/react-docs/components+/combobox+/demos/combobox-hint-demo"
import HookFormDemo from "@qualcomm-ui/react-docs/components+/combobox+/demos/combobox-hook-form-demo"
import IconCustomizationDemo from "@qualcomm-ui/react-docs/components+/combobox+/demos/combobox-icon-customization-demo"
import IconDemo from "@qualcomm-ui/react-docs/components+/combobox+/demos/combobox-icon-demo"
import InputBehaviorDemo from "@qualcomm-ui/react-docs/components+/combobox+/demos/combobox-input-behavior-demo"
import ItemsDemo from "@qualcomm-ui/react-docs/components+/combobox+/demos/combobox-items-demo"
import MaxHeightDemo from "@qualcomm-ui/react-docs/components+/combobox+/demos/combobox-max-height-demo"
import MultiFieldSearchDemo from "@qualcomm-ui/react-docs/components+/combobox+/demos/combobox-multi-field-search-demo"
import MultipleDemo from "@qualcomm-ui/react-docs/components+/combobox+/demos/combobox-multiple-demo"
import OpenOnClickDemo from "@qualcomm-ui/react-docs/components+/combobox+/demos/combobox-open-on-click-demo"
import RenderItemDemo from "@qualcomm-ui/react-docs/components+/combobox+/demos/combobox-render-item-demo"
import SameWidthDemo from "@qualcomm-ui/react-docs/components+/combobox+/demos/combobox-same-width-demo"
import SimpleDemo from "@qualcomm-ui/react-docs/components+/combobox+/demos/combobox-simple-demo"
import SizesDemo from "@qualcomm-ui/react-docs/components+/combobox+/demos/combobox-sizes-demo"
import StatesDemo from "@qualcomm-ui/react-docs/components+/combobox+/demos/combobox-states-demo"
import TanstackFormDemo from "@qualcomm-ui/react-docs/components+/combobox+/demos/combobox-tanstack-form-demo"
import VirtualDemo from "@qualcomm-ui/react-docs/components+/combobox+/demos/combobox-virtual-demo"
import WithinDialogDemo from "@qualcomm-ui/react-docs/components+/combobox+/demos/combobox-within-dialog-demo"
import WithinPopoverDemo from "@qualcomm-ui/react-docs/components+/combobox+/demos/combobox-within-popover-demo"

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
