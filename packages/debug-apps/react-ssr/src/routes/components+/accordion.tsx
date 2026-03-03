import {AccordionCollapsibleDemo as CollapsibleDemo} from "@qualcomm-ui/react-docs/components+/accordion+/demos/accordion-collapsible-demo"
import {AccordionCompositeDemo as CompositeDemo} from "@qualcomm-ui/react-docs/components+/accordion+/demos/accordion-composite-demo"
import {AccordionCompositeLayoutDemo as CompositeLayoutDemo} from "@qualcomm-ui/react-docs/components+/accordion+/demos/accordion-composite-layout-demo"
import {AccordionControlledStateDemo as ControlledStateDemo} from "@qualcomm-ui/react-docs/components+/accordion+/demos/accordion-controlled-state-demo"
import {AccordionDefaultValueDemo as DefaultValueDemo} from "@qualcomm-ui/react-docs/components+/accordion+/demos/accordion-default-value-demo"
import {AccordionDisabledDemo as DisabledDemo} from "@qualcomm-ui/react-docs/components+/accordion+/demos/accordion-disabled-demo"
import {AccordionFocusCallbackDemo as FocusCallbackDemo} from "@qualcomm-ui/react-docs/components+/accordion+/demos/accordion-focus-callback-demo"
import {AccordionIconDemo as IconDemo} from "@qualcomm-ui/react-docs/components+/accordion+/demos/accordion-icon-demo"
import {AccordionMultipleDemo as MultipleDemo} from "@qualcomm-ui/react-docs/components+/accordion+/demos/accordion-multiple-demo"
import {AccordionSecondaryTextDemo as SecondaryTextDemo} from "@qualcomm-ui/react-docs/components+/accordion+/demos/accordion-secondary-text-demo"
import {AccordionSimpleDemo as SimpleDemo} from "@qualcomm-ui/react-docs/components+/accordion+/demos/accordion-simple-demo"
import {AccordionSizeDemo as SizeDemo} from "@qualcomm-ui/react-docs/components+/accordion+/demos/accordion-size-demo"
import {AccordionUncontainedDemo as UncontainedDemo} from "@qualcomm-ui/react-docs/components+/accordion+/demos/accordion-uncontained-demo"

import {DemoPageLayout} from "~/components/demo-page-layout"

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
  return <DemoPageLayout componentName="accordion" demos={demos} />
}
