import {DemoPageLayout} from "~/components/demo-page-layout"
import {getDemos, type DemoComponent} from "~/utils/demos"

const componentName = "combobox"
const demoModules = import.meta.glob<Record<string, DemoComponent>>(
  "../../../../../docs/react-docs/src/routes/components+/combobox+/demos/*-demo.tsx",
  {eager: true},
)
const demos = getDemos(componentName, demoModules)

export default function ComboboxDemos() {
  return <DemoPageLayout componentName={componentName} demos={demos} />
}
