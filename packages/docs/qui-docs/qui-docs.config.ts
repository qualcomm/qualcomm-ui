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
  {
    id: "introduction",
  },
  {
    id: "installation",
  },
  {
    id: "help",
    title: "Help",
  },
  {
    children: [
      {
        expanded: true,
        id: "page-setup",
      },
      {
        id: "markdown",
      },
      {
        id: "typedoc",
      },
      {
        expanded: true,
        id: "swagger",
        title: "Swagger",
      },
    ],
    expanded: true,
    id: "guide",
    title: "Guide",
  },
  {
    expanded: true,
    id: "components",
    title: "Components",
  },
  {
    expanded: true,
    id: "api",
    title: "API",
  },
]

export default {
  appDirectory: "src",
  knowledge: {
    baseUrl: "https://docs-next.qui.qualcomm.com",
    exclude: ["**/debug+/**", "*guide+/swagger*"],
    extraFiles: [
      {
        contents: readFileSync(
          resolve(__dirname, "../../frameworks/react-mdx/CHANGELOG.md"),
          "utf-8",
        ),
        id: "react-mdx-changelog",
      },
      {
        contents: readFileSync(
          resolve(__dirname, "../../common/mdx-vite/CHANGELOG.md"),
          "utf-8",
        ),
        id: "mdx-vite-changelog",
      },
    ],
  },
  navConfig,
  pageDirectory: "routes",
  pageTimestampMetadata: "user-and-timestamp",
  typeDocProps: ".typedoc/doc-props.json",
} satisfies QuiDocsConfig
