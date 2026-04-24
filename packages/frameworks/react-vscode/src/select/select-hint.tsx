import type {ReactElement, ReactNode} from "react"

import {useSelectHint} from "@qualcomm-ui/react-core/select"
import {
  type ElementRenderProp,
  type IdProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export interface SelectHintProps extends IdProp, ElementRenderProp<"div"> {
  children?: ReactNode
}

export function SelectHint({
  children,
  id,
  ...props
}: SelectHintProps): ReactElement {
  const contextProps = useSelectHint({id})
  const mergedProps = mergeProps(
    contextProps,
    {className: "vs-select__hint"},
    props,
  )
  return (
    <PolymorphicElement as="div" {...mergedProps}>
      {children}
    </PolymorphicElement>
  )
}
