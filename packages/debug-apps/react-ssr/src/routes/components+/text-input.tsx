import {TextInputClearTriggerDemo as ClearTriggerDemo} from "@qualcomm-ui/react-docs/components+/text-input+/demos/text-input-clear-trigger-demo"
import {TextInputCompositeDemo as CompositeDemo} from "@qualcomm-ui/react-docs/components+/text-input+/demos/text-input-composite-demo"
import {TextInputCompositeLayoutDemo as CompositeLayoutDemo} from "@qualcomm-ui/react-docs/components+/text-input+/demos/text-input-composite-layout-demo"
import {TextInputControlledStateDemo as ControlledStateDemo} from "@qualcomm-ui/react-docs/components+/text-input+/demos/text-input-controlled-state-demo"
import {TextInputErrorTextDemo as ErrorTextDemo} from "@qualcomm-ui/react-docs/components+/text-input+/demos/text-input-error-text-demo"
import {TextInputReactHookFormDemo as ReactHookFormDemo} from "@qualcomm-ui/react-docs/components+/text-input+/demos/text-input-react-hook-form-demo"
import {TextInputSimpleDemo as SimpleDemo} from "@qualcomm-ui/react-docs/components+/text-input+/demos/text-input-simple-demo"
import {TextInputSimpleIconsDemo as SimpleIconsDemo} from "@qualcomm-ui/react-docs/components+/text-input+/demos/text-input-simple-icons-demo"
import {TextInputSizesDemo as SizesDemo} from "@qualcomm-ui/react-docs/components+/text-input+/demos/text-input-sizes-demo"
import {TextInputStatesDemo as StatesDemo} from "@qualcomm-ui/react-docs/components+/text-input+/demos/text-input-states-demo"
import {TextInputTanstackFormDemo as TanstackFormDemo} from "@qualcomm-ui/react-docs/components+/text-input+/demos/text-input-tanstack-form-demo"

import {DemoPageLayout} from "~/components/demo-page-layout"

const demos = [
  {component: ClearTriggerDemo, title: "Clear Trigger"},
  {component: CompositeDemo, title: "Composite"},
  {component: CompositeLayoutDemo, title: "Composite Layout"},
  {component: ControlledStateDemo, title: "Controlled State"},
  {component: ErrorTextDemo, title: "Error Text"},
  {component: ReactHookFormDemo, title: "React Hook Form"},
  {component: SimpleDemo, title: "Simple"},
  {component: SimpleIconsDemo, title: "Simple Icons"},
  {component: SizesDemo, title: "Sizes"},
  {component: StatesDemo, title: "States"},
  {component: TanstackFormDemo, title: "Tanstack Form"},
]

export default function TextInputDemos() {
  return <DemoPageLayout componentName="text-input" demos={demos} />
}
