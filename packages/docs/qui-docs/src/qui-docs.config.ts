import {readFileSync} from "node:fs"
import {resolve} from "node:path"

import type {NavConfig, QuiDocsConfig} from "@qualcomm-ui/mdx-vite"

const navConfig: NavConfig[] = [
  {
    hidden: true,
    hideBreadcrumbs: true,
    hidePageLinks: true,
    hideSideNav: true,
    hideToc: true,
    id: "_index",
  },
  {id: "introduction"},
  {id: "integrations"},
  {sectionTitle: "Authoring", separator: true},
  {id: "pages"},
  {id: "markdown"},
  {id: "i18n"},
  {id: "typedoc"},
  {id: "configuration"},
  {sectionTitle: "Content Guidelines", separator: true},
  {id: "principles"},
  {id: "routing"},
  {id: "rules"},
  {sectionTitle: "Advanced", separator: true},
  {id: "ai-knowledge"},
  {id: "custom-routing"},
  {separator: true},
  {
    id: "api",
    title: "API",
  },
]

const config: QuiDocsConfig = {
  appDirectory: "src",
  knowledge: {
    baseUrl: "https://docs-next.qui.qualcomm.com",
    exclude: ["**/debug+/**", "*guide+/swagger*"],
    extraFiles: [
      {
        contents: readFileSync(
          resolve(__dirname, "../../../frameworks/react-mdx/CHANGELOG.md"),
          "utf-8",
        ),
        id: "react-mdx-changelog",
      },
      {
        contents: readFileSync(
          resolve(__dirname, "../../../common/mdx-vite/CHANGELOG.md"),
          "utf-8",
        ),
        id: "mdx-vite-changelog",
      },
    ],
  },
  navConfig,
  pageDirectory: "routes",
  pageTimestampMetadata: "user-and-timestamp",
  routingStrategy: "react-router-directory-groups",
  typeDocProps: ".typedoc/doc-props.json",
}

export default config
