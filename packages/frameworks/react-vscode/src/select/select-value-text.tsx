import type {ReactElement} from "react"

import {useSelectContext} from "@qualcomm-ui/react-core/select"
import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export interface SelectValueTextProps extends ElementRenderProp<"span"> {}

export function SelectValueText(props: SelectValueTextProps): ReactElement {
  const {getValueTextBindings, placeholder, valueAsString} = useSelectContext()
  const isEmpty = !valueAsString
  const mergedProps = mergeProps(
    getValueTextBindings(),
    {
      className: "vs-select__control__label",
      ...(isEmpty && {"data-placeholder": ""}),
    },
    props,
  )
  return (
    <PolymorphicElement as="span" {...mergedProps}>
      {valueAsString || placeholder}
    </PolymorphicElement>
  )
}
