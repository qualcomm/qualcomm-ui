import type {ReactElement, ReactNode} from "react"

import {useCheckboxErrorText} from "@qualcomm-ui/react-core/checkbox"
import type {IdProp} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export interface CheckboxErrorTextProps extends IdProp {
  children?: ReactNode
  className?: string
}

/**
 * Error message displayed when the checkbox is invalid. Renders a `<div>` element.
 */
export function CheckboxErrorText({
  children,
  id,
  ...props
}: CheckboxErrorTextProps): ReactElement {
  const contextProps = useCheckboxErrorText({id})
  const mergedProps = mergeProps(
    contextProps,
    {className: "vs-checkbox__error-text"},
    props,
  )
  return <div {...mergedProps}>{children}</div>
}
