import {SelectAriaLabelDemo as AriaLabelDemo} from "@qualcomm-ui/react-docs/components+/select+/demos/select-aria-label-demo"
import {SelectCompositeDemo as CompositeDemo} from "@qualcomm-ui/react-docs/components+/select+/demos/select-composite-demo"
import {SelectControlledStateDemo as ControlledStateDemo} from "@qualcomm-ui/react-docs/components+/select+/demos/select-controlled-state-demo"
import {SelectErrorDemo as ErrorDemo} from "@qualcomm-ui/react-docs/components+/select+/demos/select-error-demo"
import {SelectHintDemo as HintDemo} from "@qualcomm-ui/react-docs/components+/select+/demos/select-hint-demo"
import {SelectHookFormDemo as HookFormDemo} from "@qualcomm-ui/react-docs/components+/select+/demos/select-hook-form-demo"
import {SelectIconDemo as IconDemo} from "@qualcomm-ui/react-docs/components+/select+/demos/select-icon-demo"
import {SelectItemsDemo as ItemsDemo} from "@qualcomm-ui/react-docs/components+/select+/demos/select-items-demo"
import {SelectMaxHeightDemo as MaxHeightDemo} from "@qualcomm-ui/react-docs/components+/select+/demos/select-max-height-demo"
import {SelectMultipleDemo as MultipleDemo} from "@qualcomm-ui/react-docs/components+/select+/demos/select-multiple-demo"
import {SelectSameWidthDemo as SameWidthDemo} from "@qualcomm-ui/react-docs/components+/select+/demos/select-same-width-demo"
import {SelectSimpleDemo as SimpleDemo} from "@qualcomm-ui/react-docs/components+/select+/demos/select-simple-demo"
import {SelectSizesDemo as SizesDemo} from "@qualcomm-ui/react-docs/components+/select+/demos/select-sizes-demo"
import {SelectStatesDemo as StatesDemo} from "@qualcomm-ui/react-docs/components+/select+/demos/select-states-demo"
import {SelectTanstackFormDemo as TanstackFormDemo} from "@qualcomm-ui/react-docs/components+/select+/demos/select-tanstack-form-demo"
import {SelectWithinDialogDemo as WithinDialogDemo} from "@qualcomm-ui/react-docs/components+/select+/demos/select-within-dialog-demo"
import {SelectWithinPopoverDemo as WithinPopoverDemo} from "@qualcomm-ui/react-docs/components+/select+/demos/select-within-popover-demo"

import {DemoPageLayout} from "~/components/demo-page-layout"

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
  return <DemoPageLayout componentName="select" demos={demos} />
}
