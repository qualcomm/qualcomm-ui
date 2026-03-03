import {HeaderBarMenuItemDemo as MenuItemDemo} from "@qualcomm-ui/react-docs/components+/header-bar+/demos/header-bar-menu-item-demo"
import {HeaderBarShowcaseDemo as ShowcaseDemo} from "@qualcomm-ui/react-docs/components+/header-bar+/demos/header-bar-showcase-demo"
import {HeaderBarSizesDemo as SizesDemo} from "@qualcomm-ui/react-docs/components+/header-bar+/demos/header-bar-sizes-demo"
import {HeaderBarSurfacesDemo as SurfacesDemo} from "@qualcomm-ui/react-docs/components+/header-bar+/demos/header-bar-surfaces-demo"

import {DemoPageLayout} from "~/components/demo-page-layout"

const demos = [
  {component: MenuItemDemo, title: "Menu Item"},
  {component: ShowcaseDemo, title: "Showcase"},
  {component: SizesDemo, title: "Sizes"},
  {component: SurfacesDemo, title: "Surfaces"},
]

export default function HeaderBarDemos() {
  return <DemoPageLayout componentName="header-bar" demos={demos} />
}
