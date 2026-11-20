// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Children, isValidElement, type ReactNode, useMemo} from "react"

import {useMDXComponents} from "@mdx-js/react"
import type {Root} from "hast"
import {type Components, toJsxRuntime} from "hast-util-to-jsx-runtime"
import {Lightbulb} from "lucide-react"
import {Fragment, jsx, jsxs} from "react/jsx-runtime"

import type {QdsNotificationEmphasis} from "@qualcomm-ui/qds-core/inline-notification"
import {CodeHighlight} from "@qualcomm-ui/react-mdx/code-highlight"
import {InlineNotification} from "@qualcomm-ui/react/inline-notification"

export interface DescriptionProps {
  /**
   * Overrides the site's MDX components for this description only.
   */
  components?: Partial<Components>
  tree: Root
}

/**
 * Fenced code blocks reach the page unhighlighted: MDX pages get Shiki at build
 * time, spec descriptions don't.
 */
function CodeBlock({children}: {children?: ReactNode}): ReactNode {
  const code = isValidElement<{children?: ReactNode; className?: string}>(
    children,
  )
    ? children.props
    : undefined
  const language = code?.className
    ?.split(" ")
    .find((name) => name.startsWith("language-"))
    ?.slice("language-".length)
  const text = Children.toArray(code?.children)
    .filter((child) => typeof child === "string")
    .join("")
    .replace(/\n$/, "")
  return (
    <CodeHighlight
      className="qui-docs-openapi__code-block"
      code={text}
      language={language ?? "text"}
    />
  )
}

const alertEmphasis: Record<string, QdsNotificationEmphasis> = {
  caution: "danger",
  note: "info",
  success: "success",
  tip: "info",
  warning: "warning",
}

interface AlertProps {
  children?: ReactNode
  label?: string
  type?: string
}

/**
 * A GitHub alert (`> [!NOTE]`), styled like the ones on MDX pages.
 */
function Alert({children, label, type = "note"}: AlertProps): ReactNode {
  return (
    <InlineNotification
      className="mdx"
      description={children}
      emphasis={alertEmphasis[type] ?? "neutral"}
      icon={type === "tip" ? Lightbulb : undefined}
      label={label}
      orientation="vertical"
    />
  )
}

/**
 * A spec description, parsed from CommonMark by the docs plugin and rendered
 * with the site's MDX components, like any other docs page content.
 */
export function Description({components, tree}: DescriptionProps): ReactNode {
  const mdxComponents = useMDXComponents()
  return useMemo(() => {
    const allComponents: Partial<Components> & {alert: typeof Alert} = {
      ...mdxComponents,
      alert: Alert,
      pre: CodeBlock,
      ...components,
    }
    return toJsxRuntime(tree, {
      components: allComponents,
      Fragment,
      jsx,
      jsxs,
    })
  }, [components, mdxComponents, tree])
}
