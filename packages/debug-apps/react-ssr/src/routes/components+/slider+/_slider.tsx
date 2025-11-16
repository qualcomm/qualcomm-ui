import CompositeDemo from "@qualcomm-ui/react-docs/components+/slider+/demos/slider-composite-demo"
import DisabledDemo from "@qualcomm-ui/react-docs/components+/slider+/demos/slider-disabled-demo"
import DisplayDemo from "@qualcomm-ui/react-docs/components+/slider+/demos/slider-display-demo"
import FocusCallbackDemo from "@qualcomm-ui/react-docs/components+/slider+/demos/slider-focus-callback-demo"
import HintDemo from "@qualcomm-ui/react-docs/components+/slider+/demos/slider-hint-demo"
import MarkersDemo from "@qualcomm-ui/react-docs/components+/slider+/demos/slider-markers-demo"
import MinMaxStepDemo from "@qualcomm-ui/react-docs/components+/slider+/demos/slider-min-max-step-demo"
import MinStepsDemo from "@qualcomm-ui/react-docs/components+/slider+/demos/slider-min-steps-demo"
import OriginDemo from "@qualcomm-ui/react-docs/components+/slider+/demos/slider-origin-demo"
import RangeDemo from "@qualcomm-ui/react-docs/components+/slider+/demos/slider-range-demo"
import ReactHookFormDemo from "@qualcomm-ui/react-docs/components+/slider+/demos/slider-react-hook-form-demo"
import SideMarkersDemo from "@qualcomm-ui/react-docs/components+/slider+/demos/slider-side-markers-demo"
import SimpleDemo from "@qualcomm-ui/react-docs/components+/slider+/demos/slider-simple-demo"
import SizeDemo from "@qualcomm-ui/react-docs/components+/slider+/demos/slider-size-demo"
import TanstackFormDemo from "@qualcomm-ui/react-docs/components+/slider+/demos/slider-tanstack-form-demo"
import TooltipDemo from "@qualcomm-ui/react-docs/components+/slider+/demos/slider-tooltip-demo"
import ValueCallbackDemo from "@qualcomm-ui/react-docs/components+/slider+/demos/slider-value-callback-demo"
import VariantDemo from "@qualcomm-ui/react-docs/components+/slider+/demos/slider-variant-demo"
import VerticalDemo from "@qualcomm-ui/react-docs/components+/slider+/demos/slider-vertical-demo"

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
