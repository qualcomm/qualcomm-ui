import type {ComponentPropsWithRef, ReactElement} from "react"

import {useOnDestroy} from "@qualcomm-ui/react-core/effects"
import {useFieldContext} from "@qualcomm-ui/react-core/field"
import {useControlledId} from "@qualcomm-ui/react-core/state"
import {clsx} from "@qualcomm-ui/utils/clsx"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

/**
 * @public
 */
export interface InputProps extends ComponentPropsWithRef<"input"> {
  id?: string
}

export function Input({
  className: classNameProp,
  ...props
}: InputProps): ReactElement {
  const context = useFieldContext(false)
  const id = useControlledId()
  const onDestroy = useOnDestroy()

  const className = clsx("vs-input", classNameProp)

  if (!context) {
    return <input className={className} {...props} />
  }

  const controlBindings = context.getControlBindings({id, onDestroy})
  const merged = mergeProps(controlBindings, props)

  return <input className={className} {...merged} />
}
