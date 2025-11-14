import AriaLabelDemo from "./demos/select-aria-label-demo"
import CompositeDemo from "./demos/select-composite-demo"
import ControlledStateDemo from "./demos/select-controlled-state-demo"
import ErrorDemo from "./demos/select-error-demo"
import HintDemo from "./demos/select-hint-demo"
import HookFormDemo from "./demos/select-hook-form-demo"
import IconDemo from "./demos/select-icon-demo"
import ItemsDemo from "./demos/select-items-demo"
import MaxHeightDemo from "./demos/select-max-height-demo"
import MultipleDemo from "./demos/select-multiple-demo"
import SameWidthDemo from "./demos/select-same-width-demo"
import SimpleDemo from "./demos/select-simple-demo"
import SizesDemo from "./demos/select-sizes-demo"
import StatesDemo from "./demos/select-states-demo"
import TanstackFormDemo from "./demos/select-tanstack-form-demo"
import WithinDialogDemo from "./demos/select-within-dialog-demo"
import WithinPopoverDemo from "./demos/select-within-popover-demo"

const demos = [
  {component: AriaLabelDemo, title: "Aria Label"},
  {component: CompositeDemo, title: "Composite"},
  {component: ControlledStateDemo, title: "Controlled State"},
  {component: ErrorDemo, title: "Error"},
  {component: HintDemo, title: "Hint"},
  {component: HookFormDemo, title: "Hook Form"},
  {component: IconDemo, title: "Icon"},
  {component: ItemsDemo, title: "Items"},
  {component: MaxHeightDemo, title: "Max Height"},
  {component: MultipleDemo, title: "Multiple"},
  {component: SameWidthDemo, title: "Same Width"},
  {component: SimpleDemo, title: "Simple"},
  {component: SizesDemo, title: "Sizes"},
  {component: StatesDemo, title: "States"},
  {component: TanstackFormDemo, title: "Tanstack Form"},
  {component: WithinDialogDemo, title: "Within Dialog"},
  {component: WithinPopoverDemo, title: "Within Popover"},
]

export default function SelectDemos() {
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
