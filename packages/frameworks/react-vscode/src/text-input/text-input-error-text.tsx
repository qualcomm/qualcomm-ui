import type {ReactElement, ReactNode} from "react"

import type {IdProp} from "@qualcomm-ui/react-core/system"
import {useTextInputErrorText} from "@qualcomm-ui/react-core/text-input"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export interface TextInputErrorTextProps extends IdProp {
  children?: ReactNode
  className?: string
}

export function TextInputErrorText({
  children,
  id,
  ...props
}: TextInputErrorTextProps): ReactElement {
  const contextProps = useTextInputErrorText({id})
  const mergedProps = mergeProps(
    contextProps,
    {className: "vs-text-input__error-text"},
    props,
  )
  return <div {...mergedProps}>{children}</div>
}
