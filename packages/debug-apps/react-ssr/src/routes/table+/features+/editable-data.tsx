import {EditableDataDemo} from "@qualcomm-ui/react-table-docs/features+/editable-data+/demos"

import {DemoPageLayout} from "../../../components/demo-page-layout"

const demos = [{component: EditableDataDemo, title: "Editable Data"}]

export default function EditableData() {
  return (
    <DemoPageLayout
      componentName="editable-data"
      demos={demos}
      className="w-full"
    />
  )
}
