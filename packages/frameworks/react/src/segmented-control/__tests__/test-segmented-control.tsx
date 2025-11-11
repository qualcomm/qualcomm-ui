import {
  SegmentedControl,
  type SegmentedControlRootProps,
} from "@qualcomm-ui/react/segmented-control"

export const globalItems = ["one", "two", "three"]

export function SimpleComponent(props: SegmentedControlRootProps) {
  return (
    <SegmentedControl.Root {...props}>
      {globalItems.map((item) => (
        <SegmentedControl.Item
          key={item}
          data-test-id={item}
          text={item}
          value={item}
        />
      ))}
    </SegmentedControl.Root>
  )
}

export function CompositeComponent(props: SegmentedControlRootProps) {
  return (
    <SegmentedControl.Root {...props}>
      {globalItems.map((item) => (
        <SegmentedControl.ItemRoot key={item} data-test-id={item} value={item}>
          <SegmentedControl.ItemText>{item}</SegmentedControl.ItemText>
          <SegmentedControl.HiddenInput />
        </SegmentedControl.ItemRoot>
      ))}
    </SegmentedControl.Root>
  )
}
