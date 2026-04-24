import type {ReactElement, ReactNode} from "react"

import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export interface MenuItemCommandProps extends ElementRenderProp<"kbd"> {
  children?: ReactNode
}

export function MenuItemCommand(props: MenuItemCommandProps): ReactElement {
  const mergedProps = mergeProps({className: "vs-menu-item__command"}, props)

  return <PolymorphicElement as="kbd" {...mergedProps} />
}
