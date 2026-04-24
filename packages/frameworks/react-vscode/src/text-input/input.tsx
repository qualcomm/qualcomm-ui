import type {ComponentPropsWithRef, ReactElement} from "react"

import {useOnDestroy} from "@qualcomm-ui/react-core/effects"
import {useFieldContext} from "@qualcomm-ui/react-core/field"
import {useControlledId} from "@qualcomm-ui/react-core/state"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export interface InputProps extends ComponentPropsWithRef<"input"> {
  id?: string
}

/**
 * A bare `<input>` element. Works standalone or inside a `<Field>`.
 *
 * For the full text-input compound (label, hint, error text, clear button),
 * use `TextInput` instead.
 */
export function Input(props: InputProps): ReactElement {
  const context = useFieldContext(false)
  const id = useControlledId(props.id)
  const onDestroy = useOnDestroy()

  if (!context) {
    const merged = mergeProps({className: "vs-text-input__input"}, props)
    return <input {...merged} />
  }

  const controlBindings = context.getControlBindings({id, onDestroy})
  const merged = mergeProps(
    controlBindings,
    {className: "vs-text-input__input"},
    props,
  )
  return <input {...merged} />
}
