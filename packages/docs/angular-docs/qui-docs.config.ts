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
    id: "integrations",
    title: "Integrations & Configs",
  },
  {
    separator: true,
  },
  {sectionTitle: "Theming, Patterns, and Pitfalls"},
  {
    children: [
      {
        id: "overview",
      },
    ],
    id: "theming",
  },
  {
    id: "patterns",
    title: "Patterns",
  },
  {
    id: "pitfalls",
  },
  {
    id: "developer-previews",
  },
  {
    separator: true,
  },
  {
    children: [
      {
        id: "overview",
      },
      {
        group: "Data Display",
        id: "badges",
        ignoreRouteMetaOrder: true,
      },
    ],
    expanded: true,
    groupOrder: [
      "Buttons",
      "Form Controls",
      "Data Display",
      "Overlays",
      "Disclosure",
      "Feedback",
    ],
    id: "components",
    title: "Components",
  },
]

const extraFiles: KnowledgeExtraFile[] = [
  {
    contents: readFileSync(
      resolve(__dirname, "../../frameworks/angular/CHANGELOG.md"),
      "utf-8",
    ),
    id: "angular-changelog",
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
        "../../frameworks/react-internal/files/component-list.md",
      ),
      "utf-8",
    ),
    id: "component-list",
    processAsMdx: true,
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
  /*
   * Angular demos are built and copied to the public directory. The
   * angularDemoPlugin handles hot reloading when this happens, so we ignore the
   * dist directory to prevent the docsPlugin from reloading in response to the same
   * changes.
   */
  hotUpdateIgnore: /angular-demo-module|public/,
  knowledge: {
    baseUrl: "https://angular-next.qui.qualcomm.com",
    exclude: [
      "index.mdx",
      "**/components+/overview*",
      "**/components+/all-components*",
    ],
    extraFiles,
    frontmatter: {exclude: ["title", "description", "group"], include: ["*"]},
    integrations: {
      openWebUi: [{id: "qui-ai"}, {id: "saga-ai"}],
    },
  },
  navConfig,
  pageDirectory: "routes",
  pageTimestampMetadata: "user-and-timestamp",
  typeDocProps: ".typedoc/doc-props.json",
} satisfies QuiDocsConfig
