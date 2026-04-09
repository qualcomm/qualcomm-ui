import {IconButtonContrastDemo as ContrastDemo} from "@qualcomm-ui/react-docs/components+/icon-button+/demos/icon-button-contrast-demo"
import {IconButtonDensityDemo as DensityDemo} from "@qualcomm-ui/react-docs/components+/icon-button+/demos/icon-button-density-demo"
import {IconButtonEmphasisDemo as EmphasisDemo} from "@qualcomm-ui/react-docs/components+/icon-button+/demos/icon-button-emphasis-demo"
import {IconButtonInverseDemo as InverseDemo} from "@qualcomm-ui/react-docs/components+/icon-button+/demos/icon-button-inverse-demo"
import {IconButtonSizesDemo as SizesDemo} from "@qualcomm-ui/react-docs/components+/icon-button+/demos/icon-button-sizes-demo"
import {IconButtonVariantCombinationsDemo as VariantCombinationsDemo} from "@qualcomm-ui/react-docs/components+/icon-button+/demos/icon-button-variant-combinations-demo"
import {IconButtonVariantsDemo as VariantsDemo} from "@qualcomm-ui/react-docs/components+/icon-button+/demos/icon-button-variants-demo"

import {DemoPageLayout} from "~/components/demo-page-layout"

const demos = [
  {component: ContrastDemo, title: "Contrast"},
  {component: DensityDemo, title: "Density"},
  {component: EmphasisDemo, title: "Emphasis"},
  {component: InverseDemo, title: "Inverse"},
  {component: SizesDemo, title: "Sizes"},
  {component: VariantCombinationsDemo, title: "Variant Combinations"},
  {component: VariantsDemo, title: "Variants"},
]

export default function IconButtonDemos() {
  return <DemoPageLayout componentName="icon-button" demos={demos} />
}
