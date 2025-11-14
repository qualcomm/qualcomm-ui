import CollapsibleDemo from "./demos/accordion-collapsible-demo"
import CompositeDemo from "./demos/accordion-composite-demo"
import CompositeLayoutDemo from "./demos/accordion-composite-layout-demo"
import ControlledStateDemo from "./demos/accordion-controlled-state-demo"
import DefaultValueDemo from "./demos/accordion-default-value-demo"
import DisabledDemo from "./demos/accordion-disabled-demo"
import FocusCallbackDemo from "./demos/accordion-focus-callback-demo"
import IconDemo from "./demos/accordion-icon-demo"
import MultipleDemo from "./demos/accordion-multiple-demo"
import SecondaryTextDemo from "./demos/accordion-secondary-text-demo"
import SimpleDemo from "./demos/accordion-simple-demo"
import SizeDemo from "./demos/accordion-size-demo"
import UncontainedDemo from "./demos/accordion-uncontained-demo"

const demos = [
  {component: CollapsibleDemo, title: "Collapsible"},
  {component: CompositeDemo, title: "Composite"},
  {component: CompositeLayoutDemo, title: "Composite Layout"},
  {component: ControlledStateDemo, title: "Controlled State"},
  {component: DefaultValueDemo, title: "Default Value"},
  {component: DisabledDemo, title: "Disabled"},
  {component: FocusCallbackDemo, title: "Focus Callback"},
  {component: IconDemo, title: "Icon"},
  {component: MultipleDemo, title: "Multiple"},
  {component: SecondaryTextDemo, title: "Secondary Text"},
  {component: SimpleDemo, title: "Simple"},
  {component: SizeDemo, title: "Size"},
  {component: UncontainedDemo, title: "Uncontained"},
]

export default function AccordionDemos() {
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
