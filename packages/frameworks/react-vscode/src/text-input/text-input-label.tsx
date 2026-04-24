import type {ReactElement, ReactNode} from "react"

import type {ElementRenderProp} from "@qualcomm-ui/react-core/system"
import {useTextInputLabel} from "@qualcomm-ui/react-core/text-input"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export interface TextInputLabelProps extends ElementRenderProp<"label"> {
  children?: ReactNode
}

export function TextInputLabel({
  children,
  id,
  ...props
}: TextInputLabelProps): ReactElement {
  const contextProps = useTextInputLabel({id})
  const mergedProps = mergeProps(
    contextProps,
    {className: "vs-text-input__label"},
    props,
  )
  return <label {...mergedProps}>{children}</label>
}
