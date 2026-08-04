import {
  SegmentedControl,
  type SegmentedControlItemRootProps,
  type SegmentedControlRootProps,
} from "@qualcomm-ui/react/segmented-control"

export const globalItems = ["one", "two", "three"]

type ItemPropsMap = Partial<
  Record<string, Omit<SegmentedControlItemRootProps, "children" | "value">>
>

export interface TestComponentProps extends SegmentedControlRootProps {
  /**
   * Optional map of extra props to spread onto individual items, keyed by item
   * value. Used by tests to disable specific items or pass other item-level
   * overrides without special-casing each scenario in the helper.
   */
  itemProps?: ItemPropsMap
}

export function SimpleComponent({itemProps, ...props}: TestComponentProps) {
  return (
    <SegmentedControl.Root {...props}>
      {globalItems.map((item) => (
        <SegmentedControl.Item
          key={item}
          data-test-id={item}
          text={item}
          value={item}
          {...itemProps?.[item]}
        />
      ))}
    </SegmentedControl.Root>
  )
}

export function CompositeComponent({itemProps, ...props}: TestComponentProps) {
  return (
    <SegmentedControl.Root {...props}>
      {globalItems.map((item) => (
        <SegmentedControl.ItemRoot
          key={item}
          data-test-id={item}
          value={item}
          {...itemProps?.[item]}
        >
          <SegmentedControl.ItemText>{item}</SegmentedControl.ItemText>
          <SegmentedControl.HiddenInput />
        </SegmentedControl.ItemRoot>
      ))}
    </SegmentedControl.Root>
  )
}
