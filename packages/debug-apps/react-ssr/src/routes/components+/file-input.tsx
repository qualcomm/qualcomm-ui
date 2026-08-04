import {DemoPageLayout} from "~/components/demo-page-layout"
import {getDemos, type DemoComponent} from "~/utils/demos"

const componentName = "file-input"
const demoModules = import.meta.glob<Record<string, DemoComponent>>(
  "../../../../../docs/react-docs/src/routes/components+/file-input+/demos/*-demo.tsx",
  {eager: true},
)
const demos = getDemos(componentName, demoModules)

export default function FileInputDemos() {
  return <DemoPageLayout componentName={componentName} demos={demos} />
}
