import {NumberInputCompositeDemo as CompositeDemo} from "@qualcomm-ui/react-docs/components+/number-input+/demos/number-input-composite-demo"
import {NumberInputControlledDemo as ControlledDemo} from "@qualcomm-ui/react-docs/components+/number-input+/demos/number-input-controlled-demo"
import {NumberInputErrorTextDemo as ErrorTextDemo} from "@qualcomm-ui/react-docs/components+/number-input+/demos/number-input-error-text-demo"
import {NumberInputMinMaxDemo as MinMaxDemo} from "@qualcomm-ui/react-docs/components+/number-input+/demos/number-input-min-max-demo"
import {NumberInputSimpleDemo as SimpleDemo} from "@qualcomm-ui/react-docs/components+/number-input+/demos/number-input-simple-demo"
import {NumberInputSizesDemo as SizesDemo} from "@qualcomm-ui/react-docs/components+/number-input+/demos/number-input-sizes-demo"
import {NumberInputStatesDemo as StatesDemo} from "@qualcomm-ui/react-docs/components+/number-input+/demos/number-input-states-demo"
import {NumberInputStepDemo as StepDemo} from "@qualcomm-ui/react-docs/components+/number-input+/demos/number-input-step-demo"

import {DemoPageLayout} from "~/components/demo-page-layout"

const demos = [
  {component: CompositeDemo, title: "Composite"},
  {component: ControlledDemo, title: "Controlled"},
  {component: ErrorTextDemo, title: "Error Text"},
  {component: MinMaxDemo, title: "Min Max"},
  {component: SimpleDemo, title: "Simple"},
  {component: SizesDemo, title: "Sizes"},
  {component: StatesDemo, title: "States"},
  {component: StepDemo, title: "Step"},
]

export default function NumberInputDemos() {
  return <DemoPageLayout componentName="number-input" demos={demos} />
}
