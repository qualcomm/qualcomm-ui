import type {ReactElement} from "react"

import {Link} from "@qualcomm-ui/react/link"
import {
  DocsFooter,
  type DocsFooterProps,
} from "@qualcomm-ui/react-mdx/docs-layout"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export interface FooterProps extends DocsFooterProps {}

export function Footer(props: FooterProps): ReactElement {
  const mergedProps = mergeProps(
    {className: "flex flex-col items-start justify-center gap-1"},
    props,
  )

  return (
    <DocsFooter {...mergedProps}>
      Copyright © 2026 QUALCOMM incorporated. All rights reserved.{" "}
      <span>
        This site is built with{" "}
        <Link
          href="https://docs-next.qui.qualcomm.com/"
          size="md"
          target="_blank"
        >
          QUI Docs
        </Link>
        . Head over to the{" "}
        <Link
          href="https://github.com/qualcomm/qualcomm-ui-templates/tree/main/templates/qui-docs-template"
          size="md"
          target="_blank"
        >
          template repository
        </Link>{" "}
        to start building.
      </span>
    </DocsFooter>
  )
}
