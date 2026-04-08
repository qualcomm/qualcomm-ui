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
  {sectionTitle: "Theming & Patterns"},
  {
    children: [{id: "overview"}],
    id: "theming",
  },
  {
    children: [
      {
        id: "overview",
      },
      {
        id: "introduction-to-javascript",
      },
      {
        children: [{id: "clean-code"}],
        id: "clean-code",
        ignoreRouteMetaOrder: true,
      },
    ],
    id: "patterns",
    title: "Patterns & Best Practices",
  },
  {
    id: "developer-previews",
  },
  {separator: true},
  {
    sectionTitle: "Composition",
  },
  {
    id: "polymorphic-components",
  },
  {
    id: "render-props",
  },
  {separator: true},
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
  {separator: true},
  {
    children: [
      {id: "overview"},
      {id: "getting-started"},
      {id: "architecture"},
      {id: "headless-core"},
      {id: "qds-core"},
      {id: "react-component"},
      {id: "angular-component"},
      {id: "react-documentation"},
      {id: "angular-documentation"},
      {id: "testing-guidelines"},
      {id: "build-system"},
      {id: "code-quality"},
    ],
    id: "contribution-guidelines",
  },
  {
    id: "troubleshooting",
  },
  {
    hidden: true,
    hideBreadcrumbs: true,
    hidePageLinks: true,
    hideSideNav: true,
    id: "debug",
  },
]

const extraFiles: KnowledgeExtraFile[] = [
  {
    contents: readFileSync(
      resolve(__dirname, "../../frameworks/react/CHANGELOG.md"),
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
