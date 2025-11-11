import type {ReactElement, ReactNode} from "react"

import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {booleanDataAttr} from "@qualcomm-ui/utils/attributes"
import {clsx} from "@qualcomm-ui/utils/clsx"

import {useMdxDocsLayoutContext} from "./use-mdx-docs-layout"

export interface AppContentProps extends ElementRenderProp<"div"> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode
}

export function AppContent({
  children,
  className,
  ...props
}: AppContentProps): ReactElement {
  const {hideSideNav, showToc} = useMdxDocsLayoutContext()

  return (
    <PolymorphicElement
      as="div"
      className={clsx("qui-docs__app-content", className)}
      data-hide-side-nav={booleanDataAttr(hideSideNav)}
      data-hide-toc={booleanDataAttr(!showToc)}
      {...props}
    >
      {children}
    </PolymorphicElement>
  )
}
