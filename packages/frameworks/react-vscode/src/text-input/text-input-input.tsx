import type {ComponentPropsWithRef, ReactElement} from "react"

import type {IdProp} from "@qualcomm-ui/react-core/system"
import {useTextInputInput} from "@qualcomm-ui/react-core/text-input"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export interface TextInputInputProps
  extends ComponentPropsWithRef<"input">, IdProp {}

export function TextInputInput({
  id,
  ...props
}: TextInputInputProps): ReactElement {
  const contextProps = useTextInputInput({id})
  const mergedProps = mergeProps(
    contextProps,
    {className: "vs-text-input__input"},
    props,
  )
  return <input {...mergedProps} />
}
