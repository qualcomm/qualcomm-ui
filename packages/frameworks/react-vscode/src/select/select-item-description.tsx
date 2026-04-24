import type {ReactElement} from "react"

import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"

export interface SelectItemDescriptionProps extends ElementRenderProp<"div"> {}

export function SelectItemDescription({
  children,
  ...props
}: SelectItemDescriptionProps): ReactElement {
  return (
    <PolymorphicElement as="div" {...props}>
      {children}
    </PolymorphicElement>
  )
}
