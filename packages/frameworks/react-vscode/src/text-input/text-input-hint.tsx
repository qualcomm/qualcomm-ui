import type {ReactElement, ReactNode} from "react"

import type {IdProp} from "@qualcomm-ui/react-core/system"
import {useTextInputHint} from "@qualcomm-ui/react-core/text-input"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export interface TextInputHintProps extends IdProp {
  children?: ReactNode
  className?: string
}

export function TextInputHint({
  children,
  id,
  ...props
}: TextInputHintProps): ReactElement {
  const contextProps = useTextInputHint({id})
  const mergedProps = mergeProps(
    contextProps,
    {className: "vs-text-input__hint"},
    props,
  )
  return <div {...mergedProps}>{children}</div>
}
