import {SliderCompositeDemo as CompositeDemo} from "@qualcomm-ui/react-docs/components+/slider+/demos/slider-composite-demo"
import {SliderDisabledDemo as DisabledDemo} from "@qualcomm-ui/react-docs/components+/slider+/demos/slider-disabled-demo"
import {SliderDisplayDemo as DisplayDemo} from "@qualcomm-ui/react-docs/components+/slider+/demos/slider-display-demo"
import {SliderFocusCallbackDemo as FocusCallbackDemo} from "@qualcomm-ui/react-docs/components+/slider+/demos/slider-focus-callback-demo"
import {SliderHintDemo as HintDemo} from "@qualcomm-ui/react-docs/components+/slider+/demos/slider-hint-demo"
import {SliderMarkersDemo as MarkersDemo} from "@qualcomm-ui/react-docs/components+/slider+/demos/slider-markers-demo"
import {SliderMinMaxStepDemo as MinMaxStepDemo} from "@qualcomm-ui/react-docs/components+/slider+/demos/slider-min-max-step-demo"
import {SliderMinStepsDemo as MinStepsDemo} from "@qualcomm-ui/react-docs/components+/slider+/demos/slider-min-steps-demo"
import {SliderOriginDemo as OriginDemo} from "@qualcomm-ui/react-docs/components+/slider+/demos/slider-origin-demo"
import {SliderRangeDemo as RangeDemo} from "@qualcomm-ui/react-docs/components+/slider+/demos/slider-range-demo"
import {SliderReactHookFormDemo as ReactHookFormDemo} from "@qualcomm-ui/react-docs/components+/slider+/demos/slider-react-hook-form-demo"
import {SliderSideMarkersDemo as SideMarkersDemo} from "@qualcomm-ui/react-docs/components+/slider+/demos/slider-side-markers-demo"
import {SliderSimpleDemo as SimpleDemo} from "@qualcomm-ui/react-docs/components+/slider+/demos/slider-simple-demo"
import {SliderSizeDemo as SizeDemo} from "@qualcomm-ui/react-docs/components+/slider+/demos/slider-size-demo"
import {SliderTanstackFormDemo as TanstackFormDemo} from "@qualcomm-ui/react-docs/components+/slider+/demos/slider-tanstack-form-demo"
import {SliderTooltipDemo as TooltipDemo} from "@qualcomm-ui/react-docs/components+/slider+/demos/slider-tooltip-demo"
import {SliderValueCallbackDemo as ValueCallbackDemo} from "@qualcomm-ui/react-docs/components+/slider+/demos/slider-value-callback-demo"
import {SliderVariantDemo as VariantDemo} from "@qualcomm-ui/react-docs/components+/slider+/demos/slider-variant-demo"
import {SliderVerticalDemo as VerticalDemo} from "@qualcomm-ui/react-docs/components+/slider+/demos/slider-vertical-demo"

import {DemoPageLayout} from "~/components/demo-page-layout"

const demos = [
  {component: CompositeDemo, title: "Composite"},
  {component: DisabledDemo, title: "Disabled"},
  {component: DisplayDemo, title: "Display"},
  {component: FocusCallbackDemo, title: "Focus Callback"},
  {component: HintDemo, title: "Hint"},
  {component: MarkersDemo, title: "Markers"},
  {component: MinMaxStepDemo, title: "Min Max Step"},
  {component: MinStepsDemo, title: "Min Steps"},
  {component: OriginDemo, title: "Origin"},
  {component: RangeDemo, title: "Range"},
  {component: ReactHookFormDemo, title: "React Hook Form"},
  {component: SideMarkersDemo, title: "Side Markers"},
  {component: SimpleDemo, title: "Simple"},
  {component: SizeDemo, title: "Size"},
  {component: TanstackFormDemo, title: "Tanstack Form"},
  {component: TooltipDemo, title: "Tooltip"},
  {component: ValueCallbackDemo, title: "Value Callback"},
  {component: VariantDemo, title: "Variant"},
  {component: VerticalDemo, title: "Vertical"},
]

export default function SliderDemos() {
  return <DemoPageLayout componentName="slider" demos={demos} />
}
