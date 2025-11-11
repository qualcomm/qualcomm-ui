import {existsSync, mkdirSync, readFileSync, writeFileSync} from "node:fs"
import {dirname, resolve} from "node:path"
import {fileURLToPath} from "node:url"

import {dedent} from "@qualcomm-ui/utils/dedent"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const packagesDir = resolve(__dirname, "../../../")
const routesDir = resolve(__dirname, "../src/routes")

const fileTemplate = (title: string, fileContents: string) => dedent`
  ---
  hideBreadcrumbs: true
  hideFromSearch: true
  title: ${title}
  ---
  
  ${fileContents}
`

function copyAndAddTitle(src: string, dest: string, title: string) {
  const fileContents = readFileSync(src, "utf-8")
  writeFileSync(dest, fileTemplate(title, fileContents), "utf-8")
}

export function copyMarkdown() {
  const changelogDir = resolve(routesDir, "changelogs+")

  if (!existsSync(changelogDir)) {
    mkdirSync(changelogDir)
  }

  copyAndAddTitle(
    resolve(packagesDir, "./frameworks/react/CHANGELOG.md"),
    resolve(changelogDir, "react.mdx"),
    `React`,
  )

  copyAndAddTitle(
    resolve(packagesDir, "./frameworks/mdx-docs/CHANGELOG.md"),
    resolve(changelogDir, "mdx-docs.mdx"),
    `MDX Docs`,
  )

  copyAndAddTitle(
    resolve(packagesDir, "./common/mdx-vite/CHANGELOG.md"),
    resolve(changelogDir, "mdx-vite.mdx"),
    `MDX Vite`,
  )
}
