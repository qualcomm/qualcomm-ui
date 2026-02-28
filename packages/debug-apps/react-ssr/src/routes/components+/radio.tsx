import {RadioCompositeDemo as CompositeDemo} from "@qualcomm-ui/react-docs/components+/radio+/demos/radio-composite-demo"
import {RadioCompositeLayoutDemo as CompositeLayoutDemo} from "@qualcomm-ui/react-docs/components+/radio+/demos/radio-composite-layout-demo"
import {RadioControlledDemo as ControlledDemo} from "@qualcomm-ui/react-docs/components+/radio+/demos/radio-controlled-demo"
import {RadioDisabledDemo as DisabledDemo} from "@qualcomm-ui/react-docs/components+/radio+/demos/radio-disabled-demo"
import {RadioOrientationDemo as OrientationDemo} from "@qualcomm-ui/react-docs/components+/radio+/demos/radio-orientation-demo"
import {RadioReactHookFormDemo as ReactHookFormDemo} from "@qualcomm-ui/react-docs/components+/radio+/demos/radio-react-hook-form-demo"
import {RadioSimpleDemo as SimpleDemo} from "@qualcomm-ui/react-docs/components+/radio+/demos/radio-simple-demo"
import {RadioSizesDemo as SizesDemo} from "@qualcomm-ui/react-docs/components+/radio+/demos/radio-sizes-demo"
import {RadioTanstackFormDemo as TanstackFormDemo} from "@qualcomm-ui/react-docs/components+/radio+/demos/radio-tanstack-form-demo"

import {DemoPageLayout} from "~/components/demo-page-layout"

const demos = [
  {component: CompositeDemo, title: "Composite"},
  {component: CompositeLayoutDemo, title: "Composite Layout"},
  {component: ControlledDemo, title: "Controlled"},
  {component: DisabledDemo, title: "Disabled"},
  {component: OrientationDemo, title: "Orientation"},
  {component: ReactHookFormDemo, title: "React Hook Form"},
  {component: SimpleDemo, title: "Simple"},
  {component: SizesDemo, title: "Sizes"},
  {component: TanstackFormDemo, title: "Tanstack Form"},
]

export default function RadioDemos() {
  return <DemoPageLayout componentName="radio" demos={demos} />
}
