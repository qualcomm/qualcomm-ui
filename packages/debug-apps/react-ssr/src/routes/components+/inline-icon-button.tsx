import {InlineIconButtonShowcaseDemo as ShowcaseDemo} from "@qualcomm-ui/react-docs/components+/inline-icon-button+/demos/inline-icon-button-showcase-demo"
import {InlineIconButtonVariantsDemo as VariantsDemo} from "@qualcomm-ui/react-docs/components+/inline-icon-button+/demos/inline-icon-button-variants-demo"

import {DemoPageLayout} from "~/components/demo-page-layout"

const demos = [
  {component: ShowcaseDemo, title: "Showcase"},
  {component: VariantsDemo, title: "Variants"},
]

export default function InlineIconButtonDemos() {
  return <DemoPageLayout componentName="inline-icon-button" demos={demos} />
}
