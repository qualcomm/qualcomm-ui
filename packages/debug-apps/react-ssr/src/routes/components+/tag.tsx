import {TagEmphasisDemo as EmphasisDemo} from "@qualcomm-ui/react-docs/components+/tag+/demos/tag-emphasis-demo"
import {TagIconsDemo as IconsDemo} from "@qualcomm-ui/react-docs/components+/tag+/demos/tag-icons-demo"
import {TagShapeDemo as ShapeDemo} from "@qualcomm-ui/react-docs/components+/tag+/demos/tag-shape-demo"
import {TagSizesDemo as SizesDemo} from "@qualcomm-ui/react-docs/components+/tag+/demos/tag-sizes-demo"
import {TagStatesDemo as StatesDemo} from "@qualcomm-ui/react-docs/components+/tag+/demos/tag-states-demo"
import {TagVariantsDemo as VariantsDemo} from "@qualcomm-ui/react-docs/components+/tag+/demos/tag-variants-demo"

import {DemoPageLayout} from "~/components/demo-page-layout"

const demos = [
  {component: EmphasisDemo, title: "Emphasis"},
  {component: IconsDemo, title: "Icons"},
  {component: ShapeDemo, title: "Shape"},
  {component: SizesDemo, title: "Sizes"},
  {component: StatesDemo, title: "States"},
  {component: VariantsDemo, title: "Variants"},
]

export default function TagDemos() {
  return <DemoPageLayout componentName="tag" demos={demos} />
}
