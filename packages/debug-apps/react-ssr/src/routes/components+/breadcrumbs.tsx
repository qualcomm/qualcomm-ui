import {BreadcrumbsDisabledDemo as DisabledDemo} from "@qualcomm-ui/react-docs/components+/breadcrumbs+/demos/breadcrumbs-disabled-demo"
import {BreadcrumbsEmphasisDemo as EmphasisDemo} from "@qualcomm-ui/react-docs/components+/breadcrumbs+/demos/breadcrumbs-emphasis-demo"
import {BreadcrumbsLinksDemo as LinksDemo} from "@qualcomm-ui/react-docs/components+/breadcrumbs+/demos/breadcrumbs-links-demo"
import {BreadcrumbsSizesDemo as SizesDemo} from "@qualcomm-ui/react-docs/components+/breadcrumbs+/demos/breadcrumbs-sizes-demo"

import {DemoPageLayout} from "~/components/demo-page-layout"

const demos = [
  {component: DisabledDemo, title: "Disabled"},
  {component: EmphasisDemo, title: "Emphasis"},
  {component: LinksDemo, title: "Links"},
  {component: SizesDemo, title: "Sizes"},
]

export default function BreadcrumbsDemos() {
  return <DemoPageLayout componentName="breadcrumbs" demos={demos} />
}
