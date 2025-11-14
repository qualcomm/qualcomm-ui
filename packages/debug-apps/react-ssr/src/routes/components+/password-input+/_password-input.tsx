import CompositeDemo from "@qualcomm-ui/react-docs/components+/password-input+/demos/password-input-composite-demo"
import ControlledValueDemo from "@qualcomm-ui/react-docs/components+/password-input+/demos/password-input-controlled-value-demo"
import ControlledVisibilityDemo from "@qualcomm-ui/react-docs/components+/password-input+/demos/password-input-controlled-visibility-demo"
import IconsDemo from "@qualcomm-ui/react-docs/components+/password-input+/demos/password-input-icons-demo"
import ReactHookFormDemo from "@qualcomm-ui/react-docs/components+/password-input+/demos/password-input-react-hook-form-demo"
import SimpleDemo from "@qualcomm-ui/react-docs/components+/password-input+/demos/password-input-simple-demo"
import TanstackFormDemo from "@qualcomm-ui/react-docs/components+/password-input+/demos/password-input-tanstack-form-demo"

const demos = [
  {component: CompositeDemo, title: "Composite"},
  {component: ControlledValueDemo, title: "Controlled Value"},
  {component: ControlledVisibilityDemo, title: "Controlled Visibility"},
  {component: IconsDemo, title: "Icons"},
  {component: ReactHookFormDemo, title: "React Hook Form"},
  {component: SimpleDemo, title: "Simple"},
  {component: TanstackFormDemo, title: "Tanstack Form"},
]

export default function PasswordInputDemos() {
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
