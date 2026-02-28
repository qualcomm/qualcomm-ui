import {SwitchCompositeLayoutDemo as CompositeLayoutDemo} from "@qualcomm-ui/react-docs/components+/switch+/demos/switch-composite-layout-demo"
import {SwitchControlledDemo as ControlledDemo} from "@qualcomm-ui/react-docs/components+/switch+/demos/switch-controlled-demo"
import {SwitchDisabledDemo as DisabledDemo} from "@qualcomm-ui/react-docs/components+/switch+/demos/switch-disabled-demo"
import {SwitchReactHookFormDemo as ReactHookFormDemo} from "@qualcomm-ui/react-docs/components+/switch+/demos/switch-react-hook-form-demo"
import {SwitchSimpleDemo as SimpleDemo} from "@qualcomm-ui/react-docs/components+/switch+/demos/switch-simple-demo"
import {SwitchSizesDemo as SizesDemo} from "@qualcomm-ui/react-docs/components+/switch+/demos/switch-sizes-demo"
import {SwitchStatesDemo as StatesDemo} from "@qualcomm-ui/react-docs/components+/switch+/demos/switch-states-demo"
import {SwitchTanstackFormDemo as TanstackFormDemo} from "@qualcomm-ui/react-docs/components+/switch+/demos/switch-tanstack-form-demo"

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

export default function SwitchDemos() {
  return <DemoPageLayout componentName="switch" demos={demos} />
}
