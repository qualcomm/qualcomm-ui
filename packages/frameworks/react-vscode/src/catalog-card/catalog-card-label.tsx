import type {ReactElement, ReactNode} from "react"

import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export interface CatalogCardLabelProps extends ElementRenderProp<"div"> {
  children?: ReactNode
}

export function CatalogCardLabel({
  children,
  ...props
}: CatalogCardLabelProps): ReactElement {
  const mergedProps = mergeProps({className: "vs-catalog-card__label"}, props)

  return (
    <PolymorphicElement as="div" {...mergedProps}>
      {children}
    </PolymorphicElement>
  )
}
