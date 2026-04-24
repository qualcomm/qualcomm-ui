import type {ReactElement, ReactNode} from "react"

import {useCheckboxLabel} from "@qualcomm-ui/react-core/checkbox"
import {
  type ElementRenderProp,
  type IdProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useVsCheckboxContext} from "./vs-checkbox-context"

export interface CheckboxLabelProps extends IdProp, ElementRenderProp<"span"> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode
}

/**
 * An accessible label that is automatically associated with the checkbox.
 * Renders a `<span>` element by default.
 */
export function CheckboxLabel({
  children,
  id,
  ...props
}: CheckboxLabelProps): ReactElement {
  const contextProps = useCheckboxLabel({id})
  const vsContext = useVsCheckboxContext()
  const mergedProps = mergeProps(
    contextProps,
    vsContext.getLabelBindings(),
    props,
  )

  return (
    <PolymorphicElement as="span" {...mergedProps}>
      {children}
    </PolymorphicElement>
  )
}
