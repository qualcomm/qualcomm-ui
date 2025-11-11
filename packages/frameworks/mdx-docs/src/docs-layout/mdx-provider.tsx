// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type ReactNode, useMemo} from "react"

import {MDXProvider, type useMDXComponents} from "@mdx-js/react"

import {useMdxDocsContext} from "@qualcomm-ui/mdx-docs/context"
import {
  SpoilerContent,
  SpoilerRoot,
  SpoilerSummary,
} from "@qualcomm-ui/mdx-docs/spoiler"
import {Link} from "@qualcomm-ui/react/link"
import {Table} from "@qualcomm-ui/react/table"

import {AnchorHeader, CodeTabs, ShikiPre} from "./internal"

interface Props {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children: ReactNode

  /**
   * Override the MDX component definitions. Refer to the {@link https://mdxjs.com/table-of-components/ documentation}
   * to learn more.
   *
   * @inheritDoc
   */
  components?: ReturnType<typeof useMDXComponents>

  /**
   * The current page pathname.
   */
  pathname: string
}

/**
 * We use this component to supply the MDX provider with component slots for
 * specific Markdown nodes.
 *
 * @example
 *
 * ```markdown
 * # A Title
 *
 * A paragraph
 * ```
 *
 * @remarks
 *
 * The `A Title` block above corresponds to the `h1` key of the MDXProvider's
 * `components` prop. We use this to override every h1 markdown element with a
 * specific className.
 *
 * The `A paragraph` block maps to the `p` key of the `components` prop.
 *
 * For a list of each supported component, visit the {@link https://mdxjs.com/table-of-components/ docs}.
 */
export function MdxProvider({children, components}: Props): ReactNode {
  const {renderLink: RenderLink} = useMdxDocsContext()

  return (
    <MDXProvider
      components={useMemo(
        // TODO: most of these are just className modifiers. We can move the mdx
        //  className adder to a remark plugin.
        () => ({
          a: ({href = "", ref: _ref, ...props}) => {
            const internal = !href.startsWith("http")
            return internal ? (
              <Link
                emphasis="primary"
                render={
                  <RenderLink
                    href={href.startsWith("./#") ? href.substring(2) : href}
                  />
                }
                {...props}
              />
            ) : (
              <Link emphasis="primary" href={href} {...props} target="_blank" />
            )
          },
          blockquote: (props) => {
            return <blockquote className="mdx" {...props} />
          },
          br: (props) => <br className="mdx" {...props} />,
          code: (props) => <code className="mdx" {...props} />,
          CodeTab: (props) => {
            // This component is handled by CodeTabs above
            // Return children directly in case it's used standalone
            return <div {...props}>{children}</div>
          },
          CodeTabs,
          em: (props) => <em className="mdx" {...props} />,
          h1: ({children, id, ...props}) => {
            return (
              <h1 className="mdx" id={id || undefined} {...props}>
                {children}
              </h1>
            )
          },
          h2: ({children, id}) => {
            return (
              <AnchorHeader
                className="mdx"
                id={id || undefined}
                render={<h2 />}
                renderLink={RenderLink}
              >
                {children}
              </AnchorHeader>
            )
          },
          h3: ({children, id}) => {
            return (
              <AnchorHeader
                className="mdx"
                id={id || undefined}
                render={<h3 />}
                renderLink={RenderLink}
              >
                {children}
              </AnchorHeader>
            )
          },
          h4: ({children, id}) => {
            return (
              <AnchorHeader
                className="mdx"
                id={id || undefined}
                render={<h4 />}
                renderLink={RenderLink}
              >
                {children}
              </AnchorHeader>
            )
          },
          h5: ({id, ...props}) => (
            <h5 className="mdx" id={id || undefined} {...props} />
          ),
          h6: ({id, ...props}) => (
            <h6 className="mdx" id={id || undefined} {...props} />
          ),
          hr: (props) => <hr className="mdx" {...props} />,
          img: (props) => <img className="mdx" {...props} />,
          li: (props) => <li className="mdx" {...props} />,
          ol: (props) => <ol className="mdx" {...props} />,
          p: (props) => <p className="mdx" {...props} />,
          pre: ({children, ...props}) => {
            return <ShikiPre {...props}>{children}</ShikiPre>
          },
          SpoilerContent,
          SpoilerRoot,
          SpoilerSummary,
          strong: (props) => (
            <strong className="mdx font-semibold" {...props} />
          ),
          sup: (props: any) => <sup className="mdx" {...props} />,
          table: ({children, ...props}: any) => (
            <div className="mdx table-wrapper">
              <Table.Root className="mdx" {...props}>
                <Table.Table className="mdx">{children}</Table.Table>
              </Table.Root>
            </div>
          ),
          tbody: (props: any) => <Table.Body className="mdx" {...props} />,
          td: (props: any) => <Table.Cell className="mdx" {...props} />,
          tfoot: (props: any) => <Table.Footer className="mdx" {...props} />,
          th: (props: any) => <Table.HeaderCell className="mdx" {...props} />,
          thead: (props: any) => <Table.Header className="mdx" {...props} />,
          tr: (props: any) => <Table.Row className="mdx" {...props} />,
          ul: (props) => <ul className="mdx" {...props} />,
          ...components,
        }),
        [RenderLink, children, components],
      )}
    >
      {children}
    </MDXProvider>
  )
}
