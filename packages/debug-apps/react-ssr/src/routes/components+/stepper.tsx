import {StepperCompletedDemo as CompletedDemo} from "@qualcomm-ui/react-docs/components+/stepper+/demos/stepper-completed-demo"
import {StepperControlledDemo as ControlledDemo} from "@qualcomm-ui/react-docs/components+/stepper+/demos/stepper-controlled-demo"
import {StepperHintDemo as HintDemo} from "@qualcomm-ui/react-docs/components+/stepper+/demos/stepper-hint-demo"
import {StepperHorizontalBottomStartDemo as HorizontalBottomStartDemo} from "@qualcomm-ui/react-docs/components+/stepper+/demos/stepper-horizontal-bottom-start-demo"
import {StepperHorizontalDemo as HorizontalDemo} from "@qualcomm-ui/react-docs/components+/stepper+/demos/stepper-horizontal-demo"
import {StepperHorizontalInlineDemo as HorizontalInlineDemo} from "@qualcomm-ui/react-docs/components+/stepper+/demos/stepper-horizontal-inline-demo"
import {StepperIconDemo as IconDemo} from "@qualcomm-ui/react-docs/components+/stepper+/demos/stepper-icon-demo"
import {StepperLinearDemo as LinearDemo} from "@qualcomm-ui/react-docs/components+/stepper+/demos/stepper-linear-demo"
import {StepperNonlinearDemo as NonLinearDemo} from "@qualcomm-ui/react-docs/components+/stepper+/demos/stepper-nonlinear-demo"
import {StepperNonlinearFormDemo as NonlinearFormDemo} from "@qualcomm-ui/react-docs/components+/stepper+/demos/stepper-nonlinear-form-demo"
import {StepperPendingDemo as PendingDemo} from "@qualcomm-ui/react-docs/components+/stepper+/demos/stepper-pending-demo"
import {StepperSizesDemo as SizesDemo} from "@qualcomm-ui/react-docs/components+/stepper+/demos/stepper-sizes-demo"
import {StepperSkippableStepsDemo as SkippableStepsDemo} from "@qualcomm-ui/react-docs/components+/stepper+/demos/stepper-skippable-steps-demo"
import {StepperVerticalDemo as VerticalDemo} from "@qualcomm-ui/react-docs/components+/stepper+/demos/stepper-vertical-demo"
import {StepperVerticalInlineDemo as VerticalInlineDemo} from "@qualcomm-ui/react-docs/components+/stepper+/demos/stepper-vertical-inline-demo"

import {DemoPageLayout} from "~/components/demo-page-layout"

const demos = [
  {component: CompletedDemo, title: "Completed"},
  {component: ControlledDemo, title: "Controlled"},
  {component: HintDemo, title: "Hint"},
  {component: HorizontalDemo, title: "Horizontal"},
  {component: HorizontalBottomStartDemo, title: "Horizontal Bottom Start"},
  {component: HorizontalInlineDemo, title: "Horizontal Inline"},
  {component: IconDemo, title: "Icon"},
  {component: LinearDemo, title: "Linear"},
  {component: NonLinearDemo, title: "Nonlinear"},
  {component: NonlinearFormDemo, title: "Nonlinear Form"},
  {component: PendingDemo, title: "Pending"},
  {component: SizesDemo, title: "Sizes"},
  {component: SkippableStepsDemo, title: "Skippable Steps"},
  {component: VerticalDemo, title: "Vertical"},
  {component: VerticalInlineDemo, title: "Vertical Inline"},
]

export default function StepperDemos() {
  return <DemoPageLayout componentName="stepper" demos={demos} />
}
