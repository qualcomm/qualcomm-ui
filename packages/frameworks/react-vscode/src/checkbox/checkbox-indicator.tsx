import type {ReactElement, ReactNode} from "react"

import {useCheckboxIndicator} from "@qualcomm-ui/react-core/checkbox"
import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useVsCheckboxContext} from "./vs-checkbox-context"

export interface CheckboxIndicatorProps extends ElementRenderProp<"div"> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   * Defaults to the check icon when checked, or the indeterminate bar.
   */
  children?: ReactNode
}

function CheckIcon(): ReactElement {
  return (
    <svg
      fill="currentColor"
      height="16"
      viewBox="0 0 16 16"
      width="16"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        clipRule="evenodd"
        d="M14.431 3.323l-8.47 10-.79-.036-3.35-4.77.818-.574 2.978 4.24 8.051-9.506.764.646z"
        fillRule="evenodd"
      />
    </svg>
  )
}

function IndeterminateIcon(): ReactElement {
  return <span className="vs-checkbox__indeterminate-icon" />
}

/**
 * Visual indicator that displays the checkbox state. Renders a `<div>` element by
 * default.
 */
export function CheckboxIndicator({
  children,
  ...props
}: CheckboxIndicatorProps): ReactElement {
  const {contextProps, indeterminate} = useCheckboxIndicator()
  const vsContext = useVsCheckboxContext()
  const mergedProps = mergeProps(
    contextProps,
    vsContext.getIndicatorBindings(),
    props,
  )

  return (
    <PolymorphicElement as="div" {...mergedProps}>
      {children ?? (indeterminate ? <IndeterminateIcon /> : <CheckIcon />)}
    </PolymorphicElement>
  )
}
