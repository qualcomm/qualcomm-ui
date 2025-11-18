import type {ReactElement} from "react"

import {Link} from "@qualcomm-ui/react/link"

export function GithubChangelogLink(): ReactElement {
  return (
    <Link
      className="hidden md:inline-flex"
      emphasis="neutral"
      render={
        <a
          href="https://github.com/qualcomm/qualcomm-ui/tree/main/packages/frameworks/react-mdx/CHANGELOG.md"
          rel="noreferrer"
          target="_blank"
        />
      }
      size="xs"
    >
      NEXTGEN
    </Link>
  )
}
