import {Stepper} from "@qualcomm-ui/react/stepper"

const items = [
  {description: "Contact Info", title: "First", value: "first"},
  {description: "Date & Time", title: "Second", value: "second"},
  {description: "Select Rooms", title: "Third", value: "third"},
]

export function StepperNonlinearDemo() {
  return (
    <Stepper.Root count={items.length} linear={false}>
      <Stepper.List>
        {items.map((item, index) => (
          <Stepper.Item key={item.value} index={index}>
            <Stepper.Trigger>
              <Stepper.Indicator>{index + 1}</Stepper.Indicator>
              <Stepper.Label>{item.title}</Stepper.Label>
            </Stepper.Trigger>
            <Stepper.Separator />
          </Stepper.Item>
        ))}
      </Stepper.List>

      {items.map((item, index) => (
        <Stepper.Content key={item.value} index={index}>
          {item.title} - {item.description}
        </Stepper.Content>
      ))}
    </Stepper.Root>
  )
}
