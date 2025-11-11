import type {ReactElement, ReactNode} from "react"

import {ChevronRight} from "lucide-react"

import {
  Collapsible,
  type CollapsibleRootProps,
} from "@qualcomm-ui/react/collapsible"
import {Icon} from "@qualcomm-ui/react/icon"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

interface SpoilerRootProps extends CollapsibleRootProps {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children: ReactNode
}

export function SpoilerRoot({
  children,
  ...props
}: SpoilerRootProps): ReactElement {
  return (
    <Collapsible.Root {...mergeProps({className: "mdx-spoiler__root"}, props)}>
      {children}
    </Collapsible.Root>
  )
}

interface SpoilerSummaryProps {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children: ReactNode
}

export function SpoilerSummary({children}: SpoilerSummaryProps): ReactElement {
  return (
    <Collapsible.Trigger className="mdx-spoiler__trigger">
      <>{children}</>
      <Icon className="mdx-spoiler__indicator" icon={ChevronRight} />
    </Collapsible.Trigger>
  )
}

interface SpoilerContentProps {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children: ReactNode
}

export function SpoilerContent({children}: SpoilerContentProps): ReactElement {
  return (
    <Collapsible.Content className="mdx-spoiler__content">
      <div className="mdx-spoiler__content-body">{children}</div>
    </Collapsible.Content>
  )
}
