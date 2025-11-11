import {ReactNode} from "react"

import {CodeHighlight} from "@qualcomm-ui/mdx-docs/code-highlight"
import {dedent} from "@qualcomm-ui/utils/dedent"

import quiMdxVitePkg from "../../../../../common/mdx-vite/package.json"
import quiStylesPkg from "../../../../../common/styles/package.json"
import quiMdxDocsPkg from "../../../../../frameworks/mdx-docs/package.json"
import quiReactPkg from "../../../../../frameworks/react/package.json"

export function Versions(): ReactNode {
  const code = dedent`
    {
      "@qualcomm-ui/mdx-docs": "${quiMdxDocsPkg.version}",
      "@qualcomm-ui/mdx-vite": "${quiMdxVitePkg.version}",
      "@qualcomm-ui/react": "${quiReactPkg.version}",
      "@qualcomm-ui/styles": "${quiStylesPkg.version}",
    }
  `
  return (
    <div className="mt-6">
      <CodeHighlight className="mdx" code={code} language="json" />
    </div>
  )
}
