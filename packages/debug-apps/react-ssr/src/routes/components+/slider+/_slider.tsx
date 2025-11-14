import CompositeDemo from "./demos/slider-composite-demo"
import DisabledDemo from "./demos/slider-disabled-demo"
import DisplayDemo from "./demos/slider-display-demo"
import FocusCallbackDemo from "./demos/slider-focus-callback-demo"
import HintDemo from "./demos/slider-hint-demo"
import MarkersDemo from "./demos/slider-markers-demo"
import MinMaxStepDemo from "./demos/slider-min-max-step-demo"
import MinStepsDemo from "./demos/slider-min-steps-demo"
import OriginDemo from "./demos/slider-origin-demo"
import RangeDemo from "./demos/slider-range-demo"
import ReactHookFormDemo from "./demos/slider-react-hook-form-demo"
import SideMarkersDemo from "./demos/slider-side-markers-demo"
import SimpleDemo from "./demos/slider-simple-demo"
import SizeDemo from "./demos/slider-size-demo"
import TanstackFormDemo from "./demos/slider-tanstack-form-demo"
import TooltipDemo from "./demos/slider-tooltip-demo"
import ValueCallbackDemo from "./demos/slider-value-callback-demo"
import VariantDemo from "./demos/slider-variant-demo"
import VerticalDemo from "./demos/slider-vertical-demo"

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
