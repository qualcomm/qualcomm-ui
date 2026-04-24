import type {ReactElement, ReactNode} from "react"

import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export interface CatalogCardDetailsProps extends ElementRenderProp<"div"> {
  children?: ReactNode
}

export function CatalogCardDetails({
  children,
  ...props
}: CatalogCardDetailsProps): ReactElement {
  const mergedProps = mergeProps({className: "vs-catalog-card__details"}, props)

  return (
    <PolymorphicElement as="div" {...mergedProps}>
      {children}
    </PolymorphicElement>
  )
}
