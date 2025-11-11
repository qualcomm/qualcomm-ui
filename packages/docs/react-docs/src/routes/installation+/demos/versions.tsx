import type {ReactNode} from "react"

import {CodeHighlight} from "@qualcomm-ui/react-mdx/code-highlight"
import {dedent} from "@qualcomm-ui/utils/dedent"

import quiReactPkg from "../../../../../../frameworks/react/package.json"

const versions = {
  react: quiReactPkg.version,
}

export function Versions(): ReactNode {
  const code = dedent`
    {
      "@qualcomm-ui/react": "${versions.react}"
    }
  `
  return (
    <div className="mt-6">
      <CodeHighlight className="mdx" code={code} language="json" />
    </div>
  )
}
