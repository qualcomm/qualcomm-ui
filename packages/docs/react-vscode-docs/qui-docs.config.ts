import {readFileSync} from "node:fs"
import {resolve} from "node:path"

import type {
  KnowledgeExtraFile,
  NavConfig,
  QuiDocsConfig,
} from "@qualcomm-ui/mdx-vite"

const navConfig: NavConfig[] = [
  {sectionTitle: "Getting Started"},
  {
    hidden: true,
    id: "_index",
  },
  {
    id: "installation",
  },
  {
    id: "setup",
  },
  {
    id: "integrations",
    title: "Integrations & Configs",
  },
  {separator: true},
  {
    expanded: true,
    id: "components",
    title: "Components",
  },
]

const extraFiles: KnowledgeExtraFile[] = [
  {
    contents: readFileSync(
      resolve(__dirname, "../../frameworks/react-vscode/CHANGELOG.md"),
      "utf-8",
    ),
    id: "react-changelog",
  },
  {
    contents: readFileSync(
      resolve(__dirname, "../../common/core/CHANGELOG.md"),
      "utf-8",
    ),
    id: "core-changelog",
  },
  {
    contents: readFileSync(
      resolve(
        __dirname,
        "../../frameworks/react-internal/files/mcp-server-setup.md",
      ),
      "utf-8",
    ),
    id: "mcp-server-setup",
  },
]

export default {
  appDirectory: "src",
  knowledge: {
    baseUrl: "https://react-next.qui.qualcomm.com",
    exclude: [
      "**/installation+/**",
      "index.mdx",
      "**/components+/overview*",
      "**/components+/overview*",
    ],
    extraFiles,
    frontmatter: {exclude: ["url"], include: ["*"]},
    integrations: {
      openWebUi: [{id: "qui-ai"}, {id: "saga-ai"}, {id: "saga-ai-test"}],
    },
  },
  navConfig,
  pageDirectory: "routes",
  pageTimestampMetadata: "user-and-timestamp",
  typeDocProps: ".typedoc/doc-props.json",
} satisfies QuiDocsConfig
