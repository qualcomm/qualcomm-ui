import {ButtonContrastDemo as ContrastDemo} from "@qualcomm-ui/react-docs/components+/button+/demos/button-contrast-demo"
import {ButtonDensityDemo as DensityDemo} from "@qualcomm-ui/react-docs/components+/button+/demos/button-density-demo"
import {ButtonEmphasisDemo as EmphasisDemo} from "@qualcomm-ui/react-docs/components+/button+/demos/button-emphasis-demo"
import {ButtonInverseDemo as InverseDemo} from "@qualcomm-ui/react-docs/components+/button+/demos/button-inverse-demo"
import {ButtonShowcaseDemo as ShowcaseDemo} from "@qualcomm-ui/react-docs/components+/button+/demos/button-showcase-demo"
import {ButtonSizesDemo as SizesDemo} from "@qualcomm-ui/react-docs/components+/button+/demos/button-sizes-demo"
import {ButtonVariantsDemo as VariantsDemo} from "@qualcomm-ui/react-docs/components+/button+/demos/button-variants-demo"

import {DemoPageLayout} from "~/components/demo-page-layout"

const demos = [
  {component: ContrastDemo, title: "Contrast"},
  {component: DensityDemo, title: "Density"},
  {component: EmphasisDemo, title: "Emphasis"},
  {component: InverseDemo, title: "Inverse"},
  {component: ShowcaseDemo, title: "Showcase"},
  {component: SizesDemo, title: "Sizes"},
  {component: VariantsDemo, title: "Variants"},
]

export default function ButtonDemos() {
  return <DemoPageLayout componentName="button" demos={demos} />
}
