import {CheckboxCompositeLayoutDemo as CompositeLayoutDemo} from "@qualcomm-ui/react-docs/components+/checkbox+/demos/checkbox-composite-layout-demo"
import {CheckboxControlledDemo as ControlledDemo} from "@qualcomm-ui/react-docs/components+/checkbox+/demos/checkbox-controlled-demo"
import {CheckboxDisabledDemo as DisabledDemo} from "@qualcomm-ui/react-docs/components+/checkbox+/demos/checkbox-disabled-demo"
import {CheckboxReactHookFormDemo as ReactHookFormDemo} from "@qualcomm-ui/react-docs/components+/checkbox+/demos/checkbox-react-hook-form-demo"
import {CheckboxSimpleDemo as SimpleDemo} from "@qualcomm-ui/react-docs/components+/checkbox+/demos/checkbox-simple-demo"
import {CheckboxSizesDemo as SizesDemo} from "@qualcomm-ui/react-docs/components+/checkbox+/demos/checkbox-sizes-demo"
import {CheckboxStatesDemo as StatesDemo} from "@qualcomm-ui/react-docs/components+/checkbox+/demos/checkbox-states-demo"
import {CheckboxTanstackFormDemo as TanstackFormDemo} from "@qualcomm-ui/react-docs/components+/checkbox+/demos/checkbox-tanstack-form-demo"

import {DemoPageLayout} from "~/components/demo-page-layout"

const demos = [
  {component: CompositeLayoutDemo, title: "Composite Layout"},
  {component: ControlledDemo, title: "Controlled"},
  {component: DisabledDemo, title: "Disabled"},
  {component: ReactHookFormDemo, title: "React Hook Form"},
  {component: SimpleDemo, title: "Simple"},
  {component: SizesDemo, title: "Sizes"},
  {component: StatesDemo, title: "States"},
  {component: TanstackFormDemo, title: "Tanstack Form"},
]

export default function CheckboxDemos() {
  return <DemoPageLayout componentName="checkbox" demos={demos} />
}
