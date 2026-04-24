import type {ReactElement, ReactNode} from "react"

import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export interface CatalogCardBadgeProps extends ElementRenderProp<"div"> {
  children?: ReactNode
}

export function CatalogCardBadge({
  children,
  ...props
}: CatalogCardBadgeProps): ReactElement {
  const mergedProps = mergeProps({className: "vs-catalog-card__badge"}, props)

  return (
    <PolymorphicElement as="div" {...mergedProps}>
      {children}
    </PolymorphicElement>
  )
}
