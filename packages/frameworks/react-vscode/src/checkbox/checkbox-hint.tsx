import type {ReactElement, ReactNode} from "react"

import {useCheckboxHint} from "@qualcomm-ui/react-core/checkbox"
import type {IdProp} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export interface CheckboxHintProps extends IdProp {
  children?: ReactNode
  className?: string
}

/**
 * A help message displayed below the checkbox. Renders a `<div>` element.
 */
export function CheckboxHint({
  children,
  id,
  ...props
}: CheckboxHintProps): ReactElement {
  const contextProps = useCheckboxHint({id})
  const mergedProps = mergeProps(
    contextProps,
    {className: "vs-checkbox__hint"},
    props,
  )
  return <div {...mergedProps}>{children}</div>
}
