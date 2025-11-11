import type {ReactNode} from "react"

import {CodeHighlight} from "@qualcomm-ui/mdx-docs/code-highlight"
import {dedent} from "@qualcomm-ui/utils/dedent"

import tailwindPkg from "../../../../../../../common/tailwind-plugin/package.json"

const versions = {
  tailwind: tailwindPkg.version,
}

export function Versions(): ReactNode {
  const code = dedent`
    {
      "@qualcomm-ui/tailwind-plugin": "${versions.tailwind}",
    }
  `
  return (
    <div className="mt-6">
      <CodeHighlight className="mdx" code={code} language="json" />
    </div>
  )
}
