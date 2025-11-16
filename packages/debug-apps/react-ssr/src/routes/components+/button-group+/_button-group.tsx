import LayoutDemo from "@qualcomm-ui/react-docs/components+/button-group+/demos/button-group-layout-demo"
import SharedPropsDemo from "@qualcomm-ui/react-docs/components+/button-group+/demos/button-group-shared-props-demo"

const demos = [
  {component: LayoutDemo, title: "Layout"},
  {component: SharedPropsDemo, title: "Shared Props"},
]

export default function ButtonGroupDemos() {
  return (
    <div className="page">
      {demos.map(({component: Demo, title}) => (
        <div className="section" key={title}>
          <h2 className="section-title">{title}</h2>
          <div className="demo-container">
            <Demo />
          </div>
        </div>
      ))}
    </div>
  )
}
