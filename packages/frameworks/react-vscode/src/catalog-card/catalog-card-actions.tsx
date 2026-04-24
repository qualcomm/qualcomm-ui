import type {ReactElement, ReactNode} from "react"

import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export interface CatalogCardActionsProps extends ElementRenderProp<"div"> {
  children?: ReactNode
}

export function CatalogCardActions({
  children,
  ...props
}: CatalogCardActionsProps): ReactElement {
  const mergedProps = mergeProps({className: "vs-catalog-card__actions"}, props)

  return (
    <PolymorphicElement as="div" {...mergedProps}>
      {children}
    </PolymorphicElement>
  )
}
