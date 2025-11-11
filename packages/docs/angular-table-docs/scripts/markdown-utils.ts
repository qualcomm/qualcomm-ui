import {ensureDirSync} from "fs-extra"
import {readFileSync, writeFileSync} from "node:fs"
import {dirname, resolve} from "node:path"
import {fileURLToPath} from "node:url"

import {dedent} from "@qualcomm-ui/utils/dedent"

const __dirname = dirname(fileURLToPath(import.meta.url))

const packagesDir = resolve(__dirname, "../../../")
const routesDir = resolve(__dirname, "../src/routes")
const changelogsDir = resolve(routesDir, "changelogs+")

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
  ensureDirSync(changelogsDir)

  copyAndAddTitle(
    resolve(packagesDir, "common/base/CHANGELOG.md"),
    resolve(changelogsDir, "./base.mdx"),
    `Base`,
  )

  copyAndAddTitle(
    resolve(packagesDir, "frameworks/angular/CHANGELOG.md"),
    resolve(changelogsDir, "./angular.mdx"),
    `Angular`,
  )

  copyAndAddTitle(
    resolve(packagesDir, "common/tailwind-plugin/CHANGELOG.md"),
    resolve(changelogsDir, "./tailwind-plugin.mdx"),
    `Tailwind Plugin`,
  )
}
