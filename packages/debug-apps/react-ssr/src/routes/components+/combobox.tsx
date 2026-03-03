import {ComboboxAriaLabelDemo as AriaLabelDemo} from "@qualcomm-ui/react-docs/components+/combobox+/demos/combobox-aria-label-demo"
import {ComboboxAsyncDemo as AsyncDemo} from "@qualcomm-ui/react-docs/components+/combobox+/demos/combobox-async-demo"
import {ComboboxCompositeDemo as CompositeDemo} from "@qualcomm-ui/react-docs/components+/combobox+/demos/combobox-composite-demo"
import {ComboboxControlledStateDemo as ControlledStateDemo} from "@qualcomm-ui/react-docs/components+/combobox+/demos/combobox-controlled-state-demo"
import {ComboboxErrorDemo as ErrorDemo} from "@qualcomm-ui/react-docs/components+/combobox+/demos/combobox-error-demo"
import {ComboboxHighlightDemo as HighlightDemo} from "@qualcomm-ui/react-docs/components+/combobox+/demos/combobox-highlight-demo"
import {ComboboxHintDemo as HintDemo} from "@qualcomm-ui/react-docs/components+/combobox+/demos/combobox-hint-demo"
import {ComboboxHookFormDemo as HookFormDemo} from "@qualcomm-ui/react-docs/components+/combobox+/demos/combobox-hook-form-demo"
import {ComboboxIconCustomizationDemo as IconCustomizationDemo} from "@qualcomm-ui/react-docs/components+/combobox+/demos/combobox-icon-customization-demo"
import {ComboboxIconDemo as IconDemo} from "@qualcomm-ui/react-docs/components+/combobox+/demos/combobox-icon-demo"
import {ComboboxInputBehaviorDemo as InputBehaviorDemo} from "@qualcomm-ui/react-docs/components+/combobox+/demos/combobox-input-behavior-demo"
import {ComboboxItemsDemo as ItemsDemo} from "@qualcomm-ui/react-docs/components+/combobox+/demos/combobox-items-demo"
import {ComboboxMaxHeightDemo as MaxHeightDemo} from "@qualcomm-ui/react-docs/components+/combobox+/demos/combobox-max-height-demo"
import {ComboboxMultiFieldSearchDemo as MultiFieldSearchDemo} from "@qualcomm-ui/react-docs/components+/combobox+/demos/combobox-multi-field-search-demo"
import {ComboboxMultipleDemo as MultipleDemo} from "@qualcomm-ui/react-docs/components+/combobox+/demos/combobox-multiple-demo"
import {ComboboxOpenOnClickDemo as OpenOnClickDemo} from "@qualcomm-ui/react-docs/components+/combobox+/demos/combobox-open-on-click-demo"
import {ComboboxRenderItemDemo as RenderItemDemo} from "@qualcomm-ui/react-docs/components+/combobox+/demos/combobox-render-item-demo"
import {ComboboxSameWidthDemo as SameWidthDemo} from "@qualcomm-ui/react-docs/components+/combobox+/demos/combobox-same-width-demo"
import {ComboboxSimpleDemo as SimpleDemo} from "@qualcomm-ui/react-docs/components+/combobox+/demos/combobox-simple-demo"
import {ComboboxSizesDemo as SizesDemo} from "@qualcomm-ui/react-docs/components+/combobox+/demos/combobox-sizes-demo"
import {ComboboxStatesDemo as StatesDemo} from "@qualcomm-ui/react-docs/components+/combobox+/demos/combobox-states-demo"
import {ComboboxTanstackFormDemo as TanstackFormDemo} from "@qualcomm-ui/react-docs/components+/combobox+/demos/combobox-tanstack-form-demo"
import {ComboboxVirtualDemo as VirtualDemo} from "@qualcomm-ui/react-docs/components+/combobox+/demos/combobox-virtual-demo"
import {ComboboxWithinDialogDemo as WithinDialogDemo} from "@qualcomm-ui/react-docs/components+/combobox+/demos/combobox-within-dialog-demo"
import {ComboboxWithinPopoverDemo as WithinPopoverDemo} from "@qualcomm-ui/react-docs/components+/combobox+/demos/combobox-within-popover-demo"

import {DemoPageLayout} from "~/components/demo-page-layout"

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
  return <DemoPageLayout componentName="combobox" demos={demos} />
}
