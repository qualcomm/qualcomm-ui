import type {ReactNode} from "react"

import {CodeHighlight} from "@qualcomm-ui/react-mdx/code-highlight"
import {dedent} from "@qualcomm-ui/utils/dedent"

import tailwindPkg from "../../../../../common/tailwind-plugin/package.json"

const tailwindVersion = {
  tailwind: tailwindPkg.version,
}

export function TailwindVersion(): ReactNode {
  const code = dedent`
    {
      "@qualcomm-ui/tailwind-plugin": "${tailwindVersion.tailwind}",
    }
  `
  return (
    <div className="mt-6">
      <CodeHighlight className="mdx" code={code} language="json" />
    </div>
  )
}
